# skills

A Claude Code plugin marketplace. One plugin per skill, so a skill can be
installed without dragging the others along.

## Use it

```
/plugin marketplace add mattiasthalen/skills
/plugin install grill-to-build@mattiasthalen-skills
```

## What is here

| plugin | what it does |
| --- | --- |
| [`grill-to-build`](plugins/grill-to-build) | Interview to exhaustion, then a plan I confirm, then a workflow per slice |

## Layout

```
.claude-plugin/marketplace.json   the marketplace, pluginRoot ./plugins
plugins/<name>/
  .claude-plugin/plugin.json      the plugin manifest
  skills/<name>/SKILL.md          the skill itself
  README.md                       what it is for and where its rules came from
```

Adding a skill means a directory under `plugins/` and one entry in
`marketplace.json`. Both manifests carry the same `name`, and `SKILL.md`
carries it in its front matter too, because without that the invocation name
falls back to the directory name and changes whenever the directory does.
