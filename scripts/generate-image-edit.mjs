#!/usr/bin/env node
// OpenAI Images image-to-image CLI. Feed it one or more pictures plus a prompt,
// get the edited file back. This is the sibling of generate-image.mjs and hits
// api.openai.com directly: no third-party proxy, no polling, no npm dependency.
//
// Usage:
//   npm run edit -- public/Images/hero.png "make the sky a warm sunset"
//   node scripts/edit-image.mjs in.png "remove the logo" --out=public/Images/out.png
//   node scripts/edit-image.mjs base.png overlay.png "blend these two" --quality=high
//
// The first non-flag word that resolves to a readable image file is treated as
// an input image, and you can pass several. Everything else is the edit prompt.
// Use --image=path when a prompt word collides with a filename.
//
// Flags take either style: --out=path or --out path.
//   --out           output file (default: edited-<timestamp>.<format>)
//   --image         extra input image, repeatable
//   --prompt-file   read the edit prompt from a file
//   --aspect-ratio  1:1 3:2 2:3 3:4 4:3 4:5 5:4 9:16 16:9 21:9
//                   (omit to let OpenAI keep the input shape)
//   --size          1024x1024 | 1536x1024 | 1024x1536 | 2048x2048 | auto
//   --quality       low | medium | high | auto (default: high)
//   --fidelity      low | high. high preserves faces and fine detail better.
//   --format        png | jpeg | webp (default: png)
//   --model         default gpt-image-2 (env OPENAI_IMAGE_MODEL)
//
// Requires OPENAI_API_KEY in .env / .env.local, or in the environment.
// Editorial tool only: never call this from client code or a public route.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const API_URL = "https://api.openai.com/v1/images/edits";
const DEFAULT_MODEL = "gpt-image-2";

const MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(process.cwd(), file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      const value = m[2].replace(/^["'](.*)["']$/, "$1");
      if (process.env[m[1]] === undefined) process.env[m[1]] = value;
    }
  }
}

const FLAGS = new Set([
  "out",
  "image",
  "prompt-file",
  "size",
  "aspect-ratio",
  "aspect",
  "quality",
  "resolution",
  "fidelity",
  "format",
  "model",
]);

function parseArgs(argv) {
  const opts = { quality: "high", format: "png", aspectRatio: null, resolution: "1k" };
  const words = [];
  const images = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") continue;

    if (!a.startsWith("--")) {
      // A bare arg pointing at a readable image is an input, not a prompt word.
      if (fs.existsSync(a) && MIME_BY_EXT[path.extname(a).toLowerCase()]) images.push(a);
      else words.push(a);
      continue;
    }

    const eq = a.indexOf("=");
    const name = (eq === -1 ? a.slice(2) : a.slice(2, eq)).toLowerCase();
    if (!FLAGS.has(name)) {
      console.error(`Unknown flag: ${a}`);
      process.exit(2);
    }
    const value = eq === -1 ? argv[++i] : a.slice(eq + 1);
    if (value === undefined) {
      console.error(`Flag --${name} needs a value.`);
      process.exit(2);
    }
    if (name === "image") images.push(value);
    else if (name === "prompt-file") opts.promptFile = value;
    else if (name === "aspect-ratio" || name === "aspect") opts.aspectRatio = value;
    else if (name === "resolution") opts.resolution = value.toLowerCase();
    else opts[name] = value;
  }

  opts.images = images;
  opts.prompt = words.join(" ").trim();
  return opts;
}

function chooseSize({ size, aspectRatio, resolution }) {
  if (size) return size;
  if (!aspectRatio) return "auto"; // keep the input image's shape
  const ratio = aspectRatio.trim().toLowerCase();
  const portrait = ["2:3", "3:4", "4:5", "9:16", "portrait"];
  const landscape = ["3:2", "4:3", "5:4", "16:9", "21:9", "landscape"];
  if (portrait.includes(ratio)) return "1024x1536";
  if (landscape.includes(ratio)) return "1536x1024";
  if (ratio === "1:1" || ratio === "square") {
    return resolution === "2k" || resolution === "4k" ? "2048x2048" : "1024x1024";
  }
  return "auto";
}

async function main() {
  loadEnv();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set. Add it to .env or .env.local.");
    process.exit(1);
  }

  const opts = parseArgs(process.argv.slice(2));

  if (opts.promptFile) {
    if (!fs.existsSync(opts.promptFile)) {
      console.error(`Prompt file not found: ${opts.promptFile}`);
      process.exit(1);
    }
    opts.prompt = fs.readFileSync(opts.promptFile, "utf8").trim();
  }

  if (opts.images.length === 0) {
    console.error(
      "No input image. Pass a path to an existing image, for example:\n" +
        '  npm run edit -- public/Images/hero.png "make the sky a warm sunset"',
    );
    process.exit(1);
  }
  if (!opts.prompt) {
    console.error(
      'Usage: npm run edit -- <image> [more-images] "<edit prompt>"' +
        " [--quality=low|medium|high] [--fidelity=high] [--out=path.png]",
    );
    process.exit(1);
  }

  for (const img of opts.images) {
    if (!fs.existsSync(img)) {
      console.error(`Input image not found: ${img}`);
      process.exit(1);
    }
  }

  const model = opts.model ?? process.env.OPENAI_IMAGE_MODEL ?? DEFAULT_MODEL;
  const size = chooseSize(opts);
  const format = opts.format.toLowerCase();
  const outPath = opts.out || `edited-${Date.now()}.${format}`;

  console.log(`Prompt: "${opts.prompt}"`);
  console.log(`Input:  ${opts.images.join(", ")}`);
  console.log(`Model:  ${model} (OpenAI)  ${size}, quality ${opts.quality}`);
  process.stdout.write("Editing...");

  const form = new FormData();
  form.append("model", model);
  form.append("prompt", opts.prompt);
  form.append("quality", opts.quality);
  form.append("output_format", format === "jpg" ? "jpeg" : format);
  form.append("n", "1");
  if (size !== "auto") form.append("size", size);
  if (opts.fidelity) form.append("input_fidelity", opts.fidelity);

  for (const img of opts.images) {
    const ext = path.extname(img).toLowerCase();
    const type = MIME_BY_EXT[ext] ?? "image/png";
    const blob = new Blob([fs.readFileSync(img)], { type });
    // gpt-image models take an array of inputs under image[].
    form.append("image[]", blob, path.basename(img));
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    console.error(`\nEdit failed: ${body.error?.message ?? `HTTP ${res.status}`}`);
    process.exit(1);
  }

  const first = body.data?.[0];
  if (!first?.b64_json) {
    console.error("\nOpenAI returned no image (b64_json missing).");
    process.exit(1);
  }

  const buffer = Buffer.from(first.b64_json, "base64");
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log(`\nSaved: ${outPath}  (${(buffer.length / 1024).toFixed(0)} KB)`);

  if (body.usage) {
    console.log(
      `Tokens: ${body.usage.input_tokens ?? 0} in / ${body.usage.output_tokens ?? 0} out`,
    );
  }
}

main().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
