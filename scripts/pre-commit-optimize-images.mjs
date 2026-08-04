#!/usr/bin/env node
// Pre-commit step: any staged raster image under public/Images/ is converted to
// WebP (references rewritten with it), optimized, and re-staged.
//
// Wired in via .git/hooks/pre-commit. Runs only on files git reports as added or
// modified. Safe to run repeatedly: the converter skips WebP, the exempt social
// and brand assets, and <picture> fallbacks; the batch optimizer keeps the
// original buffer if it can't shrink it.

import { execSync } from "node:child_process";
import path from "node:path";
import { CONVERTIBLE_EXT, skipReason } from "./to-webp.mjs";

const RASTER_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ROOT_PREFIX = "public/Images/";

function staged() {
  // -z + null parser keeps paths with spaces intact.
  const out = execSync("git diff --cached --name-only --diff-filter=ACMR -z", {
    encoding: "buffer",
  });
  return out
    .toString("utf8")
    .split("\0")
    .filter(Boolean);
}

function isTargetImage(p) {
  const norm = p.replace(/\\/g, "/");
  if (!norm.startsWith(ROOT_PREFIX)) return false;
  return RASTER_EXT.has(path.extname(norm).toLowerCase());
}

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

/** Files git reports as modified in the working tree but not staged. */
function unstaged() {
  const out = execSync("git diff --name-only -z", { encoding: "buffer" });
  return new Set(out.toString("utf8").split("\0").filter(Boolean));
}

function webpPath(f) {
  return f.slice(0, -path.extname(f).length) + ".webp";
}

// Converts what can be converted and returns the list of images to optimize,
// with each converted original replaced by its .webp.
async function toWebp(files) {
  const convertible = [];
  for (const f of files) {
    if (!CONVERTIBLE_EXT.has(path.extname(f).toLowerCase())) continue;
    const reason = await skipReason(f);
    if (reason) console.log(`[pre-commit] ${f} kept as-is: ${reason}`);
    else convertible.push(f);
  }
  if (convertible.length === 0) return files;

  const dirtyBefore = unstaged();
  console.log(`[pre-commit] converting ${convertible.length} image(s) to WebP...`);
  run(`node scripts/to-webp.mjs ${convertible.map((f) => `"${f}"`).join(" ")}`);

  // Stage the new .webp plus the deletion of the original, then the reference
  // rewrites the converter made in files that were clean before it ran.
  for (const f of convertible) {
    run(`git add -A -- "${f}" "${webpPath(f)}"`);
  }
  for (const f of unstaged()) {
    if (dirtyBefore.has(f) || isTargetImage(f)) continue;
    console.log(`[pre-commit] staging reference rewrite in ${f}`);
    run(`git add -- "${f}"`);
  }
  // A file that was already dirty keeps its rewrite in the working tree only;
  // the converter listed it above, so the author can stage it deliberately.
  return files.filter((f) => !convertible.includes(f)).concat(convertible.map(webpPath));
}

async function main() {
  const files = staged().filter(isTargetImage);
  if (files.length === 0) return;

  const images = await toWebp(files);
  if (images.length === 0) return;

  console.log(`[pre-commit] optimizing ${images.length} image(s)...`);
  for (const f of images) {
    try {
      run(`node scripts/optimize-images-batch.mjs "${f}"`);
      run(`git add -- "${f}"`);
    } catch (err) {
      console.error(`[pre-commit] failed to optimize ${f}: ${err.message}`);
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(`[pre-commit] ${err.message}`);
  process.exit(1);
});
