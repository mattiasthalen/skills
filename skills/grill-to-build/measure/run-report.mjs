// Read a saved session's logs and print what Width asks for after every run.
//   node run-report.mjs <session-dir>
// <session-dir> holds workflows/wf_*.json, the run records, and
// subagents/workflows/<runId>/agent-*.jsonl, the transcripts where the usage lives.
// Both are what a session leaves behind: keep the pair and the run stays measurable.
// The run record carries the script it ran, so a number is always against a known version.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'

const dir = process.argv[2]
if (!dir || !existsSync(join(dir, 'workflows'))) {
  console.error('usage: node run-report.mjs <session-dir>   (needs <dir>/workflows/wf_*.json)')
  process.exit(1)
}
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0 }
const sum = a => a.reduce((n, x) => n + x, 0)
const n0 = x => Math.round(x).toLocaleString('en-US')

// Every agent the run records name, by id: its label, its phase, whether it was a cache hit.
const runs = readdirSync(join(dir, 'workflows')).filter(f => /^wf_.*\.json$/.test(f))
const agents = new Map()
const perRun = []
for (const f of runs) {
  const d = JSON.parse(readFileSync(join(dir, 'workflows', f), 'utf8'))
  const prog = d.workflowProgress || []
  perRun.push({
    name: d.workflowName, id: d.runId, status: d.status, count: d.agentCount,
    phases: prog.filter(x => x.type === 'workflow_phase').map(x => x.title),
    cached: prog.filter(x => x.type === 'workflow_agent' && x.cached).length,
  })
  for (const x of prog) if (x.type === 'workflow_agent' && x.agentId) agents.set(x.agentId, x)
}

function classify(L) {
  if (/attack/i.test(L)) return 'attack'
  if (/^Seam/i.test(L)) return /build/i.test(L) ? 'seam build' : /review/i.test(L) ? 'seam review' : 'seam repair'
  if (/repair/i.test(L)) return 'file repair'
  if (/review|lens|conventions|test quality|security|recomput/i.test(L)) return 'lens/verify'
  return 'other'
}

// Usage is per turn, in the transcripts. Fresh input and output are billed in full, a cache read
// at about a tenth. The floor sits in the context on every turn, so a long agent pays it many times:
// that is why turns, not the agent count, is what the run costs.
const root = join(dir, 'subagents', 'workflows')
const rows = []
for (const run of existsSync(root) ? readdirSync(root) : []) {
  for (const f of readdirSync(join(root, run)).filter(x => x.endsWith('.jsonl'))) {
    const rec = agents.get(basename(f).slice(6, -6))
    if (!rec) continue
    let fresh = 0, read = 0, out = 0, turns = 0, floor = null, prompt = null
    for (const line of readFileSync(join(root, run, f), 'utf8').split('\n')) {
      if (!line) continue
      let d; try { d = JSON.parse(line) } catch { continue }
      const m = d?.message
      if (prompt === null && m?.role === 'user' && typeof m.content === 'string') prompt = m.content
      const u = m?.usage
      if (!u || typeof u !== 'object') continue
      const i = u.input_tokens || 0, cc = u.cache_creation_input_tokens || 0, cr = u.cache_read_input_tokens || 0
      fresh += i + cc; read += cr; out += u.output_tokens || 0; turns++
      if (floor === null) floor = i + cc + cr
    }
    if (floor === null) continue
    rows.push({ label: rec.label, phase: rec.phaseTitle, turns, floor, prompt: prompt || '',
                cost: fresh + out + 0.1 * read, klass: classify(rec.label) })
  }
}
if (!rows.length) { console.error(`no transcripts with usage under ${root}`); process.exit(1) }

console.log(`\n${runs.length} workflow runs, ${rows.length} agents with transcripts`)
for (const r of perRun) {
  console.log(`  ${r.name} ${r.id} ${r.status}: ${r.count} agents${r.cached ? `, ${r.cached} cached` : ''}`)
  console.log(`    phases: ${r.phases.join('  |  ') || '(none)'}`)
}

const TOT = sum(rows.map(r => r.cost))
console.log(`\nfloor, the first turn's context before the agent reads a line: median ${n0(med(rows.map(r => r.floor)))}`)
console.log(`cost-equivalent: ${n0(TOT)} = fresh input + output + a tenth of the cache reads`)

console.log(`\n${'class'.padEnd(13)}${'n'.padStart(5)}${'cost'.padStart(15)}${'share'.padStart(7)}${'turns'.padStart(7)}${'per agent'.padStart(12)}`)
const byClass = {}
for (const r of rows) (byClass[r.klass] ||= []).push(r)
for (const [k, v] of Object.entries(byClass).sort((a, b) => sum(b[1].map(r => r.cost)) - sum(a[1].map(r => r.cost)))) {
  const s = sum(v.map(r => r.cost))
  console.log(`${k.padEnd(13)}${String(v.length).padStart(5)}${n0(s).padStart(15)}` +
              `${(s / TOT * 100).toFixed(0).padStart(6)}%${med(v.map(r => r.turns)).toFixed(0).padStart(7)}${n0(s / v.length).padStart(12)}`)
}

// The claim to re-test every run: cost follows turns, not the number of agents.
const t = rows.map(r => r.turns), c = rows.map(r => r.cost)
const mean = a => sum(a) / a.length, mt = mean(t), mc = mean(c)
const corr = sum(t.map((x, i) => (x - mt) * (c[i] - mc))) /
             Math.sqrt(sum(t.map(x => (x - mt) ** 2)) * sum(c.map(x => (x - mc) ** 2)))
const long = rows.filter(r => r.turns > 40)
console.log(`\ncost against turns: r = ${corr.toFixed(2)}`)
console.log(`agents past 40 turns: ${long.length} of ${rows.length}, ${(sum(long.map(r => r.cost)) / TOT * 100).toFixed(0)}% of the cost`)

// A climb is one job at two rungs, so it is two agents. Labels end "<separator> model/effort".
const climbs = {}
for (const r of rows) {
  const m = r.label.match(/^(.*?) [·@] (\S+)$/)
  if (m) (climbs[`${r.phase} ${m[1]}`] ||= []).push(m[2])
}
const climbed = Object.values(climbs).filter(v => v.length > 1)
console.log(`\nclimbs: ${climbed.length} jobs took more than one rung, depths ${JSON.stringify(climbed.map(v => v.length).sort())}`)
if (!climbed.length && rows.every(r => !/[·@] \S+$/.test(r.label)))
  console.log('  (no label names its rung: a climb cannot be told from its first try)')

// Attack width: a skeptic per finding pays a floor per finding, a skeptic per file pays one per file.
const atk = rows.filter(r => r.klass === 'attack')
if (atk.length) {
  // Findings group by file within a slice, never across one, so the files are counted per phase.
  const perPhase = {}
  for (const r of atk) {
    const f = (r.prompt.match(/, at ([^\s:]+)/) || [])[1]
    if (f) (perPhase[r.phase] ||= new Set()).add(f)
  }
  const files = sum(Object.values(perPhase).map(s => s.size))
  console.log(`attack: ${atk.length} skeptics over ${files || '?'} files, median ${med(atk.map(r => r.turns))} turns, ` +
              `${(sum(atk.map(r => r.cost)) / TOT * 100).toFixed(0)}% of the cost`)
  console.log('  batching them saves floors, not turns: it is the cheapest class per agent, not the dearest')
}
console.log()
