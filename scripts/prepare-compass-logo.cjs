const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

// Flood the exterior and the verified white opening inside the top ring.
async function main() {
  const source = process.argv[2];
  if (!source) throw new Error("Pass the original compass PNG path.");
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const count = width * height, visited = new Uint8Array(count), queue = new Uint32Array(count);
  let head = 0, tail = 0, fringePixels = 0;
  function visit(index) {
    if (visited[index]) return;
    const offset = index * 4;
    if (Math.min(data[offset], data[offset + 1], data[offset + 2]) < 235) return;
    visited[index] = 1;
    queue[tail++] = index;
  }
  for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1); }
  // Verified against this supplied artwork: inside the loop, above the gold cap.
  const ringSeed = Math.floor(height * 0.08) * width + Math.floor(width * 0.52);
  if (Math.min(data[ringSeed * 4], data[ringSeed * 4 + 1], data[ringSeed * 4 + 2]) < 235) throw new Error("Top-ring background seed is not near-white; inspect the source.");
  visit(ringSeed);
  while (head < tail) {
    const index = queue[head++], x = index % width;
    if (x) visit(index - 1);
    if (x < width - 1) visit(index + 1);
    if (index >= width) visit(index - width);
    if (index < count - width) visit(index + width);
  }
  // Unmatte just the adjacent neutral antialias fringe of the black outline.
  // This is a one-pixel soft edge, not another flood into the illustration.
  for (let index = 0; index < count; index++) {
    if (visited[index]) continue;
    const x = index % width, offset = index * 4;
    const channels = [data[offset], data[offset + 1], data[offset + 2]];
    const minimum = Math.min(...channels), maximum = Math.max(...channels);
    const adjacent = (x && visited[index - 1]) || (x < width - 1 && visited[index + 1]) || (index >= width && visited[index - width]) || (index < count - width && visited[index + width]);
    if (adjacent && minimum >= 100 && maximum - minimum <= 15) {
      fringePixels++;
      data[offset + 3] = 255 - minimum;
      for (let channel = 0; channel < 3; channel++) data[offset + channel] = Math.max(0, data[offset + channel] - minimum);
    }
  }
  for (let index = 0; index < count; index++) {
    if (!visited[index]) continue;
    const offset = index * 4;
    const alpha = (255 - Math.min(data[offset], data[offset + 1], data[offset + 2])) / 20;
    data[offset + 3] = Math.round(255 * alpha);
    // Remove white matte from both exterior and ring edges to prevent a fringe.
    for (let channel = 0; channel < 3; channel++) data[offset + channel] = alpha ? Math.max(0, Math.round((data[offset + channel] - 255 * (1 - alpha)) / alpha)) : 0;
  }
  const brand = path.join(process.cwd(), "public/brand");
  await fs.mkdir(brand, { recursive: true });
  const master = await sharp(data, { raw: info }).png().toBuffer();
  await fs.writeFile(path.join(brand, "compass-v2-transparent-master.png"), master);
  for (const size of [32, 96, 180, 192, 512, 1024]) await sharp(master).resize(size, size).png().toFile(path.join(brand, `compass-v2-transparent-${size}.png`));
  for (const name of ["icon", "apple-icon"]) {
    const archive = path.join(brand, `legacy-${name}.png`);
    try { await fs.access(archive); } catch { await fs.copyFile(path.join("app", `${name}.png`), archive); }
  }
  await fs.copyFile(path.join(brand, "compass-v2-transparent-32.png"), "app/icon.png");
  await fs.copyFile(path.join(brand, "compass-v2-transparent-180.png"), "app/apple-icon.png");
  const evidence = path.join(process.cwd(), "docs/qa/logo-v2");
  await fs.mkdir(evidence, { recursive: true });
  for (const scale of [1, 2]) for (const [name, background] of [["light", "#f5ecd7"], ["dark", "#1b2a4a"]]) {
    const size = 420 * scale;
    await sharp(master).resize(size, size).flatten({ background }).png().toFile(path.join(evidence, `${name}-${scale}x.png`));
  }
  await fs.writeFile(path.join(evidence, "method.json"), JSON.stringify({ source, width, height, threshold: 235, backgroundPixels: tail, ringSeed, fringePixels, artworkPixelsUnchanged: count - tail - fringePixels, sizes: [32, 96, 180, 192, 512, 1024] }, null, 2));
  console.log(`Prepared compass: ${width}x${height}; ${tail} outer and inner background pixels; ${fringePixels} soft-edge pixels; ${count - tail - fringePixels} artwork pixels unchanged.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
