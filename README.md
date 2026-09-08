# skills

Mattias Thalén's skills, usable two ways.

## As a plugin

```
/plugin marketplace add mattiasthalen/skills
/plugin install mattiasthalen-skills@mattiasthalen
```

One plugin, holding every skill here. One for now.

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
| [`grill-to-build`](skills/grill-to-build) | A build run from a brief: interview to exhaustion, a plan I confirm, then a slice at a time |

## Layout

```
.claude-plugin/
  plugin.json                     the plugin
  marketplace.json                the marketplace it is served from
skills/<name>/
  SKILL.md                        the skill
  README.md                       what it is for, and where its rules came from
```

The repository is both the marketplace and the plugin it serves, so the one
entry in `marketplace.json` takes `"source": "./"`. Skills are discovered from
`skills/`, so adding one is a directory there and nothing else — no manifest
edit, no new marketplace entry.

`plugin.json` and the marketplace entry both carry the name and version, and
`claude plugin tag` fails if they drift apart.

`SKILL.md` carries its name in the front matter. Without it the invocation name
falls back to the directory name and changes whenever the directory does.

## Checking a change

```
claude plugin validate . --strict
```
