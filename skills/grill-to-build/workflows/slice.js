export const meta = {
  name: 'slice',
  description: 'One slice of a grill-to-build run: frame, a seam at a time, verify, attack, repair, close',
  whenToUse: 'One slice of a confirmed plan, with the pointers as args. build.js beside it runs every slice. Phases, each prefixed with the slice: Frame; one per seam, a build, a review, a repair; Verify, the lenses at once; Attack, a skeptic per finding; Repair, a file at a time; Close, a clean clone and the PR marked ready.',
}

// One slice of grill-to-build, run by path with the pointers as args:
//   slice    the slice, as the plan names it
//   plan     the plan file the user confirmed in plan mode
//   base     the branch this slice stacks on: the previous slice's, or the trunk for the first
//   branch   this slice's branch
//   records  a directory outside the repository for frame.md, findings.md and pr.md
//   ledger   the ledger, outside the repository
//   adr      the MADR directory, inside the repository
//   label    optional: the prefix of this slice's phases in the progress view; the branch by default
//   index    optional: this slice's 1-based position in the build, for its label; 1 by default
//   total    optional: how many slices the build has, for its label; 1 by default
//   lens     optional: the slice-specific lens, as a job for a reviewer
//   attack   optional: false when the last slice's kill count says the attack stopped paying
//   models   optional: a level or a rung by name, for a job, a seam, or a lens
//   rungs    optional: the rung each level maps to
//   ladder   optional: the rungs for climbing, lowest first, as model/effort
// It returns pointers and numbers, never contents. Each seam is its own phase, and every agent's
// label carries the slice's and seam's position, so a build of several slices reads slice by
// slice, seam by seam, in /workflows even where nested runs collapse to one flat list.

const need = ['slice', 'plan', 'base', 'branch', 'records', 'ledger', 'adr']
const missing = need.filter(k => !args || !args[k])
if (missing.length) throw new Error(`slice.js needs args ${need.join(', ')}; missing ${missing.join(', ')}`)
const { slice, plan, base, branch, records, ledger, adr } = args
const attack = args.attack !== false
const frame = `${records}/frame.md`
const range = `${base}..${branch}`
const SLICE = `Slice ${args.index || 1}/${args.total || 1}`
const P = `${args.label || branch}: ` // the prefix of every phase of this slice

// Complexity, not role: a task's level sets its rungs. The plan names levels, the frame checks
// them against the code, args.models overrides by name. A review sits one rung above what it reviews.
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
for (const [level, rung] of Object.entries(RUNGS)) {
  if (!LEVELS.includes(level)) throw new Error(`${level} is not a level: ${LEVELS.join(', ')}`)
  rungIndex(rung)
}
const above = rung => LADDER[Math.min(rungIndex(rung) + 1, LADDER.length - 1)]
const MODELS = args.models || {}
// What the driver named for this name, as a rung: a level maps through the table, a rung stands as given.
const named = name => {
  const v = MODELS[name]
  if (v == null) return null
  const rung = RUNGS[v] || asRung(v)
  rungIndex(rung)
  return rung
}
const UNSURE = 0.6 // below this, on its own scale, an agent is unsure
const WIDEST = 20 // twenty findings is the widest work in a slice
const escalations = []
const models = { seams: {} }
let agents = 0

// Every agent names its model and effort, and climbs the ladder from its rung on a signal:
// signal(result) returns why to climb, or null when the result stands.
async function climb(job, start, prompt, opts, signal) {
  let last = null
  for (let i = rungIndex(start); i < LADDER.length; i++) {
    const rung = LADDER[i]
    const [model, effort] = rung.split('/')
    agents++
    const result = await agent(prompt, { ...opts, model, effort })
    if (result != null) last = result
    const why = result == null ? 'no result' : signal(result)
    if (!why) return result
    const to = LADDER[i + 1] || null
    escalations.push({ job, at: rung, signal: why, to })
    log(`${job}: ${why} at ${rung}${to ? `, climbing to ${to}` : ', top of the ladder'}`)
  }
  return last
}
const unsure = r => (r.confidence < UNSURE ? 'unsure' : null)
const where = f => `${f.file}${f.line != null ? `:${f.line}` : ''}`
const listOf = items => items.map(f => `${f.id}. [${f.severity}] ${f.title}, at ${where(f)}\n   ${f.detail}`).join('\n')
const RECORDS_RULE = `The ledger and everything under ${records} are the driver's records; the repository's commits carry source, tests and ADRs only.`
const REPORT_RULE = 'Report each finding at the file and line it lives on, with a one-line title, the detail a repairer needs, and a severity of high, medium or low. Return an empty list when there is nothing to find'
const SCALE = 'your confidence on your own scale, 0 to 1'

const CONFIDENCE = { type: 'number', minimum: 0, maximum: 1 }
const LEVEL = { type: 'string', enum: LEVELS }
const PLANNED = { type: 'string', enum: [...LEVELS, ''] }
const FRAME = {
  type: 'object',
  required: ['seams', 'checks', 'decisions', 'build', 'accept', 'planned', 'level', 'confidence'],
  properties: {
    seams: { type: 'array', items: { type: 'object', required: ['name', 'check', 'planned', 'level'], properties: { name: { type: 'string' }, check: { type: 'string' }, planned: PLANNED, level: LEVEL } } },
    checks: { type: 'array', items: { type: 'string' } },
    decisions: { type: 'array', items: { type: 'object', required: ['title', 'check'], properties: { title: { type: 'string' }, check: { type: 'string' } } } },
    build: { type: 'array', items: { type: 'string' } },
    accept: { type: 'array', items: { type: 'string' } },
    planned: PLANNED,
    level: LEVEL,
    confidence: CONFIDENCE,
  },
}
const BUILT = {
  type: 'object',
  required: ['range', 'commits', 'adrs', 'done', 'pr', 'note', 'confidence'],
  properties: {
    range: { type: 'string' },
    commits: { type: 'integer' },
    adrs: { type: 'array', items: { type: 'object', required: ['path', 'confirmation'], properties: { path: { type: 'string' }, confirmation: { type: 'string' } } } },
    done: { type: 'boolean' },
    pr: { type: 'string' },
    note: { type: 'string' },
    confidence: CONFIDENCE,
  },
}
const FINDINGS = {
  type: 'object',
  required: ['findings', 'confidence'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        required: ['file', 'title', 'detail', 'severity'],
        properties: {
          file: { type: 'string' },
          line: { type: 'integer' },
          title: { type: 'string' },
          detail: { type: 'string' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
      },
    },
    confidence: CONFIDENCE,
  },
}
const VERDICT = {
  type: 'object',
  required: ['refuted', 'reason', 'confidence'],
  properties: { refuted: { type: 'boolean' }, reason: { type: 'string' }, confidence: CONFIDENCE },
}
const REPAIRED = {
  type: 'object',
  required: ['outcomes', 'confidence'],
  properties: {
    outcomes: { type: 'array', items: { type: 'object', required: ['id', 'fixed', 'note'], properties: { id: { type: 'integer' }, fixed: { type: 'boolean' }, note: { type: 'string' }, sha: { type: 'string' } } } },
    confidence: CONFIDENCE,
  },
}
const CLOSED = {
  type: 'object',
  required: ['pr', 'ready', 'commits', 'note', 'confidence'],
  properties: { pr: { type: 'string' }, ready: { type: 'boolean' }, commits: { type: 'integer' }, note: { type: 'string' }, confidence: CONFIDENCE },
}

// Frame: the seams in order, their checks, their levels, and how the slice proves itself.
const frameRung = named('frame') || RUNGS.routine
models.frame = { rung: frameRung, by: named('frame') ? 'driver' : 'default' }
log(`Frame: ${slice}, at ${frameRung}`)
const framed = await climb(
  'frame',
  frameRung,
  `Frame slice "${slice}" of the plan at ${plan}, on top of branch ${base}.
Read the plan, then the code as ${base} has it. Create ${branch} from ${base} if it does not exist and leave it at ${base}: the first commit is the first seam's.
Write ${frame}, the driver's record, outside the repository, with a heading for each of these:
1. What is in the slice, and what is deliberately not.
2. The seams in build order, each with the first failing check it starts from: one seam, one test, one minimal implementation.
3. The checks the rest gets.
4. The decisions that need a MADR, each with the check its Confirmation will name.
5. The files it expects to touch.
6. The build from a clean clone and the acceptance check, as exact commands.
7. The commit convention in use.
8. Levels. The plan says how hard each seam is and the slice as a whole, trivial, routine, hard or novel; unnamed in the plan is routine. Give each as the plan has it, and beside it your own after reading the code, kept where the code agrees and moved either way where it does not.
The frame is written when every item above has a heading in it. Return the structure, not the prose: seams (name, check, planned, level), checks, decisions, build, accept, the slice's planned and level, and ${SCALE}.`,
  { label: `${SLICE} - Frame`, phase: `${P}Frame`, schema: FRAME },
  r => (!r.seams.length && !r.checks.length ? 'empty' : unsure(r)),
)
if (!framed) throw new Error('no frame: the frame agent returned nothing at any rung')

// The slice's level sets the whole-slice jobs; the driver may name the slice by args.models.slice or by its name.
const sliceNamed = named('slice') || named(slice)
const sliceRung = sliceNamed || RUNGS[framed.level]
const sliceBy = sliceNamed ? 'driver' : framed.planned === framed.level ? 'plan' : 'frame'
const rungFor = (job, fallback) => named(job) || fallback
models.slice = {
  level: framed.level,
  by: sliceBy,
  review: rungFor('review', above(sliceRung)),
  attack: rungFor('attack', sliceRung),
  repair: rungFor('repair', sliceRung),
  recompute: rungFor('recompute', RUNGS.routine),
  close: rungFor('close', RUNGS.routine),
}
log(`Slice: ${framed.level} (${sliceBy}), ${framed.seams.length} seams, ${framed.decisions.length} decisions`)

const findings = [] // every finding of the slice, seam and whole, with its fate
const adrs = []
const unfinished = []
const seams = []
let pr = ''

// A seam at a time, each its own phase: build, a review one rung above, a repair of what it found.
for (let i = 0; i < framed.seams.length; i++) {
  const s = framed.seams[i]
  const title = `Seam ${i + 1}: ${s.name}`
  const phase = `${P}${title}`
  const seamPos = `Seam ${i + 1}/${framed.seams.length}`
  const seamLabel = step => `${SLICE} - ${seamPos} - ${step}: ${s.name} @ ${s.level}`
  const seamNamed = named(s.name)
  const build = seamNamed || RUNGS[s.level]
  const rungs = {
    level: s.level,
    by: seamNamed ? 'driver' : s.planned === s.level ? 'plan' : 'frame',
    build,
    review: named(`${s.name} review`) || above(build),
    repair: named(`${s.name} repair`) || build,
  }
  models.seams[s.name] = rungs
  const out = { name: s.name, level: s.level, done: false, commits: 0, findings: 0, fixed: 0, writtenDown: 0 }
  seams.push(out)
  log(`${title}: ${s.level}, build at ${rungs.build}, review at ${rungs.review}`)

  const built = await climb(
    `${title} build`,
    rungs.build,
    `Build seam "${s.name}" of slice "${slice}" on branch ${branch}.
Read the ledger at ${ledger}, then the frame at ${frame}, and continue from the ledger's last line where an earlier agent stopped.
Write the seam's failing check first, ${s.check}, and watch it fail. Write only enough to pass it, then run the seam's other checks from the frame. Commit red and green together as one conventional commit.
A decision the frame lists for this seam gets a MADR in ${adr} at the moment you make it; its Confirmation names a check that exists in the tree, which you ran against the mutation and watched fail.
Append one line to ${ledger} per commit: timestamp from date -u, sha, what and why. ${RECORDS_RULE}
Push ${branch}.${pr ? '' : ` Open a draft pull request from ${branch} onto ${base}, titled for the slice, its body the summary in ${frame}, and return its URL, or an empty string with the reason in the note.`}
Return the seam's range as the sha before it and the sha after it from git log, its commit count, its ADRs with the check each Confirmation names, done (true once the check passes and the commit is in), the pull request URL, the note, and ${SCALE}.`,
    { label: seamLabel('Build'), phase, schema: BUILT },
    r => (!r.done ? 'unfinished' : unsure(r)),
  )
  if (!built) {
    unfinished.push(`${title}: no result at any rung`)
    continue
  }
  if (built.pr && !pr) pr = built.pr
  out.done = built.done
  out.commits = built.commits
  adrs.push(...built.adrs)
  if (!built.done) unfinished.push(`${title}: not done at the top of the ladder`)

  const reviewed = await climb(
    `${title} review`,
    rungs.review,
    `Review seam "${s.name}" of slice "${slice}": the diff ${built.range} on branch ${branch}, and the code it touches. Look for defects, and for the refactoring the green left behind: duplication, naming, structure. Check that the seam's test, ${s.check}, fails without the change it guards.
${REPORT_RULE}, and ${SCALE}.`,
    { label: seamLabel('Review'), phase, schema: FINDINGS },
    unsure,
  )
  const found = (reviewed ? reviewed.findings : []).map(f => ({ ...f, id: findings.length + 1 + (reviewed.findings.indexOf(f)), lens: `${title} review`, stage: 'seam', fate: 'stands', note: '', sha: '' }))
  findings.push(...found)
  out.findings = found.length
  if (!found.length) continue

  const done = await climb(
    `${title} repair`,
    rungs.repair,
    `Repair seam "${s.name}" of slice "${slice}" on branch ${branch}. The findings, by id:
${listOf(found)}
Read the ledger at ${ledger} first: an earlier agent may have fixed some of these. For each finding, fix it, or write down why it stays, a reason a reviewer would accept. Run the seam's check and the frame's checks (${frame}) after each fix. Commit each fix as its own conventional commit, append one line to ${ledger} for it (timestamp from date -u, sha, what and why), and push. ${RECORDS_RULE}
Return every id with fixed true or false, the note, the sha when fixed, and ${SCALE}.`,
    { label: seamLabel('Repair'), phase, schema: REPAIRED },
    unsure,
  )
  for (const f of found) {
    const o = done && done.outcomes.find(o => o.id === f.id)
    if (!o) {
      f.fate = 'unrepaired'
      f.note = done ? 'no outcome returned for it' : 'no result at any rung'
      continue
    }
    f.fate = o.fixed ? 'fixed' : 'written down'
    f.note = o.note
    f.sha = o.sha || ''
    if (o.fixed) out.fixed++
    else out.writtenDown++
  }
}

// Verify: the lenses at once on the whole, one rung above the slice's. Code review and security review
// must both run; recomputation is the cheapest lens on the board and the one that refuses a slice that does not build.
const review = (lens, job) =>
  climb(
    lens,
    named(lens) || models.slice.review,
    `Review slice "${slice}": branch ${branch}, the diff ${range}, the frame at ${frame}. Read the diff and the code it touches, and ${job}.
${REPORT_RULE}, and ${SCALE}.`,
    { label: `${SLICE} - Verify: ${lens}`, phase: `${P}Verify`, schema: FINDINGS },
    r => (!r.findings.length ? 'empty' : unsure(r)),
  )
const recompute = (label, phase) =>
  climb(
    label,
    models.slice.recompute,
    `Recompute slice "${slice}" from nothing. Clone the local repository fresh into a temporary directory, check out ${branch} there, and run everything that follows in that clone: the build from a clean clone and the acceptance check the frame at ${frame} names, then, for every MADR under ${adr} that ${range} adds, the check its Confirmation names.
Each command that fails is a finding, with its output as the detail and the file it points at; a check that does not exist is a finding on the ADR that names it. Return an empty list when everything runs, and ${SCALE}.`,
    { label, phase, schema: FINDINGS },
    unsure,
  )
const LENSES = [
  ['code review', 'look for defects: logic, error handling, data flow, boundaries, how the seams fit together, anything that makes the diff wrong for a caller'],
  ['security review', 'look for what an attacker could use: input reaching a sink unchecked, secrets, permissions, injection, unsafe defaults'],
  ['test quality', 'check every test the diff adds: would it fail without the change it guards, does it test the seam it names, is the red real. Run it against the mutation where you can'],
  ['conventions', 'check the diff against the conventions the repository and the plan set: commit format, naming, structure, the MADR format, where files go'],
]
if (args.lens) LENSES.push(['slice lens', args.lens])

// A barrier: findings are deduplicated across lenses before anything is spent on them.
const reviewed = (await parallel([
  ...LENSES.map(([lens, job]) => () => review(lens, job).then(r => [lens, r])),
  () => recompute(`${SLICE} - Verify: recomputation`, `${P}Verify`).then(r => ['recomputation', r]),
])).filter(Boolean)
const reviews = reviewed.filter(([, r]) => r).map(([lens]) => lens)
for (const must of ['code review', 'security review', 'recomputation'])
  if (!reviews.includes(must)) unfinished.push(`${must}: no result at any rung`)

let duplicates = 0
const seen = new Set()
for (const [lens, r] of reviewed) {
  if (!r) continue
  for (const f of r.findings) {
    const key = `${f.file}:${f.line != null ? f.line : f.title.toLowerCase()}`
    if (seen.has(key)) { duplicates++; continue }
    seen.add(key)
    findings.push({ ...f, id: findings.length + 1, lens, stage: 'slice', fate: 'stands', note: '', sha: '' })
  }
}
const whole = () => findings.filter(f => f.stage === 'slice')
log(`Verify: ${whole().length} findings from ${reviews.length} lenses, ${duplicates} duplicates dropped`)

// Attack: one skeptic per finding, on the slice's rung. Attacked and killed go back in the digest, because
// an attack that has stopped killing has stopped paying for its run.
let attacked = null
let killed = null
if (attack && whole().length) {
  const targets = whole()
  attacked = targets.length
  killed = 0
  const verdicts = await parallel(targets.map(f => () =>
    climb(
      `attack #${f.id}`,
      models.slice.attack,
      `Refute this finding from the ${f.lens} of branch ${branch} (${range}):
${f.title}, at ${where(f)}
${f.detail}
Read the code it names. It stands if it is real and worth fixing in this slice; it is refuted if it is wrong, already handled, or outside the slice as the frame at ${frame} draws it. Give the reason in one line, and ${SCALE}. A verdict you cannot settle is a low confidence, not a guess.`,
      { label: `${SLICE} - Attack #${f.id}`, phase: `${P}Attack`, schema: VERDICT },
      unsure,
    )))
  verdicts.forEach((v, i) => {
    if (v && v.refuted && v.confidence >= UNSURE) {
      targets[i].fate = 'killed'
      targets[i].note = v.reason
      killed++
    }
  })
  log(`Attack: ${attacked} attacked, ${killed} killed`)
}

// Repair: the most severe twenty, grouped by file, one agent per file, in turn. One working tree,
// one branch, one index. The rest is written down as deferred, and said so.
const RANK = { high: 0, medium: 1, low: 2 }
const standing = whole().filter(f => f.fate === 'stands').sort((a, b) => RANK[a.severity] - RANK[b.severity] || a.id - b.id)
for (const f of standing.slice(WIDEST)) {
  f.fate = 'deferred'
  f.note = `beyond the widest work in a slice, ${WIDEST} findings`
}
if (standing.length > WIDEST) log(`Repair: ${standing.length - WIDEST} findings deferred beyond ${WIDEST}`)

const byFile = items => {
  const groups = []
  for (const f of items) {
    const g = groups.find(g => g.file === f.file)
    if (g) g.items.push(f)
    else groups.push({ file: f.file, items: [f] })
  }
  return groups
}
async function repair(group, phase) {
  const done = await climb(
    `repair ${group.file}`,
    models.slice.repair,
    `Repair ${group.file} on branch ${branch}. The findings, by id:
${listOf(group.items)}
Read the ledger at ${ledger} first: an earlier agent may have fixed some of these. For each finding, fix it, or write down why it stays, a reason a reviewer would accept. Run the checks the frame at ${frame} names after each fix. Commit each fix as its own conventional commit, append one line to ${ledger} for it (timestamp from date -u, sha, what and why), and push. ${RECORDS_RULE}
Return every id with fixed true or false, the note, the sha when fixed, and ${SCALE}.`,
    { label: `${SLICE} - Repair: ${group.file}`, phase, schema: REPAIRED },
    unsure,
  )
  for (const f of group.items) {
    const o = done && done.outcomes.find(o => o.id === f.id)
    if (!o) {
      f.fate = 'unrepaired'
      f.note = done ? 'no outcome returned for it' : 'no result at any rung'
      continue
    }
    f.fate = o.fixed ? 'fixed' : 'written down'
    f.note = o.note
    f.sha = o.sha || ''
  }
}
const groups = byFile(standing.slice(0, WIDEST))
for (const g of groups) await repair(g, `${P}Repair`)
const count = (fate, stage = 'slice') => findings.filter(f => f.stage === stage && f.fate === fate).length
log(`Repair: ${groups.length} files, ${count('fixed')} fixed, ${count('written down')} written down`)

// Close: done means it builds from a clean clone after the repairs. One more round on what the clean
// clone finds, then the findings written down, the PR body checked against the record, the PR marked ready.
let clean = await recompute(`${SLICE} - Close: clean clone`, `${P}Close`)
if (clean && clean.findings.length) {
  const again = clean.findings.map((f, i) => ({ ...f, id: findings.length + 1 + i, lens: 'clean clone', stage: 'slice', fate: 'stands', note: '', sha: '' }))
  findings.push(...again)
  for (const g of byFile(again)) await repair(g, `${P}Close`)
  clean = await recompute(`${SLICE} - Close: clean clone, again`, `${P}Close`)
}
const builds = !!clean && !clean.findings.length
if (!builds) unfinished.push(clean ? `clean clone: ${clean.findings.map(f => f.title).join('; ')}` : 'clean clone: no result at any rung')

const table = findings
  .map(f => `${f.id}. [${f.severity}] ${where(f)}: ${f.title} (${f.lens}) -> ${f.fate}${f.sha ? ` ${f.sha}` : ''}${f.note ? `, ${f.note}` : ''}`)
  .join('\n')
const closed = await climb(
  'close',
  models.slice.close,
  `Close slice "${slice}" on branch ${branch} (${range}), stacked on ${base}.
1. Write ${records}/findings.md from this table, one line per finding as given, under a heading naming the reviews that ran: ${reviews.join(', ')}. It is the driver's record and stays out of the repository.
${table || '(no findings)'}
2. Write ${records}/pr.md: what the slice is, from the frame at ${frame}; the seams built; the ADRs by path; the reviews that ran; the findings numbers; and every finding written down, with its reason. Check every claim in it against git log ${range} and git diff ${range}, and take out any the log or diff does not support. Set it as the body of the pull request${pr ? ` at ${pr}` : `, opening one from ${branch} onto ${base} first`}.
3. ${builds ? 'The slice builds from a clean clone: mark the pull request ready for review.' : 'The slice does not build from a clean clone: leave the pull request a draft and say so in the note.'}
Append one line to ${ledger}: timestamp from date -u, the sha of ${branch}, what and why. ${RECORDS_RULE}
Return the pull request URL, ready (true once it is marked ready for review), the commit count from git rev-list --count ${range}, the note, and ${SCALE}.`,
  { label: `${SLICE} - Close`, phase: `${P}Close`, schema: CLOSED },
  unsure,
)
const unrepaired = findings.filter(f => f.fate === 'unrepaired').length
if (unrepaired) unfinished.push(`${unrepaired} findings unrepaired: no outcome came back for them`)
if (!closed) unfinished.push('close: no result at any rung')
else if (!closed.pr) unfinished.push(`pull request: ${closed.note}`)
else if (builds && !closed.ready) unfinished.push(`pull request not marked ready: ${closed.note}`)

// The digest: pointers and numbers. The width numbers are in the run record, not here.
return {
  slice,
  branch,
  base,
  range,
  commits: closed ? closed.commits : seams.reduce((n, s) => n + s.commits, 0),
  records: { frame, findings: `${records}/findings.md`, pr: `${records}/pr.md`, ledger },
  adrs,
  seams,
  reviews, // the lenses that ran; the slice report lists them by run id
  findings: {
    found: whole().length,
    duplicates,
    attacked,
    killed,
    fixed: count('fixed'),
    writtenDown: count('written down'),
    deferred: count('deferred'),
    unrepaired: count('unrepaired'),
  },
  cleanClone: builds,
  pr: { url: closed ? closed.pr : pr, ready: !!closed && closed.ready },
  models, // per seam and per job: the level, who set it, the rungs
  escalations, // each: the job, the rung it was at, the signal, the rung it climbed to
  agents, // agent calls this slice made, against the run's cap
  unfinished, // empty when the slice is done
}
