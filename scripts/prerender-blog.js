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
  return `${post.title} — notes and photographs from ${post.location}.`;
}

// "September 2026" -> "2026-09-01". Posts only carry month precision, so the
// first of the month is the honest answer; an unparseable value is left out
// rather than guessed at.
function isoDate(label) {
  const d = new Date(`1 ${label}`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

// Google ignores a stale sitemap far less gracefully than a missing one, and a
// hand-maintained file drifts the moment a post is added — so it is emitted
// from POSTS on every build.
async function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [
    { loc: `${SITE_URL}/`, changefreq: "monthly", priority: "1.0", lastmod: today },
    { loc: `${SITE_URL}/gallery`, changefreq: "monthly", priority: "0.7", lastmod: today },
    { loc: `${SITE_URL}/blog`, changefreq: "weekly", priority: "0.8", lastmod: today },
    ...POSTS.map((p) => ({
      loc: `${SITE_URL}/blog/${p.id}`,
      changefreq: "yearly",
      priority: "0.6",
      lastmod: isoDate(p.date) || today,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
  await writeFile(join(DIST_DIR, "sitemap.xml"), xml);
  console.log(`\nWrote dist/sitemap.xml (${entries.length} URLs)`);
}

// Article structured data, so a post can surface as its own result rather than
// inheriting the homepage's Person/LocalBusiness markup.
function blogPostingLd(post, image) {
  const published = isoDate(post.date);
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: getDescription(post),
    image,
    ...(published ? { datePublished: published } : {}),
    author: { "@type": "Person", name: "Jaron Mobley", url: SITE_URL },
    publisher: { "@type": "Person", name: "Jaron Mobley", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.id}` },
    ...(post.location ? { contentLocation: { "@type": "Place", name: post.location } } : {}),
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
  }, null, 2);
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

  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">\n${blogPostingLd(post, image)}\n    </script>\n  </head>`
  );

  return html;
}

// /gallery and /blog are client-side routes. Without their own HTML they fall
// through the catch-all rewrite to index.html, which carries the homepage's
// canonical — so each one told crawlers "I am really the homepage" while the
// sitemap asked for them to be indexed. Give them real documents instead.
const STATIC_ROUTES = [
  {
    path: "gallery",
    title: "Gallery — Jaron Mobley",
    description:
      "Photographs from shoots and the trips around them: bush planes, boats, bikes and the people met along the way.",
    ld: {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: "Gallery — Jaron Mobley",
      url: `${SITE_URL}/gallery`,
      author: { "@type": "Person", name: "Jaron Mobley", url: SITE_URL },
    },
  },
  {
    path: "blog",
    title: "Field Notes — Jaron Mobley",
    description:
      "Write-ups from between shoots — what the day was like, who was there and what came back on the card.",
    ld: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Field Notes",
      url: `${SITE_URL}/blog`,
      author: { "@type": "Person", name: "Jaron Mobley", url: SITE_URL },
      blogPost: POSTS.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: `${SITE_URL}/blog/${p.id}`,
        ...(isoDate(p.date) ? { datePublished: isoDate(p.date) } : {}),
      })),
    },
  },
];

function renderRouteHtml(template, route) {
  const url = `${SITE_URL}/${route.path}`;
  let html = template;
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(route.title)}</title>`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${escapeHtml(url)}$2`);
  html = setMetaContent(html, "name", "description", route.description);
  html = setMetaContent(html, "property", "og:url", url);
  html = setMetaContent(html, "property", "og:title", route.title);
  html = setMetaContent(html, "property", "og:description", route.description);
  html = setMetaContent(html, "name", "twitter:title", route.title);
  html = setMetaContent(html, "name", "twitter:description", route.description);
  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">\n${JSON.stringify(route.ld, null, 2)}\n    </script>\n  </head>`
  );
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

  console.log(`\nPre-rendering ${STATIC_ROUTES.length} static route(s)...`);
  for (const route of STATIC_ROUTES) {
    await writeFile(join(DIST_DIR, `${route.path}.html`), renderRouteHtml(template, route));
    console.log(`  /${route.path} -> dist/${route.path}.html`);
  }

  await writeSitemap();
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
