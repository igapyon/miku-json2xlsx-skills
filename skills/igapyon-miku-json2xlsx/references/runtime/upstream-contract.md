# Upstream Contract

## Compatibility Anchor

- repository: <https://github.com/igapyon/miku-json2xlsx>
- initial branch anchor: `devel`
- checked on: 2026-07-27
- checked commit: `7830b7050294012d2a5e7ef65b57da05d45b4c15`
- checked release: `v0.4.1`
- executable asset: `miku-json2xlsx-0.4.1.mjs`
- machine-readable provenance and SHA-256:
  `runtime/runtime-manifest.json`

At the checked commit, upstream provides metadata commands, JSON/JSONL
`inspect`, mapping v1 validation, typed root/child XLSX conversion,
machine-readable results, structured diagnostics, protected/atomic output, and
streaming JSONL conversion. Generated workbooks start with an English `README`
data-dictionary cover, and the mapping contract reserves that sheet name
case-insensitively.

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

The received executable is stored at
`runtime/miku-json2xlsx-0.4.1.mjs`. The thin runner reads
`runtime/runtime-manifest.json`, requires its declared versioned executable,
and verifies the SHA-256 before invocation.

The upstream importable runtime asset
`miku-json2xlsx-runtime-0.4.1.mjs` and source archive have different artifact
roles and must not silently replace the executable CLI. Do not build or copy an
upstream source tree into this Skill repository as the normal runtime path.

For a later release, verify the release source, SHA-256, `--version`, complete
`--help`, structured operation output, and focused integration tests before
updating this compatibility anchor.
