// Analyzes dominant color of every gallery + blog image,
// sorts by hue, and writes src/gallery-colors.json
// Run: node scripts/sort-gallery-colors.js

import sharp from "sharp";
import { readdir } from "fs/promises";
import { writeFile } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GALLERY_DIR = join(__dirname, "../public/gallery");
const BLOG_DIR = join(__dirname, "../public/blog");
const OUT = join(__dirname, "../src/gallery-colors.json");
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s, l };
}

async function getDominantColor(filePath) {
  // Sample a small version for speed
  const { channels } = await sharp(filePath)
    .resize(50, 50, { fit: "cover" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = await sharp(filePath)
    .resize(50, 50, { fit: "cover" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let rSum = 0, gSum = 0, bSum = 0;
  const pixels = info.width * info.height;
  for (let i = 0; i < data.length; i += 3) {
    rSum += data[i];
    gSum += data[i + 1];
    bSum += data[i + 2];
  }
  return rgbToHsl(rSum / pixels, gSum / pixels, bSum / pixels);
}

async function listImages(dir, prefix) {
  try {
    const files = await readdir(dir);
    return files
      .filter(f => IMAGE_EXTS.includes(extname(f).toLowerCase()))
      .map(f => ({ src: `${prefix}/${f}`, path: join(dir, f) }));
  } catch {
    return [];
  }
}

async function run() {
  const gallery = await listImages(GALLERY_DIR, "/gallery");
  const blog = await listImages(BLOG_DIR, "/blog");
  const all = [...gallery, ...blog];

  console.log(`Analyzing ${all.length} images...`);

  const colors = {};
  for (const img of all) {
    try {
      const hsl = await getDominantColor(img.path);
      colors[img.src] = hsl;
      process.stdout.write(".");
    } catch {
      colors[img.src] = { h: 0, s: 0, l: 0.5 };
      process.stdout.write("x");
    }
  }

  await writeFile(OUT, JSON.stringify(colors, null, 2));
  console.log(`\nWrote ${OUT}`);
}

run().catch(e => { console.error(e); process.exit(1); });
