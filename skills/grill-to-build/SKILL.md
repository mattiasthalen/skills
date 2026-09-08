---
name: "grill-to-build"
description: "A build run from a brief. Use whenever I hand you one."
---

## The run
1. **Interview me to exhaustion.** A round that produces nothing you
   would otherwise have invented ends it. Spike what I can't answer:
   time-boxed, thrown away, never landed.
2. **Plan.** It names the slices, and the seams that get TDD — the rest
   gets checks. Fresh agents review it, findings to me unrevised.
3. **I confirm it.**
4. **A slice at a time**, vertical, thin end to end, widened one at a
   time. One workflow per slice frames it, builds it, verifies it and
   repairs what it found; you take the digest and report to me.
   - MADR at the decision, never batched.
   - Red and green in a single conventional commit.

A slice is done when it builds from a clean clone, code review and
security review have both run on it, every finding is fixed or written
down, and it is a pull request stacked on the one before. I read the stack
when the plan is done — carry straight on to the next slice.

## Pointers
You hold pointers: slice, branch, commit range, records, findings. Agents
hold contents. Give an agent the path and take back its digest — the
images, the diffs and the workflow journals are its to read.

Everything you hold pays rent: its size, every turn it stays. A picture is
the worst tenant on the board. An agent reads it and hands you the numbers,
and it reaches me by path.

Repairs group by file. Twenty findings is the widest work in a slice.

## Width
Fan-out is a workflow, wherever it falls in the run, not just per slice.
One agent you spawn; two you script. The numbers below are read from a
run record, and only a workflow leaves one.

The width you get is not the width the script asked for. Work from what
you got: `workflowProgress` in the run record carries `queuedAt` and
`startedAt` per agent. After every run, the numbers: most agents live at
once, the longest wait between queued and started, and — where findings
were attacked — attacked and killed. An attack that has stopped killing
has stopped paying for its run.

Widen the job, not the count.

## Model
Judge each agent's model and effort from its job, and name both. Say
nothing and the runner inherits mine, which spends at my rate by default.
What I drive on is mine to set.

Start at Sonnet, low effort. Escalate — effort first, then a tier — when
one comes back empty, or unsure on its own scale; say which, and on what
signal. A tier change boots a fresh agent that pays its rent again from
zero, because a cache belongs to the model that wrote it.

## Claims
Derive everything you tell me about the record.

- Sequence comes from `git log`.
- An ADR's Confirmation names a check you ran the mutation against and
  watched fail.
- The slice report lists the reviews that ran, by run id.
- Check the PR body against `git log` and the diff before you open it.

## Ledger
Append to the ledger as the slice goes: timestamp, sha, what and why — a
path and a line, so it pays almost no rent. Chronology lives there. When
you resume, read the ledger first, and say so in your next message to me.
