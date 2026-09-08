# grill-to-build

Interview to exhaustion, then a plan I confirm, then a workflow per slice.
Vertical, thin end to end, widened one at a time.

The skill is deliberately short. Every line in it exists because a run broke
without it, and lines that describe what the model does anyway have been cut
rather than kept for completeness. Adding a line is a claim that something went
wrong without it, and that claim should be checkable.

## Where the lines came from

The rules were pulled out of one long run: a build of an Analytical Data Storage
System from a brief, four vertical slices in a single session, with the full
transcripts published. Each line traces to something that run got wrong.

| line | what went wrong |
| --- | --- |
| the description's third sentence | the skill file went unread for seven and a half hours, because the prompt paraphrased it |
| `Start what doesn't need me before you ask me anything` | 3h42m idle on one question, with fifteen minutes of spikes queued behind it |
| the ready-and-green trigger | "don't wait for me between slices" had no definition of when the next one may start |
| `A spike reports the cases it ran` | a spike probed one side of a symmetric pair and reported a universal; it reached two records, two skills and a check |
| `A path and a conclusion, never the artefact` | two reads of one screenshot were 45% of a slice's context |
| `Write a file once, then run it and read it by path` | test source rode inline with 45 test invocations, and 42 calls re-read files just written |
| `Its confirmation names a check that exists` | five decision records, five confirmations naming checks nobody wrote |
| `Fix a slice on its own branch` | a fix to slice one landed on slice two's branch, so slice one's reviewers never saw it |
| `Draft PR from the first commit` | fourteen commits went in green locally carrying a test that could never pass in CI |

The evidence for each, with commit SHAs and transcript timings, is in
[`skill/findings.md`](https://github.com/mattiasthalen/adss-2026-09-07/blob/claude/grill-to-build-handoff-oz3v2u/skill/findings.md)
on the run's own repository, alongside the raw session logs it was derived from.
