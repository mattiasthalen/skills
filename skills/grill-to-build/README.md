# grill-to-build

Interview to exhaustion, then a plan I confirm, then a workflow per slice.
Vertical, thin end to end, widened one at a time.

The skill is deliberately short. Every line in it exists because a run broke
without it, and lines that describe what the model does anyway have been cut
rather than kept for completeness. Adding a line is a claim that something went
wrong without it, and that claim should be checkable.

## What each line is defending against

| line | what went wrong |
| --- | --- |
| the description's third sentence | the skill file went unread for seven and a half hours, because the prompt paraphrased it |
| `Start what doesn't need me before you ask me anything` | almost four hours idle on one question, with fifteen minutes of parallelisable spikes queued behind it |
| the ready-and-green trigger | "don't wait for me between slices" had no definition of when the next one may start |
| `A spike reports the cases it ran` | a spike probed one side of a symmetric pair and reported a universal; it reached two decision records, two skills and a check before anyone questioned it |
| `A path and a conclusion, never the artefact` | two reads of one screenshot were 45% of a slice's context |
| `Write a file once, then run it and read it by path` | test source rode inline with 45 test invocations, and 42 further calls re-read files written moments before |
| `Its confirmation names a check that exists` | five decision records, five confirmation sections naming checks nobody had written |
| `Fix a slice on its own branch` | a fix belonging to one slice landed on the next slice's branch, where the first slice's reviewers could not see it |
| `Draft PR from the first commit` | fourteen commits went in green locally carrying a test that could never pass in CI |

Read the table before cutting a line. Most of these look like things a model
would not need telling, which is exactly why they are here: each one was
observed, not predicted.
