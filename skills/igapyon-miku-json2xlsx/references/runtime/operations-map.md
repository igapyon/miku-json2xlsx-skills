# Runtime Operations Map

## Backend Policy

Current policy: `cli-only`.

Use the bundled upstream `v0.3.0` executable through
`lib/run-miku-json2xlsx.mjs`. The runner requires
`runtime/runtime-manifest.json` and verifies the declared executable SHA-256
before every operation. Missing, incompatible, or digest-mismatched runtime is
a hard error. Do not fall back to an MCP backend, importable runtime bundle,
skill-local converter, or unrelated spreadsheet implementation.

## Operations

| Operation | Input role | Output role | Current status |
|---|---|---|---|
| `metadata` | `--help` or `--version` | CLI contract or version | CLI |
| `inspect` | JSON, JSONL, or stdin | structured input profile and bounded samples | CLI |
| `mapping-plan` | inspection result and user intent | human-reviewable mapping proposal | Agent/human review |
| `mapping-validate` | mapping v1 JSON | validation result and diagnostics | CLI |
| `convert` | input plus approved mapping | XLSX and diagnostics | CLI |
| `report` | conversion result | concise artifact and warning summary | Agent from CLI result |

## Artifact Roles

- source input: user-provided JSON or JSONL
- inspection result: machine-readable upstream CLI output
- mapping: deterministic conversion specification owned by the upstream contract
- primary output: generated XLSX workbook
- diagnostics: warnings and hard errors with source locations where available

## Hard Errors

Treat these as hard stops:

- missing upstream runtime for an executable operation
- unpublished or incompatible mapping contract
- inaccessible input or output path
- ambiguous overwrite request
- upstream validation or conversion failure

Do not silently fall back to a skill-local converter or an unrelated generic
spreadsheet implementation.
