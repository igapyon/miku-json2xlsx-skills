# JSON to XLSX Workflow

## Flow

The workflow proceeds in four stages.

1. Inspect the JSON or JSONL input through the upstream CLI.
2. Choose deterministic automatic mapping or propose an explicit mapping
   covering sheets, columns, types, JSON paths, and parent-child relationships.
3. Present the mapping mode, material assumptions, and warnings, then obtain
   approval or an unambiguous conversion instruction.
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

An explicit mapping v1 proposal makes these decisions reviewable:

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

For straightforward file input, automatic mapping may be selected instead.
It deterministically creates a `Records` root sheet, preserves top-level
objects and arrays as JSON columns, and expands object leaf paths. It does not
create child sheets, and it cannot be used with stdin because JSONL auto-mapping
requires a second pass. Add `--mapping-output <path>` when the generated mapping
must be reviewed, edited, or reused.

## Write Boundary

Writing an XLSX file requires human approval or an unambiguous instruction that
identifies the selected mapping mode and output target. Explicit mappings must
also identify the reviewed mapping. Existing files must not be overwritten
implicitly.

## Result Review

Use `--result-format json`. Check the exit code, `status`, `mappingMode`,
`diagnostics[]`, and `artifacts[]`. Safe warnings may accompany exit code `0`;
semantic or
processing failures use exit code `1`, usage/malformed-input failures use `2`,
and unexpected runtime failures use `3`. Do not treat a path as a completed
artifact unless the successful result lists it. When `--mapping-output` is
used, require both the XLSX and mapping entries. A successful `0.5.0` workbook
begins with the generated English `README` data dictionary, followed by the
mapped root and child sheets, and uses deterministic DEFLATE compression for
its ZIP entries.
