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
  assert.match(skill, /Version `0\.5\.0` is CLI-backed/);
  assert.match(skill, /deterministic automatic mapping/);
  assert.match(skill, /--mapping-output/);
  assert.match(skill, /run-miku-json2xlsx\.mjs/);
  assert.match(skill, /references\/runtime\/mapping-v1\.md/);
  assert.match(skill, /--result-format json/);
  assert.equal(skill.includes("__SKILL_NAME__"), false);
  assert.equal(fs.existsSync(path.resolve(skillRoot, "index.json")), true);
});

test("runtime manifest pins the verified provisional 0.5.0 executable artifact", () => {
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
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(ROOT, "package.json"), "utf8")
  );

  assert.match(contract, /public base commit: `b134a7881e58733f233361bf36c7eef681487058`/);
  assert.match(contract, /latest checked public release: `v0.4.2`/);
  assert.match(contract, /uncommitted local upstream worktree/);
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.product, "miku-json2xlsx");
  assert.equal(manifest.upstream.release, null);
  assert.equal(manifest.upstream.commit, null);
  assert.equal(
    manifest.upstream.baseCommit,
    "b134a7881e58733f233361bf36c7eef681487058"
  );
  assert.equal(manifest.upstream.sourceKind, "local-uncommitted-worktree");
  assert.equal(manifest.upstream.sourceBranch, "devel-tiga0727mbg");
  assert.equal(manifest.executable.file, "miku-json2xlsx-0.5.0.mjs");
  assert.equal(manifest.executable.version, "0.5.0");
  assert.equal(packageJson.version, manifest.executable.version);
  assert.equal(manifest.executable.role, "cli");
  assert.equal(
    manifest.executable.sha256,
    "ab543255038d432730db486fec70ad8eb87df5f5751d592fd5907c4dfdac2b71"
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
