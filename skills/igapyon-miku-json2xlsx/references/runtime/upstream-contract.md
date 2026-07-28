# Upstream Contract

## Compatibility Anchor

- repository: <https://github.com/igapyon/miku-json2xlsx>
- received on: 2026-07-28
- source branch: local `devel-tiga0727mbg`
- public base commit: `b134a7881e58733f233361bf36c7eef681487058`
- latest checked public release: `v0.4.2`
- immutable `0.5.0` source commit: unavailable
- `0.5.0` GitHub Release: unavailable
- executable artifact: `miku-json2xlsx-0.5.0.mjs`
- machine-readable provenance and SHA-256:
  `runtime/runtime-manifest.json`

The locally received `0.5.0` distillation provides metadata commands, JSON/JSONL
`inspect`, mapping v1 validation, deterministic automatic mapping, optional
generated-mapping output, typed root/child XLSX conversion, machine-readable
results, structured diagnostics, protected/atomic output, and streaming JSONL
conversion. Generated workbooks start with an English `README` data-dictionary
cover, use deterministic DEFLATE compression for ZIP entries, and reserve the
cover sheet name case-insensitively.

This intake came from an uncommitted local upstream worktree based on the public
`v0.4.2` commit. It is digest-pinned but not release-pinned. Do not describe it
as a published `v0.5.0` asset; replace this provisional provenance after an
immutable upstream commit and Release become available.

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
`runtime/miku-json2xlsx-0.5.0.mjs`. The thin runner reads
`runtime/runtime-manifest.json`, requires its declared versioned executable,
and verifies the SHA-256 before invocation.

The upstream importable runtime bundle and source archive have different
artifact roles and must not silently replace the executable CLI. Do not build
or copy an upstream source tree into this Skill repository as the normal
runtime path.

When `0.5.0` is committed or released upstream, verify the immutable source,
Release asset SHA-256, `--version`, complete `--help`, structured operation
output, and focused integration tests before replacing this provisional
compatibility anchor.
