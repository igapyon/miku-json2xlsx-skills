# Mapping Schema v1

This reference summarizes the mapping contract published by upstream
`miku-json2xlsx` `0.5.0`. The upstream CLI remains the source of truth and must
validate every mapping before conversion.

The same schema is used for deterministic automatic mappings generated when
`convert` omits `--mapping`. Automatic mapping creates one `Records` root sheet,
keeps top-level objects and arrays as `json` columns, expands object leaf paths
into additional columns, and does not create child sheets. Use
`--mapping-output <path>` to preserve that generated mapping for review or
reuse.

## Example

```json
{
  "schemaVersion": 1,
  "sheets": [
    {
      "name": "Records",
      "kind": "root",
      "sourcePath": "$",
      "recordIdColumn": "record_id",
      "sourceRecordColumn": "source_record",
      "columns": [
        {
          "name": "id",
          "sourcePath": "$.id",
          "type": "number"
        },
        {
          "name": "name",
          "sourcePath": "$.name",
          "type": "string"
        }
      ]
    },
    {
      "name": "Tags",
      "kind": "child",
      "sourcePath": "$.tags[]",
      "parentSheet": "Records",
      "parentIdColumn": "record_id",
      "childOrderColumn": "tag_order",
      "sourceRecordColumn": "source_record",
      "columns": [
        {
          "name": "tag",
          "sourcePath": "$.tags[]",
          "type": "string"
        }
      ]
    }
  ]
}
```

## Contract

- `schemaVersion` must be `1`.
- A mapping contains exactly one `root` sheet and zero or more `child` sheets.
- The root `sourcePath` is `$`.
- A v1 child sheet directly references the root sheet and uses one trailing
  `[]`, such as `$.tags[]`.
- Multi-level child-of-child mappings and paths containing multiple `[]`
  markers are unsupported.
- Sheet and column order in the mapping determines their workbook order.
- JSON paths start with `$` and use property segments and `[]`.
- A column path must be the sheet path itself or one of its descendants.
- Supported column types are `string`, `number`, `boolean`, `datetime`, and
  `json`.
- Root sheets declare `recordIdColumn` and `sourceRecordColumn`.
- Child sheets declare `parentSheet`, `parentIdColumn`, `childOrderColumn`, and
  `sourceRecordColumn`.
- Tracking-column names must not collide with normal column names.
- Sheet names must satisfy Excel naming rules, including the 31-character
  limit, forbidden characters, and case-insensitive uniqueness.
- `README` is reserved case-insensitively for the generated workbook cover and
  cannot be used as a mapped sheet name.
- Missing and explicit `null` values become empty cells.

## Validation

Write the proposed mapping as UTF-8 JSON and run:

```bash
node <skill-root>/lib/run-miku-json2xlsx.mjs validate-mapping \
  --mapping <mapping.json> \
  --result-format json
```

Proceed only when the process exits with code `0` and the result has
`status: "success"`. Use `diagnostics[].code`, not message text, to classify a
failure.

Do not silently repair a rejected mapping and convert in the same step. Update
the proposal, show any material change to the user, and validate it again.
