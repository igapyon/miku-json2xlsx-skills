# JSON to XLSX Workflow

## Target Flow

The mature workflow is intended to proceed in four stages.

1. Inspect the JSON or JSONL input through the upstream CLI.
2. Propose a mapping covering sheets, columns, types, JSON paths, and parent-child
   relationships.
3. Present material assumptions and warnings, then obtain approval or an
   unambiguous conversion instruction.
4. Execute the upstream CLI and report the workbook path, sheet relationships,
   record counts, and warnings.

## Input Analysis

The upstream inspection result should identify, when supported:

- input kind: JSON array, JSONL, or single JSON object
- record count and bounded sampling conditions
- keys, JSON paths, candidate types, missing values, nulls, and mixed types
- nested objects and arrays that may require flattening or child sheets
- source record numbers or identifiers needed for traceability

Do not load an entire large JSONL input into agent context. Prefer structured
inspection output and bounded samples.

## Mapping Review

A future mapping proposal should make these decisions reviewable:

- sheet names and collision handling
- column names, order, source JSON paths, and target types
- object flattening rules
- arrays selected for child-sheet output
- parent identifiers and child element ordering
- handling of missing, null, mixed, unsafe, or unsupported values

Do not invent the machine-readable mapping schema before the upstream contract
is published. Human-readable planning is not a substitute for validated CLI
input.

## Write Boundary

Writing an XLSX file requires human approval or an unambiguous instruction that
identifies the reviewed mapping and output target. Existing files must not be
overwritten implicitly.

## Current Limitation

The `0.2.2` scaffold is `handoff-only`. Because no upstream runtime artifact has
been received, inspection, mapping validation, conversion, and workbook result
verification are not executable yet.
