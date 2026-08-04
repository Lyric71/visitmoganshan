// Shared save path for the image generators: everything lands as optimized WebP.
//
// The generation APIs hand back PNG. Nothing under public/Images/ should ship in
// that form, so we transcode on the way to disk instead of leaving a stray PNG
// for the pre-commit hook to catch later.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MAX_WIDTH = 2000;
const QUALITY = 82;

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Write `buffer` as WebP at `outPath`, forcing the .webp extension and resizing
 * anything wider than 2000px. Returns the path actually written.
 */
export async function saveAsWebp(buffer, outPath) {
  const ext = path.extname(outPath);
  const file = (ext ? outPath.slice(0, -ext.length) : outPath) + ".webp";

  const dir = path.dirname(file);
  if (dir && dir !== ".") await mkdir(dir, { recursive: true });

  const pipe = sharp(buffer).rotate();
  const meta = await pipe.metadata();
  const sized =
    meta.width && meta.width > MAX_WIDTH
      ? pipe.resize({ width: MAX_WIDTH, withoutEnlargement: true })
      : pipe;
  const out = await sized.webp({ quality: QUALITY, effort: 6 }).toBuffer();
  await writeFile(file, out);

  console.log(
    `Saved: ${file}  ${fmtBytes(out.length)} (webp, from ${fmtBytes(buffer.length)} source)`,
  );
  return file;
}
