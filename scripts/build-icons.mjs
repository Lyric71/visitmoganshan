#!/usr/bin/env node
// Rebuild every browser and platform icon from one source SVG.
//
// Usage:
//   npm run icons
//
// Source: public/mark-favicon.svg (the reduced four culm mark, reversed on a
// solid bamboo plate). The plate matters: a transparent icon with dark ink
// vanishes against Chrome's dark tab strip, and Google composites favicons on
// its own background. Every raster below is therefore fully opaque.
//
// Outputs:
//   public/favicon.ico        16, 32, 48 (Chrome, Edge, Firefox, bookmarks)
//   public/icon-48.png        Google Search minimum, a multiple of 48
//   public/icon-96.png        Google Search preferred, high density tabs
//   public/icon-192.png       Android home screen, manifest
//   public/icon-512.png       PWA splash, manifest
//   public/icon-maskable-512.png  512, mark inset into the 80% safe zone
//   public/apple-touch-icon.png  180, iOS home screen

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(ROOT, "public", "mark-favicon.svg");
const OUT = path.join(ROOT, "public");

const ICO_SIZES = [16, 32, 48];
const PNG_TARGETS = [
  { size: 48, name: "icon-48.png" },
  { size: 96, name: "icon-96.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
];

// Render the SVG at a given square size. `density` is scaled so the vector is
// rasterised at the target resolution rather than upscaled from 96dpi.
async function render(size) {
  return sharp(SOURCE, { density: Math.max(72, Math.round((size / 96) * 72 * 4)) })
    .resize(size, size, { fit: "cover" })
    .flatten({ background: "#1F4A3C" })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
}

// ICO container holding PNG compressed frames. Supported by every browser
// still in use, and far smaller than the BMP encoding.
function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(frames.length, 4);

  const directory = Buffer.alloc(16 * frames.length);
  let offset = header.length + directory.length;

  frames.forEach((frame, i) => {
    const e = i * 16;
    directory.writeUInt8(frame.size >= 256 ? 0 : frame.size, e + 0);
    directory.writeUInt8(frame.size >= 256 ? 0 : frame.size, e + 1);
    directory.writeUInt8(0, e + 2); // palette size, 0 for truecolour
    directory.writeUInt8(0, e + 3); // reserved
    directory.writeUInt16LE(1, e + 4); // colour planes
    directory.writeUInt16LE(32, e + 6); // bits per pixel
    directory.writeUInt32LE(frame.data.length, e + 8);
    directory.writeUInt32LE(offset, e + 12);
    offset += frame.data.length;
  });

  return Buffer.concat([header, directory, ...frames.map((f) => f.data)]);
}

// Android crops maskable icons to an arbitrary shape and only guarantees the
// centre 80%. The full bleed mark reaches the plate edge, so its outer culms
// would be shaved off; inset it and let the plate fill the sacrificial margin.
async function renderMaskable(size) {
  const safe = Math.round(size * 0.6);
  const mark = await sharp(SOURCE, { density: Math.round((safe / 96) * 72 * 4) })
    .resize(safe, safe, { fit: "cover" })
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: "#1F4A3C",
    },
  })
    // The ink sits low in the 96 unit box (y 22 to 86), so centring the render
    // leaves the mark 6.25% below the optical centre. Lift it back.
    .composite([
      {
        input: mark,
        left: Math.round((size - safe) / 2),
        top: Math.round((size - safe) / 2 - safe * 0.0625),
      },
    ])
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
}

async function main() {
  const icoFrames = [];
  for (const size of ICO_SIZES) {
    icoFrames.push({ size, data: await render(size) });
  }
  const ico = buildIco(icoFrames);
  await writeFile(path.join(OUT, "favicon.ico"), ico);
  console.log(`public/favicon.ico  ${ICO_SIZES.join(", ")}  ${(ico.length / 1024).toFixed(1)} KB`);

  for (const target of PNG_TARGETS) {
    const buf = await render(target.size);
    await writeFile(path.join(OUT, target.name), buf);
    console.log(
      `public/${target.name}  ${target.size}x${target.size}  ${(buf.length / 1024).toFixed(1)} KB`,
    );
  }

  const maskable = await renderMaskable(512);
  await writeFile(path.join(OUT, "icon-maskable-512.png"), maskable);
  console.log(`public/icon-maskable-512.png  512x512  ${(maskable.length / 1024).toFixed(1)} KB`);
}

main();
