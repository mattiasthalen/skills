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
   time. An agent frames it, an agent builds it, agents verify it, agents
   repair what they found, then you report to me.
   - MADR at the decision, never batched.
   - Red and green in a single conventional commit.

A slice is done when it builds from a clean clone, code review and
security review have both run on it, every finding is fixed or written
down, and I have seen it.

## Pointers
You hold pointers: slice, branch, commit range, records, findings. Agents
hold contents. Give an agent the path and take back its digest — the
images, the diffs and the workflow journals are its to read.

Repairs fan out like everything else, grouped by file. Twenty findings is
the widest work in a slice.

## Width
Two agents run at a time per workflow, whatever the script asked for.
Work from the width you got: `workflowProgress` in the run record carries
`queuedAt` and `startedAt` per agent. After every run give me two numbers
— most agents live at once, and the longest wait between queued and
started.

Six lenses is three runs of two, launched together. Widen the job, not
the count.

## Claims
Derive everything you tell me about the record.

- Sequence comes from `git log`.
- An ADR's Confirmation names a check you ran the mutation against and
  watched fail.
- The slice report lists the reviews that ran, by run id.
- Check the PR body against `git log` and the diff before you open it.

## Compaction
Append to the ledger as the slice goes: timestamp, sha, what and why.
Chronology lives there. When you resume from a summary, read the ledger
first, and say so in your next message to me.
