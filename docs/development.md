# Development

## Upstream Anchor

- product repository: <https://github.com/igapyon/miku-json2xlsx>
- compatibility branch: `devel`
- checked commit: `9cf12f8e3f8d0722fd79b4734b9198647332b986`
- checked release: `v0.3.0`
- checked state on 2026-07-25: JSON/JSONL inspection, mapping validation,
  typed XLSX conversion, streaming JSONL conversion, and release assets
- received executable asset: `miku-json2xlsx-0.3.0.mjs`
- provenance and SHA-256 source:
  `skills/igapyon-miku-json2xlsx/runtime/runtime-manifest.json`

The bundled executable runtime supports `--help`, `--version`, `inspect`,
`validate-mapping`, and `convert`. The upstream importable runtime bundle and
source archive are separate release artifacts and are not required for normal
Skill execution.

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
- skill-local references and versioned runtime artifacts
- bundle and release-zip construction from the initial scaffold
- tests that verify the isolated install shape and release contents

Rejected decisions:

- copying sister runtime code or product behavior
- declaring the skill CLI-backed before an upstream runtime is received
- adding MCP behavior without an upstream MCP contract

## Current Maturity

The current maturity is CLI-backed. The Skill resolves the versioned executable
declared by `runtime-manifest.json`, verifies its SHA-256, and invokes only that
upstream CLI. It does not fall back to a parallel converter or the importable
runtime bundle.

Mapping decisions remain an Agent-and-human review responsibility. The CLI
validates the published mapping v1 contract and performs the conversion.

## Verification

Run:

```bash
npm test
npm run build:bundle:zip
```
