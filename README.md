# skills

Mattias Thalén's skills, usable two ways.

## As a plugin

```
/plugin marketplace add mattiasthalen/skills
/plugin install mattiasthalen-skills@mattiasthalen
```

One plugin, holding every skill here. One for now.

A skill's workflows come with it. The plugin serves `grill-to-build`'s two by
name, `/mattiasthalen-skills:build` and `/mattiasthalen-skills:slice`; as plain
files, the skill runs the same scripts by path.

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
  workflows/<name>.js             workflows the skill runs by path, and the plugin serves by name
```

The repository is both the marketplace and the plugin it serves, so the one
entry in `marketplace.json` takes `"source": "./"`. Skills are discovered from
`skills/`, so adding one is a directory there and nothing else — no manifest
edit, no new marketplace entry.

Workflows are not discovered: `plugin.json` points its `workflows` field at the
skill's `workflows/` directory, so a skill that gains one is a manifest edit
too. The field takes a list once there is more than one.

`plugin.json` and the marketplace entry both carry the name and version, and
`claude plugin tag` fails if they drift apart.

`SKILL.md` carries its name in the front matter. Without it the invocation name
falls back to the directory name and changes whenever the directory does. It
also carries `disable-model-invocation: true`: the skill runs by
`/grill-to-build` and never because a message matched its description.

## Checking a change

```
claude plugin validate . --strict
```

## License

MIT. See [`LICENSE`](LICENSE).
