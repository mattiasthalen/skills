#!/usr/bin/env bash
# Install graft into an ephemeral container and wire it to Claude Code.
#
# The wiring graft writes — .claude/helpers/, .claude/skills/graft/, .mcp.json —
# is committed, so it is already here when the container is cloned. The CLI those
# files call is not: a web container starts empty every session. This installs it
# and rebuilds the graph.
#
# graft is an optimisation, never a dependency, so every failure below exits 0.
# A session without it is a slower session, not a broken one.
set -uo pipefail

# Local machines install graft once by hand; only containers need this.
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

command -v npm >/dev/null 2>&1 || { echo "graft: no npm on PATH — skipped."; exit 0; }

if ! command -v graft >/dev/null 2>&1; then
  npm install -g @nanonets/graft >/dev/null 2>&1 || {
    echo "graft: npm install failed — skipped, the session runs without it."
    exit 0
  }
fi

# --agents claude is the whole trick: with no TTY to prompt on, plain `graft init`
# writes nothing and just prints what to run. Naming the harness skips the picker.
# init is idempotent and merges into .claude/settings.json rather than clobbering
# it, so re-running it every session only refreshes the graph.
graft init --agents claude >/dev/null 2>&1 || {
  echo "graft: init failed — skipped, the session runs without it."
  exit 0
}

# The structural graph above is free and needs no key. The LLM layer — concept
# nodes, per-symbol summaries — costs money, so it is opt-in: set GRAFT_API_KEY
# and GRAFT_PROVIDER in the environment to get it.
if [ -n "${GRAFT_API_KEY:-}" ]; then
  graft build --deep >/dev/null 2>&1 || echo "graft: deep build failed — the structural graph is still here."
fi

echo "graft: ready ($(graft version 2>/dev/null | head -1))."
