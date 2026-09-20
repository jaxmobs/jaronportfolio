# jaronportfolio

Portfolio site for Jaron Mobley — freelance videographer. React + Vite, deployed on Vercel.

## Voice

**The site is about the process and the people in it, not about Alaska.**

Plenty of people trade on the Alaska name without the work to back it up. This
site should not. Lead with the craft — how a piece got made, who was there, what
the day was actually like. Alaska is where it happens, and that's genuinely
cool, but it is the setting, not the credential.

In practice:

- Write about shooting, editing, decisions, collaborators, clients.
- Let location be incidental and concrete ("Knik Glacier", "Hatcher Pass")
  rather than an identity claim ("the last frontier", "the edge of the map",
  "wild corners of Alaska").
- Factual location is fine — the footer, the meta title, client names. It is
  positioning-by-geography that is out.
- Avoid stacking the same metaphor across headings. Section headings should
  describe what the section holds.

## Content

Posts live in `src/blog.js`, newest first — the first entry is treated as the
latest and renders on the home page. Projects are in `src/data.js`.

Post shape: `id`, `title`, `subtitle` (camera body), `date`, `location`,
`heroImage`, `body` (blank line between paragraphs), `images`, `tags`.

Blog images are also pulled into the gallery automatically (`App.jsx`), so they
are never added in two places.

## Adding photos

1. Drop originals into `public/blog/` (or `public/gallery/`).
2. `npm run optimize-blog` — 2400px max, JPEG q80, mozjpeg.
   `npm run optimize-gallery` is 1600px @ q82. Run the one matching the folder.
   **Both are destructive and in place**: they delete the original and process
   the whole directory, so already-optimised images get re-encoded a second
   time. To add to a folder that already has processed images, run sharp over
   just the new files with the same settings.
3. `npm run sort-gallery` — regenerates `src/gallery-colors.json`, which drives
   the gallery's hue ordering. Skip it and new photos default to hue 0 and
   clump at the front.
4. Add the post to `src/blog.js`.
5. `npm run build` — this also runs `scripts/prerender-blog.js`, which emits
   static HTML per post so shared links get real previews.

Filenames encode capture order; the `images` array controls display order. The
two can differ deliberately.

## Theme

Design tokens in `src/theme.js`. Warm paper and ink, **no accent colour** —
emphasis comes from italics, scale and whitespace.

EB Garamond throughout, self-hosted from `public/fonts/` via `src/fonts.css.js`
so the typeface is never a third-party render-blocker. Regenerating it means
re-fetching the latin subset from Google Fonts.

Two rules the layout depends on:

- **Nothing is set on top of a photograph.** Captions go beneath the frame,
  titles onto paper. Footage grades vary too much to guarantee contrast, and
  every attempt to overlay type here has produced an illegible heading.
- Sections are separated by space, not rules or background blocks.

`pre-lovefrom-theme` holds the previous dark navy + gold look, if it is ever
needed back.

## Deploys

`vercel.json` is schema-validated by Vercel **before** the build runs, so a
passing `npm run build` locally proves nothing about it. Unknown keys are
rejected outright — a `"comment"` field in a headers entry has already taken
production down once. There is no way to annotate that file; explain the rules
here instead.

The cache headers, and why they differ:

- `/fonts/*` is `immutable`. The files are content-stable, and a different cut
  of the typeface would land under a different name.
- `/gallery/*` and `/blog/*` are deliberately **not** `immutable`, only
  long-lived and revalidatable. `optimize-blog` rewrites images in place under
  the same filename, so `immutable` would strand a replaced photo in visitors'
  browsers for a year.

## Environment notes

Screenshots via Playwright against `npx vite preview` work, with two caveats:
headless Chromium here has no H.264 codec so the hero video never renders (the
poster shows instead), and `img.youtube.com` project thumbnails are blocked by
the proxy. Neither is a site bug. Full-page captures also need a scripted
scroll first, or every `useInView` section stays at `opacity: 0`.
