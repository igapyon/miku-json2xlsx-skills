import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();
const skillRoot = path.resolve(ROOT, "skills", "igapyon-miku-json2xlsx");

test("skill contract is explicit and handoff-only until a runtime is received", () => {
  const skill = fs.readFileSync(path.resolve(skillRoot, "SKILL.md"), "utf8");

  assert.match(skill, /name: igapyon-miku-json2xlsx/);
  assert.match(skill, /miku-json2xlsx-skills/);
  assert.match(skill, /handoff-only/);
  assert.match(skill, /Do not execute a conversion/);
  assert.equal(skill.includes("__SKILL_NAME__"), false);
  assert.equal(fs.existsSync(path.resolve(skillRoot, "index.json")), true);
});

test("runtime contract pins v0.2.0 and records the missing release asset", () => {
  const contract = fs.readFileSync(
    path.resolve(skillRoot, "references", "runtime", "upstream-contract.md"),
    "utf8"
  );

  assert.match(contract, /checked commit: `eb0719d8c84ae018d041ccfd50205cd53f8ab8b4`/);
  assert.match(contract, /checked release: `v0.2.0`/);
  assert.match(contract, /release assets: none/);
});
