#!/usr/bin/env node
/**
 * Runs every dependency-free test script under src/**\/__tests__/*.test.ts,
 * matching the invocation each file's own doc-comment already documents:
 *
 *   TSX_TSCONFIG_PATH=./tsconfig.app.json npx tsx <file>
 *
 * These files are NOT written against vitest/jest's describe()/it() API —
 * each is a self-contained script that prints its own pass/fail lines and
 * throws (or calls process.exit(1)) at the end if anything failed. Running
 * them through vitest's test collector mis-reports files with zero
 * registered vitest test() calls as "No test suite found" even when every
 * assertion inside actually passed — this plain runner avoids that
 * entirely and reports exactly what each file itself already decides.
 *
 * Usage: npm test
 */
import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");

/** @param {string} dir */
function findTestFiles(dir) {
  /** @type {string[]} */
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      found.push(...findTestFiles(full));
    } else if (entry.endsWith(".test.ts") || entry.endsWith(".test.tsx")) {
      found.push(full);
    }
  }
  return found;
}

const testFiles = findTestFiles(srcDir).sort();

if (testFiles.length === 0) {
  console.log("No test files found under src/**/__tests__/.");
  process.exit(0);
}

let failedCount = 0;

for (const file of testFiles) {
  const relative = path.relative(rootDir, file);
  console.log(`\n── ${relative} ${"─".repeat(Math.max(0, 60 - relative.length))}`);

  const result = spawnSync("npx", ["tsx", file], {
    cwd: rootDir,
    stdio: "inherit",
    env: { ...process.env, TSX_TSCONFIG_PATH: "./tsconfig.app.json" },
  });

  if (result.status !== 0) {
    failedCount++;
    console.error(`✗ FAILED: ${relative}`);
  }
}

console.log(`\n${"=".repeat(60)}`);
console.log(`${testFiles.length - failedCount}/${testFiles.length} test files passed.`);

if (failedCount > 0) {
  console.error(`\n${failedCount} test file(s) failed — see output above.`);
  process.exit(1);
}
