# grill-to-build

A build run from a brief. Interview to exhaustion, then a plan I confirm,
then a slice at a time — vertical, thin end to end, widened one at a time.

The skill is deliberately short. Every line in it exists because a run broke
without it, and lines that describe what the model does anyway have been cut
rather than kept for completeness. Adding a line is a claim that something went
wrong without it, and that claim should be checkable.

## What each line is defending against

These are the incidents on record. Lines added since are not listed, because
naming a failure they did not have would be the kind of unchecked claim the
rule above exists to stop.

| line | what went wrong |
| --- | --- |
| `Give an agent the path and take back its digest` | two reads of one screenshot were 45% of a slice's context |
| `An ADR's Confirmation names a check you ran the mutation against and watched fail` | five decision records, five confirmation sections naming checks nobody had written |
| `One workflow per slice frames it, builds it, verifies it and repairs what it found` | the driver built, in every slice: 378 file-writing calls and 274,220 tokens of authoring it typed itself, 82,853 of them straight into `src/`, `tests/`, `dab/`, `das/` and `dar/`. The step used to name four agents without saying where they run, and the building landed in the seat that names them. Twelve workflow runs cost the driver 33,045 tokens in total — the script written and the digest read back, for all 145 agents — so what leaked into its window was never the launching |
| `A picture is the worst tenant on the board` | the rule above did not hold. Nine screenshot reads landed in the main context, each picture read twice inside three minutes, and those nine were 58% of every tool-result token the session ever took in |
| `Name both on every agent` | all 149 agents inherited the main session's model. Every one of 4,747 calls in a sixteen-hour run was the large one, and neither `model` nor `effort` is set on a single `agent()` call in the eight workflow scripts, nor on the three agents the main session spawned directly |
| `escalate ... when one comes back empty, or unsure on its own scale` | the two signals a cheap agent gives when it is out of its depth, and both are rare enough to escalate on: 4 of 86 adversarial verdicts landed in the uncertain band, and 1 of 18 lenses returned nothing |
| `attacked, and killed` | the adversarial pass killed 11 findings of 29, then 12 of 33, then 1 of 24 — and nothing in the run noticed the third number |
| `Fan-out is a workflow, wherever it falls in the run` | the line was there once — `Workflows wherever they help, not just per slice` — and the remake cut it as one describing what the model does anyway, no incident behind it. Without it, reading the brief's sources became 14 agents spawned from the driver's seat: a prompt typed and a digest read in the driver's window apiece, and no run record, so none of the numbers `Width` asks for after every run existed. Back, with the judgement taken out of it |

Read the table before cutting a line. Every one of these looks like something a
model would not need telling, which is exactly why they are here: each one was
observed, not predicted.

## The word `rent` is load-bearing

Four lines lean on one word: what you hold pays rent — its size, every turn it
stays. It carries the picture rule in `Pointers`, the price of a tier change in
`Model`, and why the ledger is a path and a line in `Compaction`. Before it,
each of those spelled the same mechanism out for itself: one idea stated three
times, in six more lines than it needed. Cutting the word means putting the
three explanations back.

The skill was run through `mattpocock/skills`' `writing-for-agents` after the
rules above were added, which is where that refactor came from, along with the
positive phrasing of the picture rule — it was written as a prohibition, and a
prohibition is how you keep a behaviour in mind.

## Does one session hold a plan?

There is no compaction here, so the question is whether a run fits in one window
rather than what a window costs. The run compacted three times and reached 782k
at its peak, which reads like a no — but both of the things filling it are
things the skill already refuses.

Cumulative context, never evicted, at each slice:

| | as run | pictures kept out | and agents doing the building |
| --- | ---: | ---: | ---: |
| slice 1 | 472,152 | 472,152 | 389,419 |
| slice 2 | 1,046,867 | 773,606 | 628,942 |
| slice 3 | 1,315,311 | 936,549 | 754,063 |
| slice 4 | 1,744,244 | 1,258,028 | 1,017,283 |

As it ran, the window goes at 23:02:31 — the moment it reads slice 2's
`answer.png`. Honouring the two rules it already had, four slices land on 1M
almost exactly, and the real figure is lower than that: 274,220 is the authoring
text alone, and the thinking that produced it cannot be separated from the rest
of the driver's generation in this log.

So a plan of four or so slices fits one session, and it fits because of rules
that were written before any of this measurement. What broke the window was not
a missing rule. It was building in the driver's seat.

Two things that table does not account for, both found after it was written.
The harness puts about 520k of its own bookkeeping into the run — 1,023
token-budget reminders, 124 task reminders, 36 re-displays of an edited file,
the skill listings — and none of it is anything a skill can rule on. And of the
driver's 997,177 generated tokens, 550,212 is thinking, against 18,446 of prose
to me: it thinks thirty times as much as it speaks. Whether that thinking stays
in the window could not be settled from this log — reconstructing the context
turn by turn fits "retained early, cleared later", at an error of 10-30% either
way, which is too loose to claim. The two omissions push in opposite directions,
so read the table as the shape of the answer and not the size of it.

What is not in doubt is where the weight is not. The interview, the plan and its
review cost 177,719 tokens beyond the system prompt, across 90 of the run's
1,050 turns — nine per cent of the turns and nine per cent of everything the
driver generated. Planning is the cheap part.

## Where the numbers come from

The four rows from `A picture is the worst tenant on the board` to `attacked,
and killed` are measured from the raw transcripts of one sixteen-and-a-half-hour
run, published at
[`mattiasthalen/adss-2026-09-07`](https://github.com/mattiasthalen/adss-2026-09-07)
on the `claude/session-logs` branch: one main transcript, 149 subagents, twelve
workflow runs.

The fan-out row is later and lighter: one count from a fresh session on the same
brief, seen rather than measured — no transcript is published, so what those
fourteen cost the driver is not known here.

Token counts come from `message.usage` on each `assistant` event, deduplicated
by `message.id` — the same id repeats across streaming snapshots, and only the
last one carries the full `output_tokens`. What a turn costs to read is
`cache_read_input_tokens`, which is the whole context at that turn, so what a
thing costs in total is its size times the number of turns it survives before
the next compaction. Compaction boundaries show up as a drop of more than 100k
between consecutive turns; there were three.

That run processed 784M tokens across 4,748 calls. Half of that spend was the
main session and half was its agents, and 68% of it was cache reads — the same
context, read again, once per turn. Every rule in the table above is a rule
about what gets carried, for how long, by whom, and at what rate.

## What it cost, and what it should have cost

Priced at Anthropic's first-party list rates as of 2026-09 — cache writes at
1.25× input for the five-minute TTL and 2× for the hour, cache reads at 0.1× of
input except on the top tier, where they are 0.025×. That exception is the whole
story for a run shaped like this one.

| | main | agents | total |
| --- | ---: | ---: | ---: |
| as run, every agent on the main session's model | $277.75 | $286.49 | **$564.24** |
| the same tokens, top tier in the main seat | $241.58 | $286.49 | $528.07 |
| top tier in the main seat, readers a tier or two down | $241.58 | $94.91 | $336.49 |
| the above, plus images kept out and the main context held under 300k | $173.34 | $94.91 | **$268.25** |

The top tier costs twice as much per input and output token and still comes out
$36 ahead in the main seat, because that seat spends 74% of its tokens
re-reading a context it already paid to write, and it reads them at half the
rate the tier below charges. The advantage is a function of how much context the
seat carries: at a 150k cap the same arithmetic reverses and the cheaper tier
wins by $6. Carrying less and paying less per carried token are the same lever
pulled from two ends, and they partly cancel.

The middle rows are arithmetic, not instructions. Which model drives is a
session setting the user picks, and the skill says nothing about it — the table
is here so that choice can be made against numbers. What the skill does ask for
is the other direction: the driver picking a model per agent, which is a
judgement it can only make once it is required to make one at all.

## Why reviewers are not an exception

The obvious move is to spend more on the lenses, since a bug they miss is a bug
nothing else catches. The run says otherwise: across three verifications, what a
lens cost did not track what it found.

| lens | findings | cost |
| --- | ---: | ---: |
| ordinary code review | 9, 7 | $4.49, $4.18 |
| test quality | 8, 9 | $3.70, $3.54 |
| conventions | 7, 7 | $3.48, $5.00 |
| the slice-specific lens | 2, 6 | $3.01, $6.16 |
| **independent recomputation** | **0, 1** | **$1.49, $1.80** |

Independent recomputation is the cheapest lens on the board and it produced the
finding that refused slice 4 — that the slice does not build from a clean clone.
It found it by rebuilding the warehouse in a clean tree and running the queries,
which is why it is cheap: it runs the thing instead of reading about it. What
made that lens good was its job, not its tier, and no amount of model would have
found it by reading.

So reviewers start on the floor like everything else, and the escalation fires
on a signal rather than a role. Nothing in this run varied the model, so there
is no evidence here that any lens needs a bigger one — and inventing that
evidence is the thing this file exists to prevent.
