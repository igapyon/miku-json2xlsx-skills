import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const skillRoot = path.resolve(ROOT, "skills", "igapyon-miku-json2xlsx");

test("skill contract is explicit and CLI-backed", () => {
  const skill = fs.readFileSync(path.resolve(skillRoot, "SKILL.md"), "utf8");

  assert.match(skill, /name: igapyon-miku-json2xlsx/);
  assert.match(skill, /miku-json2xlsx-skills/);
  assert.match(skill, /Version `0\.3\.0` is CLI-backed/);
  assert.match(skill, /run-miku-json2xlsx\.mjs/);
  assert.match(skill, /references\/runtime\/mapping-v1\.md/);
  assert.match(skill, /--result-format json/);
  assert.equal(skill.includes("__SKILL_NAME__"), false);
  assert.equal(fs.existsSync(path.resolve(skillRoot, "index.json")), true);
});

test("runtime manifest pins the verified v0.3.0 executable asset", () => {
  const contract = fs.readFileSync(
    path.resolve(skillRoot, "references", "runtime", "upstream-contract.md"),
    "utf8"
  );
  const manifest = JSON.parse(
    fs.readFileSync(
      path.resolve(skillRoot, "runtime", "runtime-manifest.json"),
      "utf8"
    )
  );

  assert.match(contract, /checked commit: `9cf12f8e3f8d0722fd79b4734b9198647332b986`/);
  assert.match(contract, /checked release: `v0.3.0`/);
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.product, "miku-json2xlsx");
  assert.equal(manifest.upstream.release, "v0.3.0");
  assert.equal(
    manifest.upstream.commit,
    "9cf12f8e3f8d0722fd79b4734b9198647332b986"
  );
  assert.equal(manifest.executable.file, "miku-json2xlsx-0.3.0.mjs");
  assert.equal(manifest.executable.version, "0.3.0");
  assert.equal(manifest.executable.role, "cli");
  assert.match(manifest.executable.sha256, /^[a-f0-9]{64}$/);
});

test("release workflow verifies the bundled CLI runtime", () => {
  const workflow = fs.readFileSync(
    path.resolve(ROOT, ".github", "workflows", "release-build.yml"),
    "utf8"
  );

  assert.match(workflow, /Verify bundled CLI runtime/);
  assert.match(workflow, /run-miku-json2xlsx\.mjs --version/);
  assert.match(workflow, /run-miku-json2xlsx\.mjs --help/);
  assert.equal(workflow.includes("Verify initial handoff-only runtime state"), false);
});
