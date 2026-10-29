import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jobs = {
  // Largest live portrait is 190px wide (marketing-polish.css); six panels at 2x.
  // Preserve the 3:1 sheet ratio so percentage background positions stay exact.
  explorers: { source: "public/explorers.png", output: "public/explorers.webp", width: 2280, height: 760, quality: 80, alphaQuality: 70, limit: 400 },
  // Fit inside the requested 840x960 ceiling without stretching the square art.
  compass: { source: "public/brand/compass-v2-transparent-1024.png", output: "public/brand/compass-v2-transparent-840.webp", width: 840, height: 960, quality: 80, limit: 200 },
};
const requested = process.argv.slice(2);
const selected = requested.length ? requested : Object.keys(jobs);
for (const name of selected) {
  const job = jobs[name];
  if (!job) throw new Error(`Unknown image: ${name}. Choose ${Object.keys(jobs).join(", ")}.`);
  if (job.source === job.output || !job.output.endsWith(".webp")) throw new Error("Only separate WebP outputs are allowed.");
  const source = await readFile(path.join(root, job.source));
  const output = await sharp(source).resize(job.width, job.height, { fit: "inside" }).webp({ quality: job.quality, alphaQuality: job.alphaQuality ?? 100, effort: 4 }).toBuffer();
  if (output.length >= job.limit * 1024) throw new Error(`${name} exceeds its ${job.limit} KiB target.`);
  await writeFile(path.join(root, job.output), output);
  const { width, height } = await sharp(output).metadata();
  console.log(`${job.output}: ${(source.length / 1024).toFixed(1)} -> ${(output.length / 1024).toFixed(1)} KiB, ${width}x${height}`);
}
