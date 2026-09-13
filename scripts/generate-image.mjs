#!/usr/bin/env node
// OpenAI Images text-to-image CLI. One synchronous call: prompt in, PNG out.
//
// This is the project copy of the portable `generate-image-openai` skill
// (~/.claude/skills/generate-image-openai). It talks to api.openai.com
// directly. No third-party proxy, no polling, no npm dependency.
//
// Usage:
//   npm run gen -- "a futuristic city skyline at sunset"
//   node scripts/generate-image.mjs "a red fox in snow" --quality=high
//   node scripts/generate-image.mjs "hero banner" --aspect-ratio=16:9 --out=public/Images/hero.png
//
// Flags take either style: --out=path or --out path.
//   --out           output file (default: generated-<timestamp>.<format>)
//   --aspect-ratio  1:1 3:2 2:3 3:4 4:3 4:5 5:4 9:16 16:9 21:9 (default 1:1)
//   --size          1024x1024 | 1536x1024 | 1024x1536 | 2048x2048 | auto
//                   (overrides --aspect-ratio and --resolution)
//   --quality       low | medium | high | auto (default: high)
//   --resolution    1k | 2k | 4k. OpenAI has no free resolution dial, so this
//                   only picks the largest size the chosen aspect supports.
//   --format        png | jpeg | webp (default: png)
//   --model         default gpt-image-2 (env OPENAI_IMAGE_MODEL); also
//                   gpt-image-1.5, gpt-image-1, gpt-image-1-mini
//
// Output:
//   The default filename lands in the repo root and matches the git-ignored
//   scratch pattern. Pass --out= to keep a file; writing into public/Images/
//   means the pre-commit optimizer picks it up.
//
// Requires OPENAI_API_KEY in .env / .env.local, or in the environment.
// Editorial tool only: never call this from client code or a public route.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const API_URL = "https://api.openai.com/v1/images/generations";
const DEFAULT_MODEL = "gpt-image-2";

// USD per million tokens. Override with OPENAI_PRICE_TEXT_INPUT,
// OPENAI_PRICE_IMAGE_INPUT, OPENAI_PRICE_IMAGE_OUTPUT.
const RATES = {
  "gpt-image-2": { textInput: 5, imageInput: 8, imageOutput: 30 },
  "gpt-image-1.5": { textInput: 5, imageInput: 8, imageOutput: 32 },
  "gpt-image-1": { textInput: 5, imageInput: 10, imageOutput: 40 },
  "gpt-image-1-mini": { textInput: 2, imageInput: 2.5, imageOutput: 8 },
};

// Minimal .env reader so the script stays dependency-free and portable.
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
  "size",
  "aspect-ratio",
  "aspect",
  "quality",
  "resolution",
  "format",
  "model",
]);

function parseArgs(argv) {
  const opts = { quality: "high", resolution: "1k", aspectRatio: "1:1", format: "png" };
  const words = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") continue;
    if (!a.startsWith("--")) {
      words.push(a);
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
    if (name === "aspect-ratio" || name === "aspect") opts.aspectRatio = value;
    else if (name === "resolution") opts.resolution = value.toLowerCase();
    else opts[name] = value;
  }

  opts.prompt = words.join(" ").trim();
  return opts;
}

// OpenAI exposes a fixed set of sizes rather than a resolution dial, so the
// aspect ratio picks the shape and --resolution only decides whether a square
// goes to the 2048 tier.
function chooseSize({ size, aspectRatio, resolution }) {
  if (size) return size;
  const ratio = (aspectRatio ?? "").trim().toLowerCase();
  const portrait = ["2:3", "3:4", "4:5", "9:16", "portrait"];
  const landscape = ["3:2", "4:3", "5:4", "16:9", "21:9", "landscape"];
  if (portrait.includes(ratio)) return "1024x1536";
  if (landscape.includes(ratio)) return "1536x1024";
  if (ratio === "1:1" || ratio === "square" || ratio === "") {
    return resolution === "2k" || resolution === "4k" ? "2048x2048" : "1024x1024";
  }
  return "auto";
}

// PNG dimensions live in the IHDR chunk at bytes 16..24.
function pngDimensions(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function estimateCost(model, usage) {
  const rate = RATES[model] ?? RATES[DEFAULT_MODEL];
  const override = (name, fallback) => {
    const raw = process.env[name];
    const v = Number(raw);
    return raw !== undefined && raw !== "" && Number.isFinite(v) ? v : fallback;
  };
  const textInput = override("OPENAI_PRICE_TEXT_INPUT", rate.textInput);
  const imageInput = override("OPENAI_PRICE_IMAGE_INPUT", rate.imageInput);
  const imageOutput = override("OPENAI_PRICE_IMAGE_OUTPUT", rate.imageOutput);

  const outTok = usage?.output_tokens ?? 0;
  const textTok = usage?.input_tokens_details?.text_tokens ?? usage?.input_tokens ?? 0;
  const imgInTok = usage?.input_tokens_details?.image_tokens ?? 0;

  return (textTok * textInput + imgInTok * imageInput + outTok * imageOutput) / 1_000_000;
}

async function main() {
  loadEnv();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set. Add it to .env or .env.local.");
    process.exit(1);
  }

  const opts = parseArgs(process.argv.slice(2));
  if (!opts.prompt) {
    console.error(
      'Usage: npm run gen -- "<prompt>"  [--quality=low|medium|high]' +
        " [--aspect-ratio=16:9] [--size=1536x1024] [--format=png] [--out=path.png]",
    );
    process.exit(1);
  }

  const model = opts.model ?? process.env.OPENAI_IMAGE_MODEL ?? DEFAULT_MODEL;
  const size = chooseSize(opts);
  const format = opts.format.toLowerCase();
  const outPath = opts.out || `generated-${Date.now()}.${format}`;

  console.log(`Prompt: "${opts.prompt}"`);
  console.log(`Model:  ${model} (OpenAI)  ${size}, quality ${opts.quality}`);
  process.stdout.write("Generating...");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: opts.prompt,
      size,
      quality: opts.quality,
      output_format: format === "jpg" ? "jpeg" : format,
      n: 1,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    console.error(`\nGeneration failed: ${body.error?.message ?? `HTTP ${res.status}`}`);
    process.exit(1);
  }

  const first = body.data?.[0];
  if (!first?.b64_json) {
    console.error("\nOpenAI returned no image (b64_json missing).");
    process.exit(1);
  }
  if (first.revised_prompt) console.log(`\nModel revised the prompt: ${first.revised_prompt}`);

  const buffer = Buffer.from(first.b64_json, "base64");
  const dir = path.dirname(path.resolve(outPath));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outPath, buffer);

  const dims = pngDimensions(buffer);
  const shape = dims ? `${dims.width}x${dims.height}, ` : "";
  console.log(`\nSaved: ${outPath}  (${shape}${(buffer.length / 1024).toFixed(0)} KB)`);

  if (body.usage) {
    const usd = estimateCost(model, body.usage);
    console.log(
      `Estimated cost: $${usd.toFixed(4)}  (${body.usage.input_tokens ?? 0} in / ${body.usage.output_tokens ?? 0} out tokens)`,
    );
  }
}

main().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
