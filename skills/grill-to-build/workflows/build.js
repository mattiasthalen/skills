export const meta = {
  name: 'build',
  description: 'A grill-to-build run from a confirmed plan: every slice in order, each a slice workflow, the branches stacked',
  whenToUse: 'Once the plan is confirmed. Pass the plan and the pointers as args; slice.js beside it does each slice.',
  phases: [{ title: 'Slices', detail: 'one agent: the slices from the plan, in order' }],
}

// The whole build of grill-to-build, run by path once the plan is confirmed, with the pointers as args:
//   plan         the plan file the user confirmed in plan mode
//   base         the branch the first slice stacks on
//   records      a directory outside the repository; each slice gets a subdirectory
//   ledger       the ledger, outside the repository
//   adr          the MADR directory, inside the repository
//   script       the path of slice.js
//   from         optional: the slice to start at; earlier ones are done, their branches in place
//   attackFloor  optional: kills per attacked finding below which the next slice runs without the attack
//   models, rungs, ladder   optional, passed to every slice
// It returns the stack: every slice's digest, the PRs in order, and what is unfinished.

const need = ['plan', 'base', 'records', 'ledger', 'adr', 'script']
const missing = need.filter(k => !args || !args[k])
if (missing.length) throw new Error(`build.js needs args ${need.join(', ')}; missing ${missing.join(', ')}`)
const { plan, records, ledger, adr, script } = args
const FLOOR = args.attackFloor == null ? 0.1 : args.attackFloor
const CAP = 1000 // the runtime's agents per run
const WARN = 800

// The same levels, table and ladder as slice.js, for the one agent this script runs itself.
const LEVELS = ['trivial', 'routine', 'hard', 'novel']
const asRung = r => (typeof r === 'string' ? r : `${r.model}/${r.effort}`)
const LADDER = (args.ladder || ['haiku/low', 'sonnet/low', 'sonnet/high', 'opus/low', 'opus/high', 'fable/high']).map(asRung)
const RUNGS = { trivial: 'haiku/low', routine: 'sonnet/low', hard: 'opus/high', novel: 'fable/high' }
for (const [level, rung] of Object.entries(args.rungs || {})) RUNGS[level] = asRung(rung)
const rungIndex = rung => {
  const i = LADDER.indexOf(rung)
  if (i < 0) throw new Error(`${rung} is not a rung of the ladder: ${LADDER.join(', ')}`)
  return i
}
const UNSURE = 0.6
const escalations = []
let agents = 0
async function climb(job, start, prompt, opts, signal) {
  let last = null
  for (let i = rungIndex(start); i < LADDER.length; i++) {
    const rung = LADDER[i]
    const [model, effort] = rung.split('/')
    agents++
    const result = await agent(prompt, { ...opts, model, effort, label: `${opts.label} @ ${rung}` })
    if (result != null) last = result
    const why = result == null ? 'no result' : signal(result)
    if (!why) return result
    const to = LADDER[i + 1] || null
    escalations.push({ job, at: rung, signal: why, to })
    log(`${job}: ${why} at ${rung}${to ? `, climbing to ${to}` : ', top of the ladder'}`)
  }
  return last
}
const named = name => {
  const v = args.models && args.models[name]
  if (v == null) return null
  const rung = RUNGS[v] || asRung(v)
  rungIndex(rung)
  return rung
}

const SLICES = {
  type: 'object',
  required: ['slices', 'confidence'],
  properties: {
    slices: { type: 'array', items: { type: 'object', required: ['name', 'branch', 'level'], properties: { name: { type: 'string' }, branch: { type: 'string' }, level: { type: 'string', enum: LEVELS }, lens: { type: 'string' } } } },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
  },
}

// The slices, from the plan, in order.
const listed = await climb(
  'slices',
  named('slices') || RUNGS.routine,
  `Read the plan at ${plan} and return its slices in build order: each one's name as the plan gives it, the branch it lands on (as the plan names it, or a short kebab-case name from the slice's), how hard the plan says it is (trivial, routine, hard or novel; unnamed is routine), and the review the plan asks for on that slice alone, as a job for a reviewer, where it asks for one. Return your confidence in the list on your own scale, 0 to 1.`,
  { label: 'slices', phase: 'Slices', schema: SLICES },
  r => (!r.slices.length ? 'empty' : r.confidence < UNSURE ? 'unsure' : null),
)
if (!listed || !listed.slices.length) throw new Error(`the plan at ${plan} names no slices`)
let slices = listed.slices
let base = args.base
if (args.from) {
  const i = slices.findIndex(s => s.name === args.from || s.branch === args.from)
  if (i < 0) throw new Error(`from: no slice named ${args.from}; the plan names ${slices.map(s => s.name).join(', ')}`)
  if (i > 0) base = slices[i - 1].branch
  slices = slices.slice(i)
}
log(`Slices: ${slices.map(s => `${s.name} (${s.level})`).join(', ')}, on ${base}`)

// A slice at a time, each a child workflow, each stacked on the last. The attack rule: when a slice's
// kill rate falls under the floor, the attack has stopped paying for its run, and the next slice runs without it.
const stack = []
const unfinished = []
const attackOff = []
let attack = true
for (let i = 0; i < slices.length; i++) {
  const s = slices[i]
  log(`Slice ${i + 1}/${slices.length}: ${s.name} (${s.level}), ${base} -> ${s.branch}${attack ? '' : ', attack off'}`)
  phase(`Slice ${i + 1} - ${s.name}`)
  const digest = await workflow({ scriptPath: script }, {
    slice: s.name,
    plan,
    base,
    branch: s.branch,
    records: `${records}/${s.branch}`,
    ledger,
    adr,
    index: i + 1,
    lens: s.lens || undefined,
    attack,
    models: args.models,
    rungs: args.rungs,
    ladder: args.ladder,
  })
  if (!digest) {
    unfinished.push(`${s.name}: the slice workflow returned nothing`)
    stack.push({ slice: s.name, branch: s.branch, base, attack, digest: null })
    base = s.branch
    continue
  }
  stack.push({ slice: s.name, branch: s.branch, base, attack, digest })
  agents += digest.agents || 0
  for (const u of digest.unfinished || []) unfinished.push(`${s.name}: ${u}`)
  const f = digest.findings || {}
  if (attack && f.attacked) {
    const rate = f.killed / f.attacked
    if (rate < FLOOR) {
      attack = false
      attackOff.push({ after: s.name, attacked: f.attacked, killed: f.killed, floor: FLOOR })
      log(`Slice ${s.name}: ${f.killed} of ${f.attacked} killed, under ${FLOOR}: the attack is off from here`)
    }
  }
  const p = digest.pr || {}
  log(`Slice ${s.name}: ${digest.commits} commits, ${f.found || 0} findings, ${f.killed == null ? 'not attacked' : `${f.killed} of ${f.attacked} killed`}, PR ${p.url || 'none'}${p.url ? (p.ready ? ', ready' : ', draft') : ''}, ${agents} agents so far`)
  if (agents > WARN) log(`${agents} agents this run; the cap is ${CAP}`)
  base = s.branch
}

return {
  plan,
  base: args.base,
  slices: stack, // per slice: its branch, what it stacked on, whether it was attacked, and its digest
  prs: stack.map(s => ({ slice: s.slice, ...(s.digest ? s.digest.pr : { url: '', ready: false }) })),
  agents, // this script's own calls plus every slice's, against the run's cap
  attackOff, // the slice after which the attack stopped paying, and its numbers
  escalations, // this script's own, from listing the slices
  unfinished, // empty when every slice is done
}
