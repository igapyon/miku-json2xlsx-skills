# JSON to XLSX Workflow

## Flow

The workflow proceeds in four stages.

1. Inspect the JSON or JSONL input through the upstream CLI.
2. Propose a mapping covering sheets, columns, types, JSON paths, and parent-child
   relationships.
3. Present material assumptions and warnings, then obtain approval or an
   unambiguous conversion instruction.
4. Execute the upstream CLI and report the workbook path, sheet relationships,
   record counts, and warnings.

## Input Analysis

The upstream inspection result identifies:

- input kind: JSON array, JSONL, or single JSON object
- record count and bounded sampling conditions
- keys, JSON paths, candidate types, missing values, nulls, and mixed types
- nested objects and arrays that may require flattening or child sheets
- source record numbers or identifiers needed for traceability

Do not load an entire large JSONL input into agent context. Prefer structured
inspection output and bounded samples.

## Mapping Review

A mapping v1 proposal makes these decisions reviewable:

- sheet names and collision handling
- column names, order, source JSON paths, and target types
- object flattening rules
- arrays selected for child-sheet output
- parent identifiers and child element ordering
- handling of missing, null, mixed, unsafe, or unsupported values

Mapping JSON uses `schemaVersion: 1`, exactly one root sheet, optional direct
child sheets, explicit tracking columns, and typed columns. Read
[../runtime/mapping-v1.md](../runtime/mapping-v1.md) for the published shape,
supported types, and v1 limits. Always run `validate-mapping`; human-readable
planning is not a substitute for validated CLI input.

`README` is reserved case-insensitively for the generated workbook cover and
must not be proposed as a mapped sheet name.

## Write Boundary

Writing an XLSX file requires human approval or an unambiguous instruction that
identifies the reviewed mapping and output target. Existing files must not be
overwritten implicitly.

## Result Review

Use `--result-format json`. Check the exit code, `status`, `diagnostics[]`, and
`artifacts[]`. Safe warnings may accompany exit code `0`; semantic or
processing failures use exit code `1`, usage/malformed-input failures use `2`,
and unexpected runtime failures use `3`. Do not treat a path as a completed
XLSX artifact unless the successful result lists it. A successful `v0.4.1`
workbook begins with the generated English `README` data dictionary, followed
by the mapped root and child sheets.
