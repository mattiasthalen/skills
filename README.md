# skills

Skills, usable two ways.

## As a plugin marketplace

```
/plugin marketplace add mattiasthalen/skills
/plugin install grill-to-build@mattiasthalen-skills
```

One marketplace entry per skill, so you install the one you want and not the
rest.

## As plain files

Every skill is a self-contained directory under `skills/`. Copy one into
`~/.claude/skills/` for yourself, or into a repository's `.claude/skills/` for
everyone working in it. Nothing in a skill depends on this repository or on the
plugin system.

```
cp -r skills/grill-to-build ~/.claude/skills/
```

## What is here

| skill | what it does |
| --- | --- |
| [`grill-to-build`](skills/grill-to-build) | Interview to exhaustion, then a plan I confirm, then a workflow per slice |

## Layout

```
.claude-plugin/marketplace.json   one entry per skill
skills/<name>/
  SKILL.md                        the skill
  README.md                       what it is for, and where its rules came from
```

Adding a skill is a directory under `skills/` and one entry in
`marketplace.json`. Each entry takes `"source": "./"` with an explicit
`"skills"` path, so it loads its own directory and none of the others, and
`"strict": false`, which makes the entry the whole definition and means no
per-plugin manifest to keep in step.

`SKILL.md` carries its name in the front matter. Without it the invocation name
falls back to the directory name and changes whenever the directory does.
