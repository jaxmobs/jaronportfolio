import { useState, useEffect, useRef } from "react";
import { PROJECTS, SKILLS, FILTERS, GALLERY } from "./data.js";
import FadeIn from "./components/FadeIn.jsx";
import ProjectCard from "./components/ProjectCard.jsx";
import GallerySection from "./components/GallerySection.jsx";
import BlogPage from "./components/BlogPage.jsx";
import LatestPost from "./components/LatestPost.jsx";
import { POSTS } from "./blog.js";
import GALLERY_COLORS from "./gallery-colors.json";

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
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,600;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #0A0E12; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0A0E12; }
    ::-webkit-scrollbar-thumb { background: #C4A35A; border-radius: 2px; }
    a { color: inherit; text-decoration: none; }
    a:focus-visible, button:focus-visible { outline: 2px solid #C4A35A; outline-offset: 3px; border-radius: 2px; }
    [role="button"]:focus-visible { outline: 2px solid #C4A35A; outline-offset: 3px; }
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

  const desktopLink = {
    fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase",
    color: "#7A8A8E", fontFamily: "'DM Mono', monospace", transition: "color 0.2s",
  };
  const bar = { width: "22px", height: "2px", background: "#EDE8DF", borderRadius: "1px", display: "block" };

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
        padding: "20px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: solid ? "rgba(10,14,18,0.97)" : "transparent",
        borderBottom: solid ? "1px solid rgba(196,163,90,0.12)" : "none",
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}>
        <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif", fontSize: "18px", fontWeight: 700, letterSpacing: "1px", color: "#EDE8DF", whiteSpace: "nowrap" }}>
          Jaron <span style={{ color: "#C4A35A" }}>Mobley</span>
        </div>

        {/* Desktop links */}
        <div className="nav-desktop">
          {links.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={(e) => goTo(e, `#${item.toLowerCase()}`)} style={desktopLink}
              onMouseEnter={e => e.target.style.color = "#C4A35A"}
              onMouseLeave={e => e.target.style.color = "#7A8A8E"}
            >
              {item}
            </a>
          ))}
          <button onClick={handleFieldNotes} style={{ ...desktopLink, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            onMouseEnter={e => e.target.style.color = "#C4A35A"}
            onMouseLeave={e => e.target.style.color = "#7A8A8E"}
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
            background: "rgba(10,14,18,0.98)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px",
          }}>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{
            position: "absolute", top: "22px", right: "24px",
            background: "none", border: "1px solid rgba(196,163,90,0.3)", color: "#C4A35A",
            width: "38px", height: "38px", fontSize: "16px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
          {links.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={(e) => goTo(e, `#${item.toLowerCase()}`)} style={{
              fontSize: "17px", letterSpacing: "3px", textTransform: "uppercase",
              color: "#EDE8DF", fontFamily: "'DM Mono', monospace",
            }}>
              {item}
            </a>
          ))}
          <button onClick={handleFieldNotes} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "17px", letterSpacing: "3px", textTransform: "uppercase",
            color: "#EDE8DF", fontFamily: "'DM Mono', monospace",
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
    <section style={{ position: "relative", height: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
      {/* BG Video — scroll-reactive parallax, fade, and scale */}
      <div ref={fadeRef} style={{
        position: "absolute", inset: 0, overflow: "hidden",
        opacity: 1,
        filter: "brightness(0.9)",
      }}>
        <div ref={scaleRef} className="hero-video-wrap" style={{
          position: "absolute", inset: "-10%",
          transform: "scale(1.08) translateY(0px)",
          transition: "transform 0.1s ease-out",
        }}>
          <video
            src="/hero-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100vw",
              height: "56.25vw",
              minWidth: "177.78vh",
              minHeight: "100vh",
              objectFit: "cover",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        </div>
        <img className="hero-image" src="/og-image.jpg" alt="" aria-hidden="true" />
      </div>
      {/* Gradient */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0A0E12 0%, rgba(10,14,18,0.2) 50%, rgba(10,14,18,0.4) 100%)" }} />

      {/* Coordinates */}
      <div className="hero-coords" style={{
        position: "absolute", top: "50%", right: "24px",
        transform: "translateY(-50%) rotate(90deg)",
        fontSize: "9px", letterSpacing: "3px", color: "rgba(196,163,90,0.5)",
        fontFamily: "'DM Mono', monospace",
        ...show(1.0),
      }}>
        61.5996° N / 149.1200° W
      </div>

      {/* Text */}
      <div style={{ position: "relative", padding: "0 24px 60px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#C4A35A", fontFamily: "'DM Mono', monospace", marginBottom: "16px", ...show(0.3) }}>
          Videographer — Palmer, Alaska
        </div>
        <h1 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif", fontSize: "clamp(42px, 10vw, 86px)", fontWeight: 900, lineHeight: 0.95, color: "#EDE8DF", ...show(0.5) }}>
          Stories from<br />
          <em style={{ color: "#C4A35A" }}>the edge</em><br />
          of the map.
        </h1>
        <p style={{ marginTop: "24px", fontSize: "14px", color: "#8FA99A", fontWeight: 300, maxWidth: "340px", lineHeight: 1.7, ...show(0.8) }}>
          Outdoor media, mini-docs, and brand storytelling — shot in the wild corners of Alaska.
        </p>
        <div style={{ marginTop: "36px", display: "flex", gap: "16px", alignItems: "center", ...show(1.0) }}>
          <a href="#work" onClick={(e) => { e.preventDefault(); scrollToHash("#work"); }} style={{ padding: "12px 28px", background: "#C4A35A", color: "#0A0E12", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
            View Work
          </a>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollToHash("#about"); }} style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#7A8A8E", fontFamily: "'DM Mono', monospace" }}>
            About ↓
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", ...show(1.5), opacity: loaded ? 0.5 : 0 }}>
        <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, transparent, #C4A35A)", animation: "scrollPulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

// ─── Stats bar ───────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <section style={{ borderTop: "1px solid rgba(196,163,90,0.12)", borderBottom: "1px solid rgba(196,163,90,0.12)", padding: "40px 24px" }}>
      <FadeIn>
        <div style={{ maxWidth: "560px" }}>
          <div style={{ width: "32px", height: "2px", background: "#C4A35A", marginBottom: "20px" }} />
          <p style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
            fontSize: "clamp(16px, 4vw, 22px)",
            fontStyle: "italic",
            fontWeight: 700,
            color: "#EDE8DF",
            lineHeight: 1.45,
            marginBottom: "16px",
          }}>
            "To see the world, things dangerous to come to, to see behind walls, draw closer, to find each other and to feel. That is the purpose of life."
          </p>
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#C4A35A", fontFamily: "'DM Mono', monospace", marginBottom: "6px" }}>
            The Secret Life of Walter Mitty
          </div>
          <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#4A5A60", fontFamily: "'DM Mono', monospace" }}>
            Palmer, Alaska Based
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

// ─── Work section ─────────────────────────────────────────────────────────────
function WorkSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filtered = activeFilter === "all" ? PROJECTS : PROJECTS.filter(p => p.tags.includes(activeFilter));

  return (
    <section id="work" style={{ padding: "80px 24px" }}>
      <FadeIn>
        <div style={{ marginBottom: "48px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "4px", textTransform: "uppercase", color: "#C4A35A", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>
            Selected Work
          </div>
          <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif", fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 700, lineHeight: 1.1, color: "#EDE8DF" }}>
            The reel.
          </h2>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: "6px 14px",
              border: `1px solid ${activeFilter === f ? "#C4A35A" : "rgba(196,163,90,0.2)"}`,
              background: activeFilter === f ? "rgba(196,163,90,0.1)" : "transparent",
              color: activeFilter === f ? "#C4A35A" : "#7A8A8E",
              fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase",
              fontFamily: "'DM Mono', monospace", cursor: "pointer", transition: "all 0.2s",
            }}>
              {f}
            </button>
          ))}
        </div>
      </FadeIn>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px", maxWidth: "1280px", margin: "0 auto" }}>
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── About section ───────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" style={{ padding: "80px 24px", background: "#0D1218", borderTop: "1px solid rgba(196,163,90,0.08)" }}>
      <FadeIn>
        <div style={{ fontSize: "9px", letterSpacing: "4px", textTransform: "uppercase", color: "#C4A35A", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>
          About
        </div>
        <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif", fontSize: "clamp(32px, 8vw, 48px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "28px", color: "#EDE8DF" }}>
          Built for the<br /><em style={{ color: "#C4A35A" }}>field.</em>
        </h2>
      </FadeIn>

      <FadeIn delay={0.15}>
        <p style={{ fontSize: "15px", color: "#8FA99A", lineHeight: 1.8, maxWidth: "420px", fontWeight: 300, marginBottom: "20px" }}>
          Freelance videographer based in Palmer, Alaska. I make outdoor media, mini-documentaries, and brand films for companies and organizations operating at the edge of the last frontier.
        </p>
        <p style={{ fontSize: "15px", color: "#8FA99A", lineHeight: 1.8, maxWidth: "420px", fontWeight: 300, marginBottom: "40px" }}>
          Years of shooting in extreme conditions, from -40°F winters to peak summer alpine. Available nights and weekends.
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <ul style={{ maxWidth: "360px", listStyle: "none", padding: 0, margin: 0 }}>
          {SKILLS.map((s) => (
            <li key={s} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <span style={{ width: "6px", height: "6px", background: "#C4A35A", borderRadius: "50%", flexShrink: 0 }} />
              <span style={{ fontSize: "14px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#EDE8DF", fontFamily: "'DM Mono', monospace" }}>
                {s}
              </span>
            </li>
          ))}
        </ul>
      </FadeIn>

      {/* Ansel Adams */}
      <FadeIn delay={0.25}>
        <div style={{ marginTop: "44px", borderLeft: "2px solid rgba(196,163,90,0.3)", paddingLeft: "20px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#C4A35A", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: "10px" }}>
            Influence
          </div>
          <p style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif", fontSize: "16px", fontStyle: "italic", color: "#8FA99A", lineHeight: 1.6, maxWidth: "360px" }}>
            "You don't take a photograph, you make it."
          </p>
          <div style={{ marginTop: "8px", fontSize: "10px", letterSpacing: "2px", color: "#4A5A60", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
            — Ansel Adams
          </div>
          <p style={{ marginTop: "12px", fontSize: "13px", color: "#4A5A60", lineHeight: 1.7, maxWidth: "340px", fontWeight: 300 }}>
            Adams taught that every frame is a decision, not a capture. That philosophy lives in every shot I take in the field.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

// ─── Personal quote ───────────────────────────────────────────────────────────
function QuoteSection() {
  return (
    <section style={{ padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "clamp(80px, 30vw, 200px)", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
        color: "rgba(196,163,90,0.04)", lineHeight: 1, userSelect: "none", whiteSpace: "nowrap",
      }}>
        ALASKA
      </div>
      <FadeIn>
        <blockquote style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: "40px", height: "2px", background: "#C4A35A", margin: "0 auto 24px" }} />
          <p style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
            fontSize: "clamp(22px, 6vw, 36px)",
            fontWeight: 700, lineHeight: 1.3, fontStyle: "italic",
            color: "#EDE8DF", maxWidth: "560px", margin: "0 auto",
          }}>
            "The camera isn't a technological advancement. It's a tool for understanding and experiencing humanity at its fullest."
          </p>
          <footer style={{ marginTop: "20px", fontSize: "10px", letterSpacing: "3px", color: "#C4A35A", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
            — Jaron Mobley
          </footer>
        </blockquote>
      </FadeIn>
    </section>
  );
}

// ─── Contact section ──────────────────────────────────────────────────────────
function ContactSection() {
  // ─ Update your email and Instagram handle here ─
  const EMAIL = "jaronmobley@gmail.com";
  const INSTAGRAM = "@jaronmobley.mp4";
  const INSTAGRAM_URL = "https://instagram.com/jaronmobley.mp4";

  const linkStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 20px",
    border: "1px solid rgba(196,163,90,0.2)",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <section id="contact" style={{ padding: "80px 24px 100px", background: "#0D1218", borderTop: "1px solid rgba(196,163,90,0.08)" }}>
      <FadeIn>
        <div style={{ fontSize: "9px", letterSpacing: "4px", textTransform: "uppercase", color: "#C4A35A", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>
          Contact
        </div>
        <h2 style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif", fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "16px", color: "#EDE8DF" }}>
          Let's make<br /><em style={{ color: "#C4A35A" }}>something.</em>
        </h2>
        <p style={{ fontSize: "14px", color: "#7A8A8E", lineHeight: 1.7, maxWidth: "340px", marginBottom: "40px", fontWeight: 300 }}>
          Booking outdoor, documentary, and brand projects across Alaska. Reach out to start a conversation.
        </p>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <a href={`mailto:${EMAIL}`} style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C4A35A"; e.currentTarget.style.background = "rgba(196,163,90,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(196,163,90,0.2)"; e.currentTarget.style.background = "transparent"; }}
          >
            <div>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#7A8A8E", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: "4px" }}>Email</div>
              <div style={{ fontSize: "14px", color: "#EDE8DF" }}>{EMAIL}</div>
            </div>
            <span style={{ color: "#C4A35A", fontSize: "20px" }}>→</span>
          </a>

          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C4A35A"; e.currentTarget.style.background = "rgba(196,163,90,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(196,163,90,0.2)"; e.currentTarget.style.background = "transparent"; }}
          >
            <div>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#7A8A8E", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: "4px" }}>Instagram</div>
              <div style={{ fontSize: "14px", color: "#EDE8DF" }}>{INSTAGRAM}</div>
            </div>
            <span style={{ color: "#C4A35A", fontSize: "20px" }}>→</span>
          </a>
        </div>
      </FadeIn>
    </section>
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
      <div style={{ background: "#0A0E12", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#EDE8DF", overflowX: "hidden" }}>
        <GlobalStyles />
        <Nav onNav={closeBlog} onFieldNotes={() => openBlog(null)} />
        <BlogPage activePostId={blogPostId} onOpenPost={openBlog} onBack={closeBlog} />
      </div>
    );
  }

  if (showGallery) {
    return (
      <div style={{ background: "#0A0E12", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#EDE8DF", overflowX: "hidden" }}>
        <GlobalStyles />
        <Nav onNav={closeGallery} onFieldNotes={() => openBlog(null)} />
        <GallerySection items={GALLERY_SORTED} asPage onBack={closeGallery} />
        <footer style={{ padding: "24px", borderTop: "1px solid rgba(196,163,90,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif", fontSize: "14px", color: "#3A4A50" }}>Jaron Mobley</div>
          <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#3A4A50", fontFamily: "'DM Mono', monospace" }}>© 2025 — Palmer, AK</div>
        </footer>
      </div>
    );
  }

  return (
    <div style={{ background: "#0A0E12", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#EDE8DF", overflowX: "hidden" }}>
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
      <footer style={{ padding: "24px", borderTop: "1px solid rgba(196,163,90,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif", fontSize: "14px", color: "#3A4A50" }}>Jaron Mobley</div>
        <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#3A4A50", fontFamily: "'DM Mono', monospace" }}>© 2025 — Palmer, AK</div>
      </footer>
    </div>
  );
}
