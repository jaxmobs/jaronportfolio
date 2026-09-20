// ─────────────────────────────────────────────────────────────
//  THEME TOKENS
//  A LoveFrom-inspired palette: warm paper, ink, and no accent
//  colour at all — emphasis comes from italics, scale and space
//  rather than hue. Adjust here and it propagates site-wide.
// ─────────────────────────────────────────────────────────────

export const C = {
  paper: "#F4F1EB",      // page background, warm off-white
  paperAlt: "#EEEAE1",   // barely-there tonal band for alternating sections
  ink: "#1C1A17",        // primary text, soft near-black
  inkSoft: "#57514A",    // body copy
  muted: "#7A736B",      // secondary / meta
  faint: "#9A928A",      // captions, footnotes
  ghost: "#B5ADA3",      // footer, dimmest
  rule: "rgba(28,26,23,0.14)",   // hairlines
  ruleFaint: "rgba(28,26,23,0.07)",
  veil: "rgba(244,241,235,0.92)", // translucent paper (nav, overlays)
};

// One family throughout — EB Garamond is the closest freely available
// relative of the Garamond revival LoveFrom set their own text in.
export const F = {
  serif: "'EB Garamond', Garamond, Georgia, serif",
};

// Section rhythm. Generous by design: whitespace is what separates
// content here, since there are no borders or background blocks.
export const S = {
  sectionY: "clamp(96px, 14vw, 180px)",
  gutter: "clamp(24px, 6vw, 72px)",
  measure: "34em",   // comfortable reading column
};
