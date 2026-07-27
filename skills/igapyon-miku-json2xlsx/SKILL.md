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

Version `0.4.2` is CLI-backed beta software. The bundled upstream executable
supports `inspect`, `validate-mapping`, and `convert`, including deterministic
automatic mapping and optional generated-mapping output. Invoke it through
`lib/run-miku-json2xlsx.mjs`, which resolves the executable declared by
`runtime/runtime-manifest.json` and verifies its SHA-256 before execution. Do
not substitute the importable runtime bundle or an unrelated spreadsheet
implementation.

## Core Rules

- keep JSON parsing, structure inspection, mapping validation, XLSX generation,
  and conversion limits in upstream `miku-json2xlsx`
- keep the skill focused on activation, structured workflow, human review,
  runtime handoff, and concise result reporting
- expose important assumptions, missing fields, mixed types, and warnings before
  conversion once the upstream inspection contract exists
- require human approval or an unambiguous instruction before a conversion
  operation writes an XLSX file
- avoid loading an entire large JSONL file into agent context; use the upstream
  inspection result and bounded samples
- treat `index.json` as generated discovery metadata and never edit it manually
- preserve upstream diagnostics and do not hide unsupported behavior
- do not implement a parallel JSON-to-XLSX converter in this repository
- treat `runtime/runtime-manifest.json` as the machine-readable runtime
  provenance source; do not bypass its digest verification
- use `--result-format json` for agent-operated product commands
- check the process exit code, result `status`, `diagnostics`, and `artifacts`
- check successful conversion `mappingMode` for `auto` or `explicit`
- do not add `--overwrite` unless the user explicitly authorizes replacement
- expect each generated workbook to start with the upstream-owned English
  `README` data-dictionary sheet; mapped root and child sheets follow it

## CLI Workflow

1. Run the inspection:

   ```bash
   node <skill-root>/lib/run-miku-json2xlsx.mjs inspect \
     --input <input.json-or-jsonl> --result-format json
   ```

2. Review `inspection.scope`, paths, types, missing/null values, arrays, and
   bounded samples. Choose one mapping mode:
   - omit `--mapping` for deterministic automatic mapping of a rereadable file;
     arrays remain JSON columns and no child sheets are inferred
   - read [references/runtime/mapping-v1.md](references/runtime/mapping-v1.md)
     and propose an explicit mapping when column control or child sheets are
     required
3. For an explicit mapping, validate it:

   ```bash
   node <skill-root>/lib/run-miku-json2xlsx.mjs validate-mapping \
     --mapping <mapping.json> --result-format json
   ```

4. Present the selected mapping mode, material assumptions, and warnings.
   Obtain approval or an unambiguous instruction identifying the output path
   and, for explicit mode, the reviewed mapping.
5. Convert:

   ```bash
   node <skill-root>/lib/run-miku-json2xlsx.mjs convert \
     --input <input.json-or-jsonl> \
     --output <output.xlsx> \
     [--mapping <mapping.json>] \
     [--mapping-output <generated-mapping.json>] \
     --result-format json
   ```

   Use `--mapping-output` only in automatic mode when the generated mapping
   should be saved for inspection or reuse. Automatic mode requires a file
   input; stdin still requires an explicit mapping.
6. Report `mappingMode`, the XLSX artifact path, any generated mapping artifact,
   the generated `README` cover, mapped sheets/rows when reported, and
   diagnostics. Treat exit codes `1`, `2`, and `3` according to the upstream
   contract.

## References

Read these only when needed:

- [index.json](index.json) for generated bundled-file discovery
- [references/INDEX.md](references/INDEX.md) for reference navigation
- [references/workflow/json2xlsx-workflow.md](references/workflow/json2xlsx-workflow.md)
  for the analysis, approval, execution, and reporting flow
- [references/runtime/operations-map.md](references/runtime/operations-map.md)
  for current operation availability and backend policy
- [references/runtime/upstream-contract.md](references/runtime/upstream-contract.md)
  for the upstream compatibility anchor and runtime boundary
- [references/runtime/mapping-v1.md](references/runtime/mapping-v1.md) for the
  published mapping shape, supported types, tracking columns, and v1 limits
