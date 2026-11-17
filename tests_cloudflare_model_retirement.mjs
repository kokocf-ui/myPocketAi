import assert from "node:assert/strict";
import fs from "node:fs";

// Cloudflare Workers AI retirement notice (2026-11-20).
// A model in this set must never be referenced by a production Workers AI caller.
// Source: https://developers.cloudflare.com/changelog/post/2026-11-05-planned-model-deprecations/
const retiredModels = new Set([
  "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
  "@cf/nvidia/nemotron-3-120b-a12b",
  "@cf/deepseek-ai/deepseek-v4-pro-0813",
  "@cf/deepseek-ai/deepseek-v4-flash-0731",
  "@cf/qwen/qwq-32b",
  "@cf/qwen/qwen3-30b-a3b-fp8",
  "@cf/moonshotai/kimi-k2.6",
  "@cf/moonshotai/kimi-k2.7-code",
  "@cf/zai-org/glm-5.2",
  "@cf/zai-org/glm-5.3-flash",
  "@cf/meta-llama/llama-2-7b-chat-hf-lora",
  "@cf/google/gemma-2b-it-lora",
  "@cf/google/gemma-7b-it-lora",
  "@cf/meta/llama-3.1-8b-instruct-fp8",
  "@cf/meta/llama-3.2-1b-instruct",
  "@cf/meta/llama-3.2-3b-instruct",
  "@cf/myshell-ai/melotts",
  "@cf/stabilityai/stable-diffusion-xl-base-1.0",
  "@cf/runwayml/stable-diffusion-v1-5-inpainting",
  "@cf/bytedance/stable-diffusion-xl-lightning",
  "@cf/lykon/dreamshaper-8-lcm",
  "@cf/openai/whisper-tiny-en",
  "@cf/llava-hf/llava-1.5-7b-hf",
  "@cf/google/embeddinggemma-300m"
]);

const productionModules=[
  "backend.js",
  "news_article_detail.mjs",
  "localization.mjs",
  "math_photo_vision.mjs",
  "studio_worker.mjs",
  "creator_preview_worker.mjs"
];
const idsIn = source => Array.from(source.matchAll(/@cf\/[\w./-]+/g), x => x[0]);
assert(retiredModels.has("@cf/meta/llama-3.1-8b-instruct-fp8"),
  "retirement scanner must detect historical 8B FP8 model");
for (const path of productionModules) {
  const content=fs.readFileSync(path,"utf8");
  const invalid=[...new Set(idsIn(content).filter(id=>retiredModels.has(id)))];
  assert.deepEqual(invalid,[],path+" still calls Cloudflare-retired model(s)");
}
const backend=fs.readFileSync("backend.js","utf8");
const selection=backend.match(/const allowedTextModels=(\[[^\n]+\]);/);
assert(selection,"Worker model allowlist must exist");
assert.deepEqual(JSON.parse(selection[1]),[
  "@cf/meta/llama-3.1-8b-instruct-fast",
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast"
]);
assert.match(backend,/const selectedAiModel=allowedTextModels\.includes\(/,
  "disallow arbitrary Cloudflare model overrides");
assert.match(backend,/const fallbackModel=selectedAiModel===allowedTextModels\[0\]\?allowedTextModels\[1\]:allowedTextModels\[0\]/,
  "primary outage must fall back to the other active model");
assert.match(backend,/for\(const model of \[\.\.\.new Set\(\[selectedAiModel,allowedTextModels\[1\]\]\)\]\)/,
  "encyclopedia translation fallback must use an active model");
assert.match(backend,/const correction = await env\.AI\.run\(\s*selectedAiModel,/,
  "sentence correction must not use a retired model");
assert.match(backend,/const review = await env\.AI\.run\(\s*selectedAiModel,/,
  "quality review must not use a retired model");
console.log("PASS Cloudflare retirement: production AI references and fallbacks use active allowlist");
