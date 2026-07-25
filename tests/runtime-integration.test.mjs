import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  findRuntimeArtifact,
  loadRuntimeManifest,
  verifyRuntimeArtifact
} from "../skills/igapyon-miku-json2xlsx/lib/run-miku-json2xlsx.mjs";

const ROOT = process.cwd();
const SKILL_ROOT = path.resolve(ROOT, "skills", "igapyon-miku-json2xlsx");
const RUNNER = path.resolve(SKILL_ROOT, "lib", "run-miku-json2xlsx.mjs");

test("runtime resolver selects the verified executable artifact", () => {
  const manifest = loadRuntimeManifest();
  assert.equal(manifest.executable.version, "0.3.0");
  assert.equal(
    path.basename(findRuntimeArtifact()),
    manifest.executable.file
  );
  assert.equal(
    verifyRuntimeArtifact(
      path.resolve(SKILL_ROOT, "runtime", manifest.executable.file),
      manifest.executable.sha256
    ),
    manifest.executable.sha256
  );
});

test("runtime resolver rejects a digest-mismatched executable", () => {
  const sourceRuntimeDir = path.resolve(SKILL_ROOT, "runtime");
  const tempRuntimeDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "miku-json2xlsx-runtime-")
  );
  fs.cpSync(sourceRuntimeDir, tempRuntimeDir, { recursive: true });

  const manifest = loadRuntimeManifest(tempRuntimeDir);
  fs.appendFileSync(path.resolve(tempRuntimeDir, manifest.executable.file), "\n");

  assert.throws(
    () => findRuntimeArtifact(tempRuntimeDir),
    /Runtime SHA-256 mismatch/
  );
});

test("bundled runtime inspects, validates, and converts a minimal input", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "miku-json2xlsx-skill-"));
  const inputPath = path.resolve(tempRoot, "records.json");
  const mappingPath = path.resolve(tempRoot, "mapping.json");
  const outputPath = path.resolve(tempRoot, "records.xlsx");

  fs.writeFileSync(inputPath, JSON.stringify([
    { id: 1, name: "Alice", tags: ["alpha", "beta"] },
    { id: 2, name: "Bob", tags: [] }
  ]));
  fs.writeFileSync(mappingPath, JSON.stringify({
    schemaVersion: 1,
    sheets: [
      {
        name: "Records",
        kind: "root",
        sourcePath: "$",
        recordIdColumn: "record_id",
        sourceRecordColumn: "source_record",
        columns: [
          { name: "id", sourcePath: "$.id", type: "number" },
          { name: "name", sourcePath: "$.name", type: "string" }
        ]
      },
      {
        name: "Tags",
        kind: "child",
        sourcePath: "$.tags[]",
        parentSheet: "Records",
        parentIdColumn: "record_id",
        childOrderColumn: "tag_order",
        sourceRecordColumn: "source_record",
        columns: [
          { name: "tag", sourcePath: "$.tags[]", type: "string" }
        ]
      }
    ]
  }));

  const inspection = runJson([
    "inspect",
    "--input",
    inputPath,
    "--result-format",
    "json"
  ]);
  assert.equal(inspection.status, "success");
  assert.equal(inspection.command, "inspect");
  assert.equal(inspection.inspection.recordCount, 2);

  const validation = runJson([
    "validate-mapping",
    "--mapping",
    mappingPath,
    "--result-format",
    "json"
  ]);
  assert.equal(validation.status, "success");
  assert.equal(validation.command, "validate-mapping");

  const conversion = runJson([
    "convert",
    "--input",
    inputPath,
    "--output",
    outputPath,
    "--mapping",
    mappingPath,
    "--result-format",
    "json"
  ]);
  assert.equal(conversion.status, "success");
  assert.equal(conversion.command, "convert");
  assert.deepEqual(conversion.artifacts, [{ kind: "xlsx", path: outputPath }]);
  assert.equal(fs.statSync(outputPath).size > 0, true);
});

function runJson(args) {
  return JSON.parse(execFileSync(process.execPath, [RUNNER, ...args], {
    cwd: ROOT,
    encoding: "utf8"
  }));
}
