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
| `One workflow builds the plan and reviews it` | the driver built, in every slice: 378 file-writing calls and 274,220 tokens of authoring it typed itself, 82,853 of them straight into `src/`, `tests/`, `dab/`, `das/` and `dar/`. The step used to name four agents without saying where they run, and the building landed in the seat that names them. Twelve workflow runs cost the driver 33,045 tokens in total — the script written and the digest read back, for all 145 agents — so what leaked into its window was never the launching |
| `A picture is the worst tenant on the board` | the rule above did not hold. Nine screenshot reads landed in the main context, each picture read twice inside three minutes, and those nine were 58% of every tool-result token the session ever took in |
| `Name both on every agent` | all 149 agents inherited the main session's model. Every one of 4,747 calls in a sixteen-hour run was the large one, and neither `model` nor `effort` is set on a single `agent()` call in the eight workflow scripts, nor on the three agents the main session spawned directly |
| `escalate ... when one comes back empty, or unsure on its own scale` | the two signals a cheap agent gives when it is out of its depth, and both are rare enough to escalate on: 4 of 86 adversarial verdicts landed in the uncertain band, and 1 of 18 lenses returned nothing |
| `attacked, and killed` | the adversarial pass killed 11 findings of 29, then 12 of 33, then 1 of 24 — and nothing in the run noticed the third number |
| `Fan-out is a workflow, wherever it falls in the run` | the line was there once — `Workflows wherever they help, not just per slice` — and the remake cut it as one describing what the model does anyway, no incident behind it. Without it, reading the brief's sources became 14 agents spawned from the driver's seat: a prompt typed and a digest read in the driver's window apiece, and no run record, so none of the numbers `Width` asks for after every run existed. Back, with the judgement taken out of it |
| `It is written` (step 4, the path of `build.js`) | not a new incident: the three rows above it, made mechanical. The eight scripts the driver wrote by hand set neither `model` nor `effort` on any `agent()` call; none returned attacked and killed, so nothing noticed the third number; twelve runs of them cost the driver 33,045 tokens of script typed and digest read. A script typed once and run by path is where those rules are code instead of lines the driver remembers while it types |
| `and reviews it` (step 4) | after every slice, the driver ran a code review and a security review in the main session, because the done sentence named both and nothing said where they run. Seen by the user across a run, not measured from a transcript, so no number is claimed. It was first a bullet of its own, "neither runs in your seat", and the writing pass cut that as a prohibition: the positive is the workflow reviewing, said in step 4's lead |
| `A task's model follows how hard it is` | not an incident: a judgement made in planning this workflow, against the cost table below. Its first draft put one floor under every job, then one rung per role, and each puts the same model under a rename and a query planner. Judging the task, in the plan and against the code, is the rule the first line of `Model` already stated, made mechanical |
| `the repository's commits carry source, tests and ADRs only` | the first draft of this workflow had the frame agent commit `frame.md` as the slice's first commit, and was stopped in planning: the records and the ledger are the driver's, the repository's commits carry source, tests and ADRs. Seen, not measured |
| `Plan, in plan mode` | asked for by the user, so that the plan is the file the harness presents for approval, read by every slice, rather than one of the driver's own making. Asked for, not measured |
| `disable-model-invocation: true` | asked for by the user: the skill runs when they type `/grill-to-build` and never because a message matched its description, so the description carries no trigger and the skill costs the session no context until it is called. Asked for, not measured |
| `Research and spikes get the same judgement from you` | asked for by the user: step 1's agents, the readers of the brief's sources and the spikes, have no plan level to follow, and inheriting the driver's model would put the top tier under a read. They are judged like every other job, by the driver, from the question, routine unless it says otherwise, and climb on signal. Asked for, not measured |

Read the table before cutting a line. Every one of these looks like something a
model would not need telling, which is exactly why they are here: each one was
observed, not predicted.

## The word `rent` is load-bearing

Four lines lean on one word: what you hold pays rent — its size, every turn it
stays. It carries the picture rule in `Pointers`, the price of a tier change in
`Model`, and why the ledger is a path and a line in `Ledger`. Before it,
each of those spelled the same mechanism out for itself: one idea stated three
times, in six more lines than it needed. Cutting the word means putting the
three explanations back.

The skill was run through `mattpocock/skills`' `writing-for-agents` after the
rules above were added, which is where that refactor came from, along with the
positive phrasing of the picture rule — it was written as a prohibition, and a
prohibition is how you keep a behaviour in mind.

It was run through it again once the workflows were written, with the scripts'
prompts under the same standard. That pass cut ten lines from the skill, every
one for a meaning now held elsewhere: the done sentence's four clauses, each
decided and reported by `slice.js`, became one criterion on the digest; the
lenses bullet, a prohibition, became "and reviews it" in step 4's lead; the
list of args, a copy of the script's head, which throws a better error than the
list gave; the repair width, code in `slice.js`; the ledger line's negation; the
model line the driver has no lever on; and three grown clauses. In the prompts
it cut the sentence forbidding a fileless finding, which the schema already
refuses; caught the slices agent being asked for the branch a slice builds on
where the code reads the branch it lands on; front-loaded the recompute prompt;
gave the frame prompt a list and a criterion for done; and hoisted the sentences
every review and repair shared. It flagged the description for opening on "A
build" where a trigger word should lead; the point lapsed when the skill became
user-invoked, since a description that never triggers anything is a one-line
summary for the `/` menu, and that is what it is now.

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

The rule is now complexity, not role, for reviewers as for everyone: a
reviewer's rung follows the task it reviews, one rung above the writer's so it
is never the weaker of the two. That puts a trivial seam's reviewer on Sonnet at
low effort and a novel seam's on the top rung. The evidence in this section
still bars what it barred: a premium for being a reviewer.

## The build and slice workflows

Step 4 is written down twice, in `workflows/`: `build.js` runs a build from a
confirmed plan, and `slice.js` runs one slice. The plugin serves them by name,
`/mattiasthalen-skills:build` and `/mattiasthalen-skills:slice`; as plain files
the driver runs them by path, `${CLAUDE_SKILL_DIR}/workflows/build.js`, with
the pointers as `args`. Two files, one responsibility each: `slice.js` knows
nothing about the build, and `build.js` holds the loop, the stacking and the
attack rule. In `/workflows`, a child's agents sit under a group named for the
child, so every phase `slice.js` runs carries the slice's prefix, "slice-2:
Frame", "slice-2: Seam 1: reader", and a build reads slice by slice; `label`
in the args sets the prefix, and the branch is the default. Steering one slice is running `slice.js` alone. Re-planning
mid-build is stopping the run, editing the plan, and rerunning `build.js` with
`from`.

What is code in `slice.js`, and which rule it carries:

- Every agent goes through one helper that names its model and effort in the
  call and in its label, and climbs the ladder on a signal: no result, empty, or
  unsure on its own scale. Each climb comes back in the digest with the job, the
  rung, the signal and the rung it went to. The ladder is haiku/low, sonnet/low,
  sonnet/high, opus/low, opus/high, fable/high; `xhigh` and `max` return a 400
  on models that lack them, so the driver adds fable/xhigh through `args.ladder`
  when it wants it. Nothing inherits the session's model: the runner's `best`
  alias resolves to the provider's default, not its top, so it is no use as a
  name either.
- A task's level, trivial, routine, hard or novel, maps to a rung through a
  table the driver can override. The plan names the levels, the frame agent
  checks each against the code and moves it either way, and `args.models`
  overrides any job, seam or lens by name. A seam's build and repair start on
  its rung, its review one above; the lenses on the whole start one above the
  slice's rung, the attack and the repair on it. The digest says, per seam and
  per job, the level, who set it, and the rungs.
- One phase per seam: a build that writes the failing check first and commits
  red and green together, a fresh reviewer on that seam's diff for defects and
  the refactoring the green left behind, a repair of what it found. The format
  is `mattpocock/skills`' `implement` driving `tdd` seam by seam, with a review
  per seam added; `tdd` leaves refactoring to review, which is the seam
  reviewer's job.
- Then the whole, `base..branch`, under six lenses at once: code review,
  security review, test quality, conventions, the slice's own lens when the
  plan names one, and recomputation from a fresh clone. Findings are
  deduplicated across lenses before anything is spent on them, one skeptic per
  finding attacks what is left, and attacked and killed go back in the digest.
- Repairs group by file and run in turn, one working tree, one branch, one
  index; the most severe twenty are the work and the rest are written down as
  deferred, and said so.
- Done means it builds from a clean clone after the repairs, so recomputation
  runs again, with one more repair round on what it finds. The close agent
  writes the findings record, drafts the PR body, checks every claim in it
  against `git log` and the diff, and marks the PR ready for review. A slice
  that does not build stays a draft.
- The PR opens as a draft at the first seam's commit, the earliest git allows,
  so the stack is visible from the first commit.
- The records, `frame.md`, `findings.md`, `pr.md`, the ledger and the plan, are
  the driver's and stay out of the repository; every prompt that commits says
  the repository's commits carry source, tests and ADRs only. They live outside
  the working directory, so a Read allow rule for their directories spares the
  agents a permission prompt each.

`build.js` has one agent list the slices from the plan, then runs `slice.js`
per slice as a child workflow, each on the branch of the one before. When a
slice's kill rate falls under one in ten, the attack has stopped paying for its
run, and the next slice runs without it; the stack's digest says after which
slice and on what numbers. It sums the slices' agent counts against the run's
cap of 1,000 and warns past 800: a slice is sixty to a hundred agents with its
climbs, so about ten slices is the ceiling for one run.

What it deliberately does not do. Repairs never run in parallel: the old line
"fan out like everything else" was cut from the repair rule in the remake, and
parallel repairs in one working tree race on the index. The width numbers are
not computed in the script: `workflowProgress` in the run record already
carries them. Nothing in a script stamps a time: the runtime makes `Date.now()`
throw so a relaunched run replays the same calls, and the agents stamp the
ledger with `date -u`.

How it was checked, and how it was not. Both scripts are parsed the way the
runtime parses them, meta first and the body as an async function with the
globals injected, then driven under fake agents through eight scenarios and 56
checks: the rung of every agent against the table and the precedence, the
review a rung above and the top staying the top, a trivial build climbing on
unsure, the draft PR at the first seam only, the per-seam loop, the dedup, the
twenty cap, a seam that never finishes, a lens that never answers, a clone that
never passes leaving the PR a draft, the stacking, the attack rule, `from`, the
agent count and its warning, a throwing child, and every way of failing before
an agent runs; 62 checks after the writing pass. Neither script has run live. The first live build is the check
of everything a fake agent cannot show: that the runtime replays a child
workflow's cached agents on resume, that the seam phases group as the plan
says, and what the numbers look like. Until then, none of the numbers this
section names has been measured.

