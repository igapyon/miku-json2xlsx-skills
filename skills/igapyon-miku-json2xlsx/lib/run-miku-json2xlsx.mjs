#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const SKILL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_RUNTIME_DIR = path.resolve(SKILL_ROOT, "runtime");
const MANIFEST_NAME = "runtime-manifest.json";
const RUNTIME_NAME = /^miku-json2xlsx-(\d+(?:\.\d+)+)\.mjs$/;
const SHA256 = /^[a-f0-9]{64}$/;

export function findRuntimeArtifact(runtimeDir = DEFAULT_RUNTIME_DIR) {
  if (!fs.existsSync(runtimeDir)) {
    throw new Error(`miku-json2xlsx runtime directory is missing: ${runtimeDir}`);
  }

  const manifest = loadRuntimeManifest(runtimeDir);
  const runtimePath = path.resolve(runtimeDir, manifest.executable.file);
  if (path.dirname(runtimePath) !== path.resolve(runtimeDir)) {
    throw new Error("Runtime manifest executable file must be a plain file name");
  }
  if (!fs.existsSync(runtimePath)) {
    throw new Error(
      `Manifest-declared miku-json2xlsx runtime is missing: ${runtimePath}`
    );
  }

  const match = RUNTIME_NAME.exec(manifest.executable.file);
  if (!match || match[1] !== manifest.executable.version) {
    throw new Error(
      "Runtime manifest file name and executable version do not match"
    );
  }

  verifyRuntimeArtifact(runtimePath, manifest.executable.sha256);
  return runtimePath;
}

export function loadRuntimeManifest(runtimeDir = DEFAULT_RUNTIME_DIR) {
  const manifestPath = path.resolve(runtimeDir, MANIFEST_NAME);
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`miku-json2xlsx runtime manifest is missing: ${manifestPath}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (
    manifest.schemaVersion !== 1
    || manifest.product !== "miku-json2xlsx"
    || typeof manifest.executable !== "object"
    || typeof manifest.executable.file !== "string"
    || typeof manifest.executable.version !== "string"
    || manifest.executable.role !== "cli"
    || typeof manifest.executable.sha256 !== "string"
    || !SHA256.test(manifest.executable.sha256)
  ) {
    throw new Error(`Invalid miku-json2xlsx runtime manifest: ${manifestPath}`);
  }
  return manifest;
}

export function verifyRuntimeArtifact(runtimePath, expectedSha256) {
  const actualSha256 = createHash("sha256")
    .update(fs.readFileSync(runtimePath))
    .digest("hex");
  if (actualSha256 !== expectedSha256) {
    throw new Error(
      `Runtime SHA-256 mismatch: expected ${expectedSha256}, got ${actualSha256}`
    );
  }
  return actualSha256;
}

export function runRuntime(args, options = {}) {
  const runtimePath = findRuntimeArtifact(options.runtimeDir);
  return spawnSync(process.execPath, [runtimePath, ...args], {
    cwd: options.cwd,
    env: options.env ?? process.env,
    stdio: options.stdio ?? "inherit",
    encoding: options.encoding
  });
}

function isMainModule() {
  if (process.argv[1] === undefined) {
    return false;
  }
  return fs.realpathSync(path.resolve(process.argv[1]))
    === fs.realpathSync(fileURLToPath(import.meta.url));
}

if (isMainModule()) {
  try {
    const result = runRuntime(process.argv.slice(2));
    if (result.error) {
      throw result.error;
    }
    if (result.signal) {
      process.stderr.write(
        `miku-json2xlsx runtime stopped by signal ${result.signal}\n`
      );
      process.exitCode = 3;
    } else {
      process.exitCode = result.status ?? 3;
    }
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`
    );
    process.exitCode = 3;
  }
}
