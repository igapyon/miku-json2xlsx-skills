---
name: igapyon-miku-json2xlsx
description: Use only when the user explicitly names `miku-json2xlsx`, `miku-json2xlsx-skills`, or `igapyon-miku-json2xlsx` for product-specific JSON or JSONL to XLSX workflows. Do not auto-activate for generic JSON, spreadsheet, XLSX, data analysis, or file-conversion requests.
---

# Miku JSON to XLSX

Use this skill for `miku-json2xlsx`-specific agent workflows. Keep it as a thin
workflow adapter over the upstream product at
<https://github.com/igapyon/miku-json2xlsx>.

## Activation

Start this skill only when at least one of these explicit triggers is present:

- the user names `miku-json2xlsx`
- the user names `miku-json2xlsx-skills`
- the user names `igapyon-miku-json2xlsx`
- the recent conversation is already inside an explicitly activated
  `miku-json2xlsx` workflow

Do not start it for generic JSON inspection, spreadsheet creation, XLSX work,
data cleanup, or format-conversion requests.

## Required First Checks

1. Read [index.json](index.json) first as the generated discovery index.
2. Open only the references needed for the requested operation.
3. Read [references/runtime/upstream-contract.md](references/runtime/upstream-contract.md)
   before relying on a runtime or mapping contract.
4. Confirm the active backend status in
   [references/runtime/operations-map.md](references/runtime/operations-map.md).

## Current Backend Status

The initial `0.2.2` scaffold is `handoff-only`. Upstream `v0.2.0` can build a
metadata-only CLI runtime, but no versioned Release asset has been received and
JSON/XLSX product operations remain unimplemented. Do not execute a conversion,
invent unpublished CLI flags or mapping fields, or claim that an XLSX file was
generated.

## Core Rules

- keep JSON parsing, structure inspection, mapping validation, XLSX generation,
  and conversion limits in upstream `miku-json2xlsx`
- keep the skill focused on activation, structured workflow, human review,
  runtime handoff, and concise result reporting
- expose important assumptions, missing fields, mixed types, and warnings before
  conversion once the upstream inspection contract exists
- require human approval or an unambiguous instruction before a future
  conversion operation writes an XLSX file
- avoid loading an entire large JSONL file into agent context; use the upstream
  inspection result and bounded samples when that capability becomes available
- treat `index.json` as generated discovery metadata and never edit it manually
- preserve upstream diagnostics and do not hide unsupported behavior
- do not implement a parallel JSON-to-XLSX converter in this repository

## Current Workflow

Until an upstream runtime is received:

1. identify the requested `miku-json2xlsx` workflow and input constraints
2. explain that executable inspection and conversion are not yet available
3. provide only human-reviewable handoff requirements supported by the published
   project scope
4. record unresolved mapping or runtime dependencies without presenting them as
   implemented contracts

## References

Read these only when needed:

- [index.json](index.json) for generated bundled-file discovery
- [references/INDEX.md](references/INDEX.md) for reference navigation
- [references/workflow/json2xlsx-workflow.md](references/workflow/json2xlsx-workflow.md)
  for the planned analysis, approval, execution, and reporting flow
- [references/runtime/operations-map.md](references/runtime/operations-map.md)
  for current operation availability and backend policy
- [references/runtime/upstream-contract.md](references/runtime/upstream-contract.md)
  for the upstream compatibility anchor and runtime boundary
