import { useState, useEffect, useRef } from "react";
import { PROJECTS, SKILLS, FILTERS, GALLERY } from "./data.js";
import FadeIn from "./components/FadeIn.jsx";
import ProjectCard from "./components/ProjectCard.jsx";
import GallerySection from "./components/GallerySection.jsx";
import BlogPage from "./components/BlogPage.jsx";
import LatestPost from "./components/LatestPost.jsx";
import { POSTS } from "./blog.js";
import GALLERY_COLORS from "./gallery-colors.json";
import { FONT_FACES } from "./fonts.css.js";

// Smooth-scroll to an in-page section. Used by the nav and the hero CTAs so
// every in-page link behaves the same (native hash jumps are unreliable here).
function scrollToHash(hash) {
  const el = document.getElementById(hash.slice(1));
  if (el) el.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", hash);
}

// ─── URL routing for /blog and /blog/:id ───────────────────────────────────
// Real per-post URLs so links are shareable and (via scripts/prerender-blog.js)
// crawl-able for iMessage/Twitter/Slack link previews.
const SITE_URL = "https://jaronmobley.com";

function readRouteFromPath() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/gallery") return { view: "gallery" };
  const match = path.match(/^\/blog\/([^/]+)$/);
  if (match) return { view: "blog", postId: match[1] };
  if (path === "/blog") return { view: "blog", postId: null };
  return { view: "home" };
}

const DEFAULT_META = {
  title: "Jaron Mobley — Videographer | Palmer, Alaska",
  description: "Outdoor media, mini-docs, and brand storytelling from the edge of the map. Based in Palmer, Alaska.",
  image: `${SITE_URL}/og-image.jpg`,
  url: `${SITE_URL}/`,
};

function setMeta(name, attr, content) {
  const el = document.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.setAttribute("content", content);
}

// Keeps the document head in sync during client-side navigation (browser tab
// title, and so the address bar's current URL matches whatever meta a native
// share sheet would pick up). The crawler-facing previews for shared /blog/:id
// links come from the pre-rendered static HTML, not this.
function applyMeta({ title, description, image, url }) {
  document.title = title;
  setMeta("description", "name", description);
  setMeta("og:title", "property", title);
  setMeta("og:description", "property", description);
  setMeta("og:image", "property", image);
  setMeta("og:url", "property", url);
  setMeta("twitter:title", "name", title);
  setMeta("twitter:description", "name", description);
  setMeta("twitter:image", "name", image);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", url);
}

function metaForPost(post) {
  const body = (post.body || "").trim().replace(/\s+/g, " ");
  const description = body
    ? (body.length > 200 ? body.slice(0, 197).trimEnd() + "…" : body)
    : `${post.title} — field notes and photos from ${post.location}.`;
  return {
    title: `${post.title} — Jaron Mobley`,
    description,
    image: `${SITE_URL}${post.heroImage}`,
    url: `${SITE_URL}/blog/${post.id}`,
  };
}

// ─── Global styles injected once ───────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    ${FONT_FACES}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #F4F1EB;
      font-family: 'EB Garamond', Garamond, Georgia, serif;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #F4F1EB; }
    ::-webkit-scrollbar-thumb { background: rgba(28,26,23,0.25); border-radius: 2px; }
    a { color: inherit; text-decoration: none; }
    /* Small caps stand in for the old mono labels — same signalling, no second family. */
    .label {
      font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase;
      color: #9A928A; font-variant-numeric: oldstyle-nums;
    }
    .rule { height: 1px; background: rgba(28,26,23,0.14); border: 0; }
    a:focus-visible, button:focus-visible { outline: 2px solid #1C1A17; outline-offset: 3px; border-radius: 2px; }
    [role="button"]:focus-visible { outline: 2px solid #1C1A17; outline-offset: 3px; }
    @keyframes scrollPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }
    }
    .nav-desktop { display: flex; gap: 32px; align-items: center; }
    .nav-mobile-toggle { display: none; flex-direction: column; justify-content: center; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
    .hero-image { display: none; position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
    @media (max-width: 720px) {
      .nav-desktop { display: none; }
      .nav-mobile-toggle { display: flex; }
    }
    @media (max-width: 768px) {
      .hero-video-wrap { display: none; }
      .hero-image { display: block; }
      .hero-coords { display: none; }
    }
  `}</style>
);

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav({ onNav, onFieldNotes }) {
  // Self-subscribe to a derived boolean so the nav only re-renders when the
  // background actually flips — not on every scroll frame.
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["Work", "Gallery", "About", "Contact"];

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Nav sits in the same serif as everything else, at reading size rather than
  // shrunk-and-letterspaced — it reads as part of the page, not a UI layer.
  const desktopLink = {
    fontSize: "17px", color: "#57514A", fontFamily: "inherit",
    transition: "color 0.25s",
  };
  const bar = { width: "22px", height: "1px", background: "#1C1A17", display: "block" };

  const goTo = (e, hash) => {
    if (e) e.preventDefault();
    const onSubpage = !!onNav;
    setMenuOpen(false);
    if (onSubpage) onNav(null);
    // Defer the scroll until after the menu overlay / sub-page has unmounted,
    // otherwise the re-render interrupts the smooth scroll.
    setTimeout(() => scrollToHash(hash), onSubpage ? 80 : 0);
  };
  const handleFieldNotes = () => { setMenuOpen(false); onFieldNotes && onFieldNotes(); };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "clamp(18px, 2.4vw, 30px) clamp(24px, 6vw, 72px)",
        display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "24px",
        background: "rgba(244,241,235,0.92)",
        backdropFilter: "saturate(180%) blur(12px)",
        WebkitBackdropFilter: "saturate(180%) blur(12px)",
        borderBottom: "none",
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}>
        <div style={{ fontSize: "21px", fontWeight: 400, letterSpacing: "0.01em", color: "#1C1A17", whiteSpace: "nowrap" }}>
          Jaron <em style={{ fontStyle: "italic" }}>Mobley</em>
        </div>

        {/* Desktop links */}
        <div className="nav-desktop">
          {links.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={(e) => goTo(e, `#${item.toLowerCase()}`)} style={desktopLink}
              onMouseEnter={e => e.target.style.color = "#1C1A17"}
              onMouseLeave={e => e.target.style.color = "#57514A"}
            >
              {item}
            </a>
          ))}
          <button onClick={handleFieldNotes} style={{ ...desktopLink, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={e => e.target.style.color = "#1C1A17"}
            onMouseLeave={e => e.target.style.color = "#57514A"}
          >
            Field Notes
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="nav-mobile-toggle" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <span style={bar} />
          <span style={bar} />
          <span style={bar} />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(244,241,235,0.97)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px",
          }}>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{
            position: "absolute", top: "22px", right: "24px",
            background: "none", border: "none", color: "#1C1A17",
            width: "38px", height: "38px", fontSize: "20px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          {links.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={(e) => goTo(e, `#${item.toLowerCase()}`)} style={{
              fontSize: "28px", color: "#1C1A17", fontFamily: "inherit",
            }}>
              {item}
            </a>
          ))}
          <button onClick={handleFieldNotes} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "28px", color: "#1C1A17", fontFamily: "inherit",
          }}>
            Field Notes
          </button>
        </div>
      )}
    </>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const fadeRef = useRef(null);   // outer wrapper — opacity fade on scroll
  const scaleRef = useRef(null);  // inner wrapper — parallax scale + drift

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  // Drive the parallax straight to the DOM via rAF instead of storing scroll
  // position in React state — avoids re-rendering the whole page on every frame.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const progress = Math.min(window.scrollY / (window.innerHeight || 600), 1);
      if (fadeRef.current) fadeRef.current.style.opacity = String(1 - progress * 0.7);
      if (scaleRef.current) {
        scaleRef.current.style.transform = `scale(${1.08 + progress * 0.15}) translateY(${window.scrollY * 0.125}px)`;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const show = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(24px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  return (
    <section style={{ paddingTop: "clamp(62px, 7vw, 92px)" }}>
      {/* The footage runs as a clean band, starting below the masthead so the
          navigation always sits on paper and never fights the grade. */}
      <div ref={fadeRef} style={{
        position: "relative", height: "min(58svh, 620px)", overflow: "hidden",
        background: "#EEEAE1",
      }}>
        <div ref={scaleRef} className="hero-video-wrap" style={{
          position: "absolute", inset: "-10%",
          transform: "scale(1.08) translateY(0px)",
          transition: "transform 0.1s ease-out",
        }}>
          <video
            src="/hero-video.mp4"
            poster="/og-image.jpg"
            preload="metadata"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute", top: "50%", left: "50%",
              width: "100%", height: "100%", minWidth: "177.78vh",
              objectFit: "cover",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        </div>
        <img className="hero-image" src="/og-image.jpg" alt="" aria-hidden="true" />

        {/* Just enough paper at top and bottom to seat the nav and dissolve
            the lower edge into the page. */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(244,241,235,0) 78%, #F4F1EB 100%)",
        }} />
      </div>

      {/* The line lands on paper, where it can be set properly. */}
      <div style={{
        padding: "clamp(36px, 5vw, 64px) clamp(24px, 6vw, 72px) clamp(24px, 4vw, 56px)",
        maxWidth: "1180px", margin: "0 auto",
      }}>
        <h1 style={{
          fontSize: "clamp(40px, 7.2vw, 96px)",
          fontWeight: 400, lineHeight: 1.04, letterSpacing: "-0.018em",
          color: "#1C1A17", maxWidth: "13em",
          ...show(0.2),
        }}>
          Stories from <em style={{ fontStyle: "italic" }}>the edge</em> of the map.
        </h1>
        <p style={{
          marginTop: "clamp(22px, 3vw, 36px)", fontSize: "clamp(17px, 1.5vw, 21px)",
          color: "#57514A", lineHeight: 1.62, maxWidth: "30em",
          ...show(0.4),
        }}>
          Outdoor media, mini-documentaries and brand storytelling, shot in the
          wild corners of Alaska.
        </p>
      </div>
    </section>
  );
}

// ─── Shared section furniture ────────────────────────────────────────────────
// Sections are separated by space alone — no rules, no background blocks — so
// the page reads as one continuous sheet and the photographs carry the contrast.
const SECTION_Y = "clamp(96px, 14vw, 176px)";
const GUTTER = "clamp(24px, 6vw, 72px)";

function Section({ id, children, tint = false, style }) {
  return (
    <section id={id} style={{
      padding: `${SECTION_Y} ${GUTTER}`,
      background: tint ? "#EEEAE1" : "transparent",
      ...style,
    }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>{children}</div>
    </section>
  );
}

// Eyebrow + display heading. The eyebrow is small caps rather than the old
// letterspaced mono, so the whole page stays in one voice.
function SectionHead({ eyebrow, children, style }) {
  return (
    <div style={{ marginBottom: "clamp(40px, 6vw, 72px)", ...style }}>
      {eyebrow && (
        <div style={{
          fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
          color: "#9A928A", marginBottom: "18px",
        }}>
          {eyebrow}
        </div>
      )}
      <h2 style={{
        fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 400,
        lineHeight: 1.08, letterSpacing: "-0.012em", color: "#1C1A17",
      }}>
        {children}
      </h2>
    </div>
  );
}

// ─── Epigraph ────────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <Section>
      <FadeIn>
        <figure style={{ maxWidth: "24em", margin: "0 auto", textAlign: "center" }}>
          <blockquote style={{
            fontSize: "clamp(22px, 3vw, 34px)",
            fontStyle: "italic", fontWeight: 400,
            color: "#1C1A17", lineHeight: 1.38, letterSpacing: "-0.005em",
          }}>
            “To see the world, things dangerous to come to, to see behind walls,
            draw closer, to find each other and to feel. That is the purpose of life.”
          </blockquote>
          <figcaption style={{ marginTop: "28px", fontSize: "15px", color: "#9A928A", lineHeight: 1.7 }}>
            The Secret Life of Walter Mitty
            <br />
            <span style={{ fontStyle: "italic" }}>Palmer, Alaska</span>
          </figcaption>
        </figure>
      </FadeIn>
    </Section>
  );
}

// ─── Work section ─────────────────────────────────────────────────────────────
function WorkSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filtered = activeFilter === "all" ? PROJECTS : PROJECTS.filter(p => p.tags.includes(activeFilter));

  return (
    <Section id="work">
      <FadeIn>
        <SectionHead eyebrow="Selected work">
          The <em style={{ fontStyle: "italic" }}>reel</em>.
        </SectionHead>
      </FadeIn>

      {/* Filters as plain text — an underline marks the active one, no pills. */}
      <FadeIn delay={0.1}>
        <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", marginBottom: "clamp(44px, 6vw, 72px)" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: "2px 0",
              border: "none", background: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: "17px",
              color: activeFilter === f ? "#1C1A17" : "#9A928A",
              fontStyle: activeFilter === f ? "italic" : "normal",
              borderBottom: `1px solid ${activeFilter === f ? "#1C1A17" : "transparent"}`,
              transition: "color 0.25s, border-color 0.25s",
            }}>
              {f}
            </button>
          ))}
        </div>
      </FadeIn>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "clamp(64px, 9vw, 128px)" }}>
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </Section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <Section id="about" tint>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", gap: "clamp(40px, 6vw, 96px)" }}>
        <FadeIn>
          <SectionHead eyebrow="About" style={{ marginBottom: 0 }}>
            Built for the <em style={{ fontStyle: "italic" }}>field</em>.
          </SectionHead>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div>
            <p style={{ fontSize: "clamp(17px, 1.4vw, 20px)", color: "#57514A", lineHeight: 1.68, marginBottom: "1.2em" }}>
              Freelance videographer based in Palmer, Alaska. I make outdoor media,
              mini-documentaries and brand films for companies and organizations
              operating at the edge of the last frontier.
            </p>
            <p style={{ fontSize: "clamp(17px, 1.4vw, 20px)", color: "#57514A", lineHeight: 1.68, marginBottom: "2.2em" }}>
              Years of shooting in extreme conditions, from −40°F winters to peak
              summer alpine. Available nights and weekends.
            </p>

            {/* Capabilities as a plain running list — no bullets, no chips. */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, columns: 2, columnGap: "32px" }}>
              {SKILLS.map((s) => (
                <li key={s} style={{ fontSize: "17px", color: "#1C1A17", lineHeight: 2, breakInside: "avoid" }}>
                  {s}
                </li>
              ))}
            </ul>

            <figure style={{ margin: "clamp(44px, 6vw, 72px) 0 0", maxWidth: "30em" }}>
              <blockquote style={{ fontSize: "clamp(19px, 1.8vw, 24px)", fontStyle: "italic", color: "#1C1A17", lineHeight: 1.5 }}>
                “You don't take a photograph, you make it.”
              </blockquote>
              <figcaption style={{ marginTop: "14px", fontSize: "15px", color: "#9A928A" }}>
                Ansel Adams — every frame is a decision, not a capture.
              </figcaption>
            </figure>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

// ─── Personal quote ──────────────────────────────────────────────────────────
function QuoteSection() {
  return (
    <Section>
      <FadeIn>
        <figure style={{ maxWidth: "22em", margin: "0 auto", textAlign: "center" }}>
          <blockquote style={{
            fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 400, fontStyle: "italic",
            lineHeight: 1.3, letterSpacing: "-0.01em", color: "#1C1A17",
          }}>
            “The camera isn't a technological advancement. It's a tool for
            understanding and experiencing humanity at its fullest.”
          </blockquote>
          <figcaption style={{ marginTop: "32px", fontSize: "15px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9A928A" }}>
            Jaron Mobley
          </figcaption>
        </figure>
      </FadeIn>
    </Section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────
function ContactSection() {
  // ─ Update your email and Instagram handle here ─
  const EMAIL = "jaronmobley@gmail.com";
  const INSTAGRAM = "@jaronmobley.mp4";
  const INSTAGRAM_URL = "https://instagram.com/jaronmobley.mp4";

  // Set large and underlined — the address itself is the button.
  const addr = {
    display: "inline-block",
    fontSize: "clamp(22px, 3vw, 38px)", color: "#1C1A17", lineHeight: 1.35,
    borderBottom: "1px solid rgba(28,26,23,0.25)", paddingBottom: "3px",
    transition: "border-color 0.3s ease",
  };
  const hover = (on) => (e) => { e.currentTarget.style.borderColor = on ? "#1C1A17" : "rgba(28,26,23,0.25)"; };

  return (
    <Section id="contact" tint>
      <FadeIn>
        <SectionHead eyebrow="Contact">
          Let's make <em style={{ fontStyle: "italic" }}>something</em>.
        </SectionHead>
        <p style={{ fontSize: "clamp(17px, 1.4vw, 20px)", color: "#57514A", lineHeight: 1.68, maxWidth: "28em", marginBottom: "clamp(40px, 5vw, 64px)" }}>
          Booking outdoor, documentary and brand projects across Alaska.
          Reach out to start a conversation.
        </p>
      </FadeIn>

      <FadeIn delay={0.12}>
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(24px, 3vw, 40px)", alignItems: "flex-start" }}>
          <a href={`mailto:${EMAIL}`} style={addr} onMouseEnter={hover(true)} onMouseLeave={hover(false)}>
            {EMAIL}
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" style={addr} onMouseEnter={hover(true)} onMouseLeave={hover(false)}>
            {INSTAGRAM}
          </a>
        </div>
      </FadeIn>
    </Section>
  );
}

// ─── Gallery data (computed once per page load) ───────────────────────────────
const GALLERY_ALL = [
  ...POSTS.flatMap(post => post.images.map((src, i) => ({
    id: `blog-${post.id}-${i}`,
    src,
    alt: post.title,
    caption: post.title,
    date: post.date,
  }))),
  ...GALLERY,
];

// Full wall, arranged by color for the standalone gallery page.
const GALLERY_SORTED = [...GALLERY_ALL].sort((a, b) => {
  const ca = GALLERY_COLORS[a.src] ?? { h: 0, s: 0, l: 0.5 };
  const cb = GALLERY_COLORS[b.src] ?? { h: 0, s: 0, l: 0.5 };
  return ca.h - cb.h;
});

// Homepage preview: a fresh random sample each visit. Shuffled once at load so
// it stays put while the visitor browses, then re-mixes on the next refresh.
const GALLERY_SHUFFLED = (() => {
  const copy = [...GALLERY_ALL];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
})();

const GALLERY_PREVIEW_COUNT = 8;

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const initialRoute = useRef(readRouteFromPath()).current;
  const [blogPostId, setBlogPostId] = useState(initialRoute.view === "blog" ? initialRoute.postId : null);
  const [showBlog, setShowBlog] = useState(initialRoute.view === "blog");
  const [showGallery, setShowGallery] = useState(initialRoute.view === "gallery");

  const openBlog = (postId = null, { replace = false } = {}) => {
    setShowGallery(false);
    setShowBlog(true);
    setBlogPostId(postId);
    const path = postId ? `/blog/${postId}` : "/blog";
    if (window.location.pathname !== path) {
      history[replace ? "replaceState" : "pushState"]({ view: "blog", postId }, "", path);
    }
    window.scrollTo(0, 0);
  };

  const closeBlog = () => {
    setShowBlog(false);
    setBlogPostId(null);
    if (window.location.pathname !== "/") history.pushState({ view: "home" }, "", "/");
    window.scrollTo(0, 0);
  };

  const openGallery = () => {
    setShowBlog(false);
    setShowGallery(true);
    if (window.location.pathname !== "/gallery") history.pushState({ view: "gallery" }, "", "/gallery");
    window.scrollTo(0, 0);
  };

  const closeGallery = () => {
    setShowGallery(false);
    if (window.location.pathname !== "/") history.pushState({ view: "home" }, "", "/");
    window.scrollTo(0, 0);
  };

  // Sync state on browser back/forward.
  useEffect(() => {
    const onPopState = () => {
      const route = readRouteFromPath();
      setShowBlog(route.view === "blog");
      setBlogPostId(route.view === "blog" ? route.postId : null);
      setShowGallery(route.view === "gallery");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Keep <head> meta in sync with whatever's on screen (browser tab title,
  // and native share sheets that read the live DOM rather than the URL).
  useEffect(() => {
    if (showBlog && blogPostId) {
      const post = POSTS.find(p => p.id === blogPostId);
      applyMeta(post ? metaForPost(post) : DEFAULT_META);
    } else if (showBlog) {
      applyMeta({ ...DEFAULT_META, title: "Field Notes — Jaron Mobley", url: `${SITE_URL}/blog` });
    } else if (showGallery) {
      applyMeta({ ...DEFAULT_META, title: "Gallery — Jaron Mobley", url: `${SITE_URL}/gallery` });
    } else {
      applyMeta(DEFAULT_META);
    }
  }, [showBlog, showGallery, blogPostId]);

  if (showBlog) {
    return (
      <div style={{ background: "#F4F1EB", minHeight: "100vh", fontFamily: "'EB Garamond', Garamond, Georgia, serif", color: "#1C1A17", overflowX: "hidden" }}>
        <GlobalStyles />
        <Nav onNav={closeBlog} onFieldNotes={() => openBlog(null)} />
        <BlogPage activePostId={blogPostId} onOpenPost={openBlog} onBack={closeBlog} />
      </div>
    );
  }

  if (showGallery) {
    return (
      <div style={{ background: "#F4F1EB", minHeight: "100vh", fontFamily: "'EB Garamond', Garamond, Georgia, serif", color: "#1C1A17", overflowX: "hidden" }}>
        <GlobalStyles />
        <Nav onNav={closeGallery} onFieldNotes={() => openBlog(null)} />
        <GallerySection items={GALLERY_SORTED} asPage onBack={closeGallery} />
        <footer style={{
          padding: "clamp(40px, 5vw, 64px) clamp(24px, 6vw, 72px)",
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          flexWrap: "wrap", gap: "12px", background: "#EEEAE1",
        }}>
          <div style={{ fontSize: "17px", color: "#9A928A" }}>Jaron <em style={{ fontStyle: "italic" }}>Mobley</em></div>
          <div style={{ fontSize: "15px", color: "#B5ADA3" }}>© 2025 · Palmer, Alaska</div>
        </footer>
      </div>
    );
  }

  return (
    <div style={{ background: "#F4F1EB", minHeight: "100vh", fontFamily: "'EB Garamond', Garamond, Georgia, serif", color: "#1C1A17", overflowX: "hidden" }}>
      <GlobalStyles />
      <Nav onNav={null} onFieldNotes={() => openBlog(null)} />
      <Hero />
      <StatsBar />
      <WorkSection />
      <GallerySection items={GALLERY_SHUFFLED} limit={GALLERY_PREVIEW_COUNT} onSeeMore={openGallery} />
      <LatestPost onReadPost={(id) => openBlog(id)} />
      <AboutSection />
      <QuoteSection />
      <ContactSection />
      <footer style={{
        padding: "clamp(40px, 5vw, 64px) clamp(24px, 6vw, 72px)",
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ fontSize: "17px", color: "#9A928A" }}>Jaron <em style={{ fontStyle: "italic" }}>Mobley</em></div>
        <div style={{ fontSize: "15px", color: "#B5ADA3" }}>© 2025 · Palmer, Alaska</div>
      </footer>
    </div>
  );
}
