import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const ROOT = process.cwd();
const repoName = "miku-json2xlsx-skills";
const skillName = "igapyon-miku-json2xlsx";
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(ROOT, "package.json"), "utf8")
);
const zipPath = path.resolve(ROOT, `bundle/igapyon-${repoName}-${packageJson.version}.zip`);
const skillRoot = path.resolve(ROOT, "skills", skillName);

test("release zip contains installable skill files and excludes development-only files", () => {
  const fixtures = [
    path.resolve(skillRoot, "tmp", "scratch.txt"),
    path.resolve(skillRoot, "references", "output", "generated.txt"),
    path.resolve(skillRoot, "references", "state", "state.json")
  ];

  try {
    for (const fixture of fixtures) {
      fs.mkdirSync(path.dirname(fixture), { recursive: true });
      fs.writeFileSync(fixture, "development-only fixture\n");
    }

    execFileSync("npm", ["run", "build:bundle:zip"], {
      cwd: ROOT,
      encoding: "utf8"
    });
  } finally {
    fs.rmSync(path.resolve(skillRoot, "tmp"), { recursive: true, force: true });
    fs.rmSync(path.resolve(skillRoot, "references", "output"), { recursive: true, force: true });
    fs.rmSync(path.resolve(skillRoot, "references", "state"), { recursive: true, force: true });
  }

  assert.equal(fs.existsSync(zipPath), true);

  const entries = execFileSync("unzip", ["-Z1", zipPath], {
    cwd: ROOT,
    encoding: "utf8"
  }).trim().split(/\n/).filter(Boolean);

  assertIncludes(entries, `skills/${skillName}/SKILL.md`);
  assertIncludes(entries, `skills/${skillName}/index.json`);
  assertIncludes(entries, `skills/${skillName}/references/INDEX.md`);
  assertIncludes(entries, `skills/${skillName}/references/workflow/json2xlsx-workflow.md`);
  assertIncludes(entries, `skills/${skillName}/references/runtime/mapping-v1.md`);
  assertIncludes(entries, `skills/${skillName}/references/runtime/operations-map.md`);
  assertIncludes(entries, `skills/${skillName}/references/runtime/upstream-contract.md`);
  assertIncludes(entries, `skills/${skillName}/lib/run-miku-json2xlsx.mjs`);
  assertIncludes(entries, `skills/${skillName}/runtime/runtime-manifest.json`);
  assertIncludes(entries, `skills/${skillName}/runtime/miku-json2xlsx-0.5.0.mjs`);

  assert.equal(entries.some((entry) => entry.includes(".DS_Store")), false);
  assert.equal(entries.some((entry) => entry.startsWith("tests/")), false);
  assert.equal(entries.some((entry) => entry.startsWith("docs/")), false);
  assert.equal(entries.some((entry) => entry.startsWith("bundle/")), false);
  assert.equal(entries.some((entry) => entry.includes("node_modules/")), false);
  assert.equal(entries.some((entry) => entry.startsWith("workplace/")), false);
  assert.equal(entries.some((entry) => entry.includes("/tmp/")), false);
  assert.equal(entries.some((entry) => entry.includes("/output/")), false);
  assert.equal(entries.some((entry) => entry.includes("/state/")), false);
});

function assertIncludes(entries, expected) {
  assert.ok(entries.includes(expected), `missing zip entry: ${expected}`);
}
