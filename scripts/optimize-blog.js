import sharp from "sharp";
import { readdir, stat, unlink, rename } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, "../public/blog");
const MAX_WIDTH = 2400;
const JPEG_QUALITY = 80;

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"];

async function optimize() {
  const files = await readdir(BLOG_DIR);
  const images = files.filter((f) => IMAGE_EXTS.includes(extname(f).toLowerCase()));

  console.log(`Optimizing ${images.length} blog images (max ${MAX_WIDTH}px, q${JPEG_QUALITY})...\n`);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of images) {
    const path = join(BLOG_DIR, file);
    const baseName = file.replace(/\.[^.]+$/, "");
    const outFile = baseName + ".jpg";
    const outPath = join(BLOG_DIR, outFile);
    const tmpPath = path + ".opt";

    const before = (await stat(path)).size;
    totalBefore += before;

    await sharp(path)
      .resize(MAX_WIDTH, MAX_WIDTH, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(tmpPath);

    const after = (await stat(tmpPath)).size;
    totalAfter += after;

    await unlink(path);
    await rename(tmpPath, outPath);

    const saved = ((1 - after / before) * 100).toFixed(1);
    console.log(`  ${file}: ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024).toFixed(0)}KB (${saved}% smaller)`);
  }

  console.log(`\nDone. ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
}

optimize().catch((e) => {
  console.error(e);
  process.exit(1);
});
