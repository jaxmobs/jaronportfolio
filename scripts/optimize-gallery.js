import sharp from "sharp";
import { readdir, stat, rename, unlink } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GALLERY_DIR = join(__dirname, "../public/gallery");
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 82;

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

async function optimize() {
  const files = await readdir(GALLERY_DIR);
  const images = files.filter((f) => IMAGE_EXTS.includes(extname(f).toLowerCase()));

  console.log(`Optimizing ${images.length} images (max ${MAX_WIDTH}px, JPEG q${JPEG_QUALITY})...\n`);
  let totalBefore = 0;
  let totalAfter = 0;
  const optimized = [];

  for (const file of images) {
    const path = join(GALLERY_DIR, file);
    const ext = extname(file).toLowerCase();
    let before, after;

    try {
      const s = await stat(path);
      before = s.size;
      totalBefore += before;
    } catch {
      continue;
    }

    const tmpPath = path + ".opt";

    const baseName = file.replace(/\.[^.]+$/, "");
    const outFile = baseName + ".jpg";
    const outPath = join(GALLERY_DIR, outFile);
    const writePath = path === outPath ? path + ".opt" : outPath;

    await sharp(path)
      .resize(MAX_WIDTH, MAX_WIDTH, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(writePath);

    const t = await stat(writePath);
    after = t.size;
    totalAfter += after;

    if (path === outPath) {
      await unlink(path);
      await rename(writePath, outPath);
    } else {
      await unlink(path);
    }

    const saved = ((1 - after / before) * 100).toFixed(1);
    console.log(`  ${file} → ${outFile}: ${(before / 1024).toFixed(1)}KB → ${(after / 1024).toFixed(1)}KB (${saved}% smaller)`);
    optimized.push(outFile);
  }

  console.log(`\nDone. Total: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB`);
  return optimized;
}

optimize().catch((e) => {
  console.error(e);
  process.exit(1);
});
