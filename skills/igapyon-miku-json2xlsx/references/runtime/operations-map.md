# Runtime Operations Map

## Backend Policy

Current policy: `handoff-only`.

The target policy after receiving and testing an upstream CLI runtime is
`cli-preferred`. Do not change the policy until runtime metadata and focused
integration tests pass from the isolated bundle shape.

Upstream `v0.2.0` source can build an executable CLI bundle that supports
`--help` and `--version`, but the GitHub Release has no attached asset. Metadata
support does not make the product operations below executable.

## Operations

| Operation | Input role | Output role | Current status |
|---|---|---|---|
| `metadata` | `--help` or `--version` | CLI contract or version | implemented upstream; artifact not received |
| `inspect` | JSON, JSONL, or stdin | structured input profile and bounded samples | unavailable; upstream CLI pending |
| `mapping-plan` | inspection result and user intent | human-reviewable mapping proposal | handoff guidance only |
| `mapping-validate` | machine-readable mapping | validation diagnostics | unavailable; upstream contract pending |
| `convert` | input plus approved mapping | XLSX and diagnostics | unavailable; upstream runtime pending |
| `report` | conversion result | concise sheet, count, and warning summary | unavailable until conversion exists |

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
