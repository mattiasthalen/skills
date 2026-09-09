---
name: "grill-to-build"
description: "A build run from a brief."
disable-model-invocation: true
---

## The run
1. **Interview me to exhaustion.** A round that produces nothing you
   would otherwise have invented ends it. Spike what I can't answer:
   time-boxed, thrown away when the answer is in hand.
2. **Plan**, in plan mode. It names the slices, the seams that get TDD —
   the rest gets checks — and how hard each is: trivial, routine, hard or
   novel. Fresh agents review it, findings to me unrevised.
3. **I confirm it**, at the plan-mode prompt. The plan file is what every
   slice reads.
4. **One workflow builds the plan and reviews it**, a slice at a time,
   vertical, thin end to end, widened one at a time; you take the stack's
   digest and report to me. It is written:
   `${CLAUDE_SKILL_DIR}/workflows/build.js`, run by path, with the
   pointers as `args`; the script's head names them. `slice.js` alone
   steers one slice. Copy either only for a shape it lacks.
   - MADR at the decision, never batched.
   - Red and green in a single conventional commit.

A slice is done when its digest comes back with `unfinished` empty. I
read the stack when the plan is done.

## Pointers
You hold pointers: slice, branch, commit range, records, findings. Agents
hold contents. Give an agent the path and take back its digest — the
images, the diffs and the workflow journals are its to read.

Everything you hold pays rent: its size, every turn it stays. A picture is
the worst tenant on the board. An agent reads it and hands you the numbers,
and it reaches me by path.

## Width
Fan-out is a workflow, wherever it falls in the run. One agent you
spawn; two you script. The numbers below are read from a run record,
and only a workflow leaves one.

Work from the width you got, not the width the script asked for:
`workflowProgress` in the run record carries `queuedAt` and `startedAt`
per agent. After every run, the numbers: most agents live at once, the
longest wait between queued and started, and — where findings were
attacked — attacked and killed. An attack that has stopped killing has
stopped paying for its run: the build turns it off for the next slice,
and says so.

Widen the job, not the count.

## Model
Judge each agent's model and effort from its job, and name both. Say
nothing and the runner inherits mine, which spends at my rate by default.

A task's model follows how hard it is, judged in the plan and checked by
the frame against the code: routine is Sonnet at low effort, trivial a
tier down, hard and novel up, and a review sits a rung above what it
reviews. Escalate — effort first, then a tier — when one comes back
empty, or unsure on its own scale; say which, and on what signal. A tier
change boots a fresh agent that pays its rent again from zero, because a
cache belongs to the model that wrote it.

## Claims
Derive everything you tell me about the record.

- Sequence comes from `git log`.
- An ADR's Confirmation names a check you ran the mutation against and
  watched fail.
- The slice report lists the reviews that ran, by run id.
- Check the PR body against `git log` and the diff before you open it.

## Ledger
Append to the ledger as the slice goes: timestamp, sha, what and why — a
path and a line, so it pays almost no rent. Chronology lives there. The
ledger and the records are yours; the repository's commits carry source,
tests and ADRs only. When you resume, read the ledger first, and say so
in your next message to me.
