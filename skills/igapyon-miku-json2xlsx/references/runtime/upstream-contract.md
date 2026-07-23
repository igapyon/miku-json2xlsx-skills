# Upstream Contract

## Compatibility Anchor

- repository: <https://github.com/igapyon/miku-json2xlsx>
- initial branch anchor: `devel`
- checked on: 2026-07-23
- checked commit: `eb0719d8c84ae018d041ccfd50205cd53f8ab8b4`
- checked release: `v0.2.0`
- release assets: none

At the checked commit, upstream contains an initial TypeScript CLI. It can build
`bundle/miku-json2xlsx.mjs` as an executable CLI and
`bundle/miku-json2xlsx-runtime.mjs` as an importable runtime. The current CLI
implements `--help` and `--version`; JSON inspection and XLSX conversion remain
future contracts. The `v0.2.0` GitHub Release has no attached runtime assets.

## Product Boundary

Upstream `miku-json2xlsx` owns:

- JSON and JSONL parsing
- input structure inspection
- mapping schema and validation
- deterministic workbook generation
- cell typing and Excel safety policy
- warnings, errors, limits, and exit behavior

This Agent Skill owns:

- explicit activation
- operation and artifact-role guidance
- human-reviewable mapping and write approval flow
- runtime discovery and invocation after artifacts are received
- concise reporting of upstream results and diagnostics

## Runtime Intake

The executable CLI artifact required for normal skill execution must be placed
by a human under `runtime/` after it is attached to an upstream release or made
available through another documented distribution source. Rename the received
artifact to a versioned name such as `miku-json2xlsx-0.2.0.mjs`, and record its
source and SHA-256 digest. The importable `miku-json2xlsx-runtime.mjs` has a
different artifact role and must not silently replace the CLI executable.

Do not build or copy an upstream source tree into this skill repository as the
normal runtime path. Do not add runtime lookup code until the artifact names,
`--version`, `--help`, operations, structured output, and compatibility version
are known.
