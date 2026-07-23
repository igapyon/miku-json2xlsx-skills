# Development

## Upstream Anchor

- product repository: <https://github.com/igapyon/miku-json2xlsx>
- compatibility branch: `devel`
- checked commit: `eb0719d8c84ae018d041ccfd50205cd53f8ab8b4`
- checked release: `v0.2.0`
- checked state on 2026-07-23: initial TypeScript CLI and bundle generation
- GitHub Release assets: none

The upstream source can generate `bundle/miku-json2xlsx.mjs` as an executable
CLI bundle and `bundle/miku-json2xlsx-runtime.mjs` as an importable runtime
bundle. The current CLI contract implements metadata commands only. Runtime
wiring in this repository must wait for a human-provided executable artifact
from a documented distribution source.

## miku-soft Reference Check

- checked date: 2026-07-23
- main workflow: `references/40-agent-skills-workflow.md`
- installed `igapyon-miku-soft-developer` commit: unavailable because the
  installed skill directory is not a Git checkout

## Sister Reference

No same-layer sister checkout existed under this repository's `workplace/`
before initialization.

The public `miku-indexgen-skills` `devel` branch was checked out under
`workplace/upstream/miku-indexgen-skills` and inspected at commit
`d6319800b5c7aca97bee0f5a5f8e139ca566688b`.

Adopted decisions:

- repository/package and installed skill names are intentionally separate
- explicit opt-in activation
- canonical skill files under `skills/igapyon-miku-json2xlsx/`
- skill-local references and future runtime artifacts
- bundle and release-zip construction from the initial scaffold
- tests that verify the isolated install shape and release contents

Rejected decisions:

- copying sister runtime code or product behavior
- declaring the skill CLI-backed before an upstream runtime is received
- adding MCP behavior without an upstream MCP contract

## Initial Maturity

The initial maturity is `handoff-only`. Upstream metadata runtime code now
exists, but no versioned Release asset has been received and conversion remains
unimplemented upstream. The skill may explain the intended workflow and
prepare human-reviewable requirements, but it must not invent an unpublished
mapping schema or claim an XLSX was generated.

The target maturity is CLI-backed. After an upstream runtime is received, add
runtime lookup, metadata smoke tests, operation contract tests, and end-to-end
conversion fixtures before changing the declared backend policy.

## Verification

Run:

```bash
npm test
npm run build:bundle:zip
```
