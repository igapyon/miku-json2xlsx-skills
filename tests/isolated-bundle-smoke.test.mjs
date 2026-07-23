import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const ROOT = process.cwd();
const repoName = "miku-json2xlsx-skills";
const skillName = "igapyon-miku-json2xlsx";

test("generated bundle works from an isolated handoff-only install shape", () => {
  execFileSync("npm", ["run", "build:bundle"], {
    cwd: ROOT,
    encoding: "utf8"
  });

  const sourceBundle = path.resolve(ROOT, "bundle", repoName);
  const isolatedRoot = fs.mkdtempSync(path.join(os.tmpdir(), `${repoName}-bundle-`));
  fs.cpSync(sourceBundle, isolatedRoot, { recursive: true });

  const installedSkillRoot = path.resolve(isolatedRoot, "skills", skillName);
  assert.equal(fs.existsSync(path.resolve(installedSkillRoot, "SKILL.md")), true);
  assert.equal(fs.existsSync(path.resolve(installedSkillRoot, "index.json")), true);
  assert.equal(fs.existsSync(path.resolve(installedSkillRoot, "references", "INDEX.md")), true);
  assert.equal(fs.existsSync(path.resolve(installedSkillRoot, "runtime")), true);
});
