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

## Graft in web sessions

[Graft](https://github.com/trailhq/Graft) builds a readable graph of a codebase
that Claude reads instead of exploring from scratch. Setting it up is two
commands — `npm install -g @nanonets/graft`, then `graft init` — but the second
one opens a picker to choose which harness to wire, and a container has no
terminal to answer it on. With no TTY, plain `graft init` writes nothing and
prints the command it wanted you to run.

`--agents claude` is the answer: it names the harness up front and skips the
picker entirely.

The setup splits in two, because a web container is new every session:

- **Committed, so it is there at clone time** — `.mcp.json`, graft's statusline
  and hook shims under `.claude/helpers/`, and its skill file at
  `.claude/skills/graft/SKILL.md`. All of it written by `graft init`.
- **Rebuilt each session** — the CLI those files call, plus the graph itself.
  That is [`.claude/hooks/session-start.sh`](.claude/hooks/session-start.sh),
  registered as a `SessionStart` hook.

```bash
npm install -g @nanonets/graft
graft init --agents claude          # no picker, no TTY needed
```

Graft is an optimisation, never a dependency, so every failure path in the hook
exits 0 — no npm, no network, a failed build. A session without graft is a
slower session, not a broken one. Its committed shims are built the same way:
with no CLI installed they no-op silently rather than erroring on every turn.

The graph under `graft/` is a local cache like `node_modules`, git-ignored and
regenerated per container. `.ignore` keeps it greppable anyway — ripgrep reads
that before `.gitignore`.

Three things worth knowing:

- **The structural graph is free and needs no key.** The LLM layer — concept
  nodes, per-symbol summaries — costs money, so the hook only builds it when
  `GRAFT_API_KEY` is set in the environment.
- **The MCP server may lag one session.** Claude Code loads `.mcp.json` at
  startup, so on a container's very first run the `graft_*` tools can race the
  install. The CLI is always there, and graft's skill file teaches it.
- **It claims the statusline.** `graft init` writes a project-level `statusLine`,
  which hides a custom one from `~/.claude/settings.json` in this repo. Re-run
  with `--no-statusline` to keep your own.

Graft sends anonymous usage stats by default; `DO_NOT_TRACK=1` in the
environment turns them off.

## Checking a change

```
claude plugin validate . --strict
```

## License

MIT. See [`LICENSE`](LICENSE).
