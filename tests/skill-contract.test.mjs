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
  assert.match(skill, /Version `0\.4\.2` is CLI-backed/);
  assert.match(skill, /deterministic automatic mapping/);
  assert.match(skill, /--mapping-output/);
  assert.match(skill, /run-miku-json2xlsx\.mjs/);
  assert.match(skill, /references\/runtime\/mapping-v1\.md/);
  assert.match(skill, /--result-format json/);
  assert.equal(skill.includes("__SKILL_NAME__"), false);
  assert.equal(fs.existsSync(path.resolve(skillRoot, "index.json")), true);
});

test("runtime manifest pins the verified v0.4.2 executable asset", () => {
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

  assert.match(contract, /checked commit: `b134a7881e58733f233361bf36c7eef681487058`/);
  assert.match(contract, /checked release: `v0.4.2`/);
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.product, "miku-json2xlsx");
  assert.equal(manifest.upstream.release, "v0.4.2");
  assert.equal(
    manifest.upstream.commit,
    "b134a7881e58733f233361bf36c7eef681487058"
  );
  assert.equal(manifest.executable.file, "miku-json2xlsx-0.4.2.mjs");
  assert.equal(manifest.executable.version, "0.4.2");
  assert.equal(manifest.executable.role, "cli");
  assert.equal(
    manifest.executable.sha256,
    "969e74f65c8f8cdb30e9ab067d43eeb5138f208b3e79f1ca4006e9511b5c4251"
  );
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
