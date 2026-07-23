# TODO

- Receive the executable CLI bundle from upstream `miku-json2xlsx` release
  `v0.2.0` or a later documented release under
  `skills/igapyon-miku-json2xlsx/runtime/`. The `v0.2.0` GitHub Release currently
  has no attached assets.
- Record the received artifact source and SHA-256 digest, rename it to a
  versioned skill runtime name, and verify `--version` and `--help`.
- Keep metadata smoke separate from product operations: upstream `v0.2.0`
  implements `--help` and `--version`, while `inspect`, mapping validation,
  conversion, and result reporting remain future upstream work.
- Add thin runtime discovery and invocation helpers only after the upstream CLI
  contract is stable.
- Implement the Agent Skill workflow tracked by
  <https://github.com/igapyon/miku-json2xlsx-skills/issues/1>.
- Add CLI integration fixtures and end-to-end verification tracked by
  <https://github.com/igapyon/miku-json2xlsx-skills/issues/2>.
- Keep the skill contract aligned with the upstream CLI issues at
  <https://github.com/igapyon/miku-json2xlsx/issues>.
