// Generates a static HTML file per blog post (dist/blog/<id>.html) with
// post-specific title/description/Open Graph/Twitter meta tags baked in.
//
// Why: this site is a client-rendered SPA — one index.html for every route.
// Link-preview crawlers (iMessage, Twitter/X, Slack, etc.) fetch a URL and
// read whatever meta tags are in the raw HTML; they don't run our JS. So a
// shared /blog/:id link would otherwise always show the generic homepage
// preview. Instead we copy the built index.html (same JS/CSS bundle refs)
// once per post and swap in that post's meta, so a visitor still gets the
// full interactive app, but the *first* HTML byte a crawler sees already has
// the right title/image/description.
//
// vercel.json rewrites /blog/:id -> /blog/:id.html to serve these.
// Run automatically as part of `npm run build`.

import sharp from "sharp";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { POSTS } from "../src/blog.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, "../dist");
const PUBLIC_DIR = join(__dirname, "../public");
const SITE_URL = "https://jaronmobley.com";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getDescription(post) {
  const body = (post.body || "").trim().replace(/\s+/g, " ");
  if (body) {
    return body.length > 200 ? body.slice(0, 197).trimEnd() + "…" : body;
  }
  return `${post.title} — field notes and photos from ${post.location}.`;
}

function setMetaContent(html, matchAttr, matchValue, content) {
  const re = new RegExp(`(<meta ${matchAttr}="${matchValue}" content=")[^"]*("\\s*/?>)`);
  if (!re.test(html)) {
    console.warn(`  ! meta ${matchAttr}="${matchValue}" not found in template — skipped`);
    return html;
  }
  return html.replace(re, `$1${escapeHtml(content)}$2`);
}

async function getImageDimensions(heroImage) {
  try {
    const meta = await sharp(join(PUBLIC_DIR, heroImage)).metadata();
    return { width: meta.width, height: meta.height };
  } catch {
    return { width: 1200, height: 630 }; // template default, kept as a fallback
  }
}

function renderPostHtml(template, post, { width, height }) {
  const title = `${post.title} — Jaron Mobley`;
  const description = getDescription(post);
  const image = `${SITE_URL}${post.heroImage}`;
  const url = `${SITE_URL}/blog/${post.id}`;

  let html = template;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${escapeHtml(url)}$2`);

  html = setMetaContent(html, "name", "description", description);
  html = setMetaContent(html, "property", "og:type", "article");
  html = setMetaContent(html, "property", "og:url", url);
  html = setMetaContent(html, "property", "og:title", title);
  html = setMetaContent(html, "property", "og:description", description);
  html = setMetaContent(html, "property", "og:image", image);
  html = setMetaContent(html, "property", "og:image:width", String(width));
  html = setMetaContent(html, "property", "og:image:height", String(height));
  html = setMetaContent(html, "name", "twitter:title", title);
  html = setMetaContent(html, "name", "twitter:description", description);
  html = setMetaContent(html, "name", "twitter:image", image);

  return html;
}

async function run() {
  const templatePath = join(DIST_DIR, "index.html");
  const template = await readFile(templatePath, "utf-8");

  const blogDir = join(DIST_DIR, "blog");
  await mkdir(blogDir, { recursive: true });

  console.log(`Pre-rendering ${POSTS.length} blog post page(s)...`);
  for (const post of POSTS) {
    const dims = await getImageDimensions(post.heroImage);
    const html = renderPostHtml(template, post, dims);
    const outPath = join(blogDir, `${post.id}.html`);
    await writeFile(outPath, html);
    console.log(`  /blog/${post.id} -> dist/blog/${post.id}.html (image ${dims.width}x${dims.height})`);
  }
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
