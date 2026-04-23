import { useState, useEffect, useRef } from "react";
import { PROJECTS, SKILLS, FILTERS, GALLERY } from "./data.js";
import { useScrollY } from "./hooks.js";
import FadeIn from "./components/FadeIn.jsx";
import ProjectCard from "./components/ProjectCard.jsx";
import GallerySection from "./components/GallerySection.jsx";
import SkillBar from "./components/SkillBar.jsx";
import LifeMottoSection from "./components/LifeMottoSection.jsx";
import BlogPage from "./components/BlogPage.jsx";
import LatestPost from "./components/LatestPost.jsx";
import { POSTS } from "./blog.js";
import GALLERY_COLORS from "./gallery-colors.json";

// ─── Global styles injected once ───────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #0A0E12; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0A0E12; }
    ::-webkit-scrollbar-thumb { background: #C4A35A; border-radius: 2px; }
    a { color: inherit; text-decoration: none; }
    @keyframes scrollPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
  `}</style>
);

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav({ scrollY, onNav, onFieldNotes }) {
  const solid = scrollY > 60;
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "20px 24px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: solid ? "rgba(10,14,18,0.97)" : "transparent",
      borderBottom: solid ? "1px solid rgba(196,163,90,0.12)" : "none",
      transition: "background 0.4s ease, border-color 0.4s ease",
    }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, letterSpacing: "1px", color: "#EDE8DF" }}>
        Jaron <span style={{ color: "#C4A35A" }}>Mobley</span>
      </div>
      <div style={{ display: "flex", gap: "32px" }}>
        {["Work", "Gallery", "About", "Contact"].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => onNav && onNav(null)} style={{
            fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase",
            color: "#7A8A8E", fontFamily: "'DM Mono', monospace", transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = "#C4A35A"}
            onMouseLeave={e => e.target.style.color = "#7A8A8E"}
          >
            {item}
          </a>
        ))}
        <button onClick={onFieldNotes} style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase",
          color: "#7A8A8E", fontFamily: "'DM Mono', monospace", transition: "color 0.2s",
        }}
          onMouseEnter={e => e.target.style.color = "#C4A35A"}
          onMouseLeave={e => e.target.style.color = "#7A8A8E"}
        >
          Field Notes
        </button>
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero({ scrollY }) {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().catch(() => {});
  }, []);

  const show = (delay) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(24px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  const heroHeight = typeof window !== "undefined" ? window.innerHeight : 600;
  const scrollProgress = Math.min(scrollY / heroHeight, 1);
  const videoOpacity = 1 - scrollProgress * 0.7;
  const videoScale = 1.08 + scrollProgress * 0.15;
  const videoY = scrollY * 0.25;

  return (
    <section style={{ position: "relative", height: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
      {/* BG Video — scroll-reactive parallax, fade, and scale */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden",
        opacity: videoOpacity,
        filter: "brightness(0.9)",
      }}>
        <div style={{
          position: "absolute", inset: "-10%",
          transform: `scale(${videoScale}) translateY(${videoY * 0.5}px)`,
          transition: "transform 0.1s ease-out",
        }}>
          <video
            ref={videoRef}
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
      </div>
      {/* Gradient */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0A0E12 0%, rgba(10,14,18,0.2) 50%, rgba(10,14,18,0.4) 100%)" }} />

      {/* Coordinates */}
      <div style={{
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
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 10vw, 86px)", fontWeight: 900, lineHeight: 0.95, color: "#EDE8DF", ...show(0.5) }}>
          Stories from<br />
          <em style={{ color: "#C4A35A" }}>the edge</em><br />
          of the map.
        </h1>
        <p style={{ marginTop: "24px", fontSize: "14px", color: "#8FA99A", fontWeight: 300, maxWidth: "340px", lineHeight: 1.7, ...show(0.8) }}>
          Outdoor media, mini-docs, and brand storytelling — shot in the wild corners of Alaska.
        </p>
        <div style={{ marginTop: "36px", display: "flex", gap: "16px", alignItems: "center", ...show(1.0) }}>
          <a href="#work" style={{ padding: "12px 28px", background: "#C4A35A", color: "#0A0E12", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
            View Work
          </a>
          <a href="#about" style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#7A8A8E", fontFamily: "'DM Mono', monospace" }}>
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
            fontFamily: "'Playfair Display', serif",
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
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 700, lineHeight: 1.1, color: "#EDE8DF" }}>
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

// ─── Pucknote feature blurb ───────────────────────────────────────────────────
function PucknoteSection() {
  return (
    <section style={{ padding: "80px 24px", background: "#0D1218", borderTop: "1px solid rgba(196,163,90,0.08)", borderBottom: "1px solid rgba(196,163,90,0.08)" }}>
      <FadeIn>
        <div style={{ fontSize: "9px", letterSpacing: "4px", textTransform: "uppercase", color: "#C4A35A", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>
          Featured
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 6vw, 42px)", fontWeight: 700, lineHeight: 1.2, marginBottom: "16px", color: "#EDE8DF" }}>
          <span style={{ color: "#C4A35A" }}>pucknote</span> — Coffee brewing for home baristas
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p style={{ fontSize: "15px", color: "#8FA99A", lineHeight: 1.75, maxWidth: "420px", fontWeight: 300, marginBottom: "28px" }}>
          Dial in and keep track of your favorite coffees, organize and create recipes, and share them with friends. Precise calculators for espresso and pour-over, step-by-step brew timers, and detailed notes so you can perfect every cup.
        </p>
        <a
          href="https://www.pucknote.com/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "#C4A35A",
            color: "#0A0E12",
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontFamily: "'DM Mono', monospace",
            fontWeight: 500,
            border: "1px solid transparent",
            transition: "background 0.2s, border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "#C4A35A";
            e.currentTarget.style.color = "#C4A35A";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#C4A35A";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.color = "#0A0E12";
          }}
        >
          Check it out
        </a>
      </FadeIn>
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
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 8vw, 48px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "28px", color: "#EDE8DF" }}>
          Built for the<br /><em style={{ color: "#C4A35A" }}>field.</em>
        </h2>
      </FadeIn>

      <FadeIn delay={0.15}>
        <p style={{ fontSize: "15px", color: "#8FA99A", lineHeight: 1.8, maxWidth: "420px", fontWeight: 300, marginBottom: "20px" }}>
          Freelance videographer based in Palmer, Alaska. I make outdoor media, mini-documentaries, and brand films for companies and organizations operating at the edge of the last frontier.
        </p>
        <p style={{ fontSize: "15px", color: "#8FA99A", lineHeight: 1.8, maxWidth: "420px", fontWeight: 300, marginBottom: "40px" }}>
          Four years of shooting in extreme conditions, from -20°F winters to peak summer alpine. Available nights and weekends.
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div style={{ maxWidth: "360px" }}>
          {SKILLS.map((s, i) => (
            <SkillBar key={s.label} label={s.label} value={s.value} delay={0.2 + i * 0.1} />
          ))}
        </div>
      </FadeIn>

      {/* Ansel Adams */}
      <FadeIn delay={0.25}>
        <div style={{ marginTop: "44px", borderLeft: "2px solid rgba(196,163,90,0.3)", paddingLeft: "20px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#C4A35A", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: "10px" }}>
            Influence
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontStyle: "italic", color: "#8FA99A", lineHeight: 1.6, maxWidth: "360px" }}>
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

      {/* Toolchain */}
      <FadeIn delay={0.3}>
        <div style={{ marginTop: "40px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#4A5A60", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: "14px" }}>
            Toolchain
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {["DaVinci Resolve", "Final Cut Pro X", "Cineprint 35", "Lens Node", "DJI", "Sony FX"].map(t => (
              <span key={t} style={{
                fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase",
                color: "#7A8A8E", fontFamily: "'DM Mono', monospace",
                border: "1px solid rgba(122,138,142,0.2)", padding: "5px 10px",
              }}>
                {t}
              </span>
            ))}
          </div>
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
        fontSize: "clamp(80px, 30vw, 200px)", fontFamily: "'Playfair Display', serif",
        color: "rgba(196,163,90,0.04)", lineHeight: 1, userSelect: "none", whiteSpace: "nowrap",
      }}>
        ALASKA
      </div>
      <FadeIn>
        <blockquote style={{ position: "relative", zIndex: 1 }}>
          <div style={{ width: "40px", height: "2px", background: "#C4A35A", marginBottom: "24px" }} />
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(22px, 6vw, 36px)",
            fontWeight: 700, lineHeight: 1.3, fontStyle: "italic",
            color: "#EDE8DF", maxWidth: "480px",
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
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "16px", color: "#EDE8DF" }}>
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

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const scrollY = useScrollY();
  const [blogPostId, setBlogPostId] = useState(null);
  const [showBlog, setShowBlog] = useState(false);

  const openBlog = (postId = null) => {
    setShowBlog(true);
    setBlogPostId(postId);
    window.scrollTo(0, 0);
  };

  const closeBlog = () => {
    setShowBlog(false);
    setBlogPostId(null);
    window.scrollTo(0, 0);
  };

  if (showBlog) {
    return (
      <div style={{ background: "#0A0E12", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#EDE8DF", overflowX: "hidden" }}>
        <GlobalStyles />
        <Nav scrollY={scrollY} onNav={closeBlog} onFieldNotes={() => openBlog(null)} />
        <BlogPage initialPostId={blogPostId} onBack={closeBlog} />
      </div>
    );
  }

  return (
    <div style={{ background: "#0A0E12", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#EDE8DF", overflowX: "hidden" }}>
      <GlobalStyles />
      <Nav scrollY={scrollY} onNav={null} onFieldNotes={() => openBlog(null)} />
      <Hero scrollY={scrollY} />
      <StatsBar />
      <WorkSection />
      <GallerySection items={[
        ...POSTS.flatMap(post => post.images.map((src, i) => ({
          id: `blog-${post.id}-${i}`,
          src,
          alt: post.title,
          caption: post.title,
          date: post.date,
        }))),
        ...GALLERY,
      ].sort((a, b) => {
        const ca = GALLERY_COLORS[a.src] ?? { h: 0, s: 0, l: 0.5 };
        const cb = GALLERY_COLORS[b.src] ?? { h: 0, s: 0, l: 0.5 };
        return ca.h - cb.h;
      })} />
      <LatestPost onReadPost={(id) => openBlog(id)} />
      <PucknoteSection />
      <AboutSection />
      <QuoteSection />
      <ContactSection />
      <footer style={{ padding: "24px", borderTop: "1px solid rgba(196,163,90,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", color: "#3A4A50" }}>Jaron Mobley</div>
        <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#3A4A50", fontFamily: "'DM Mono', monospace" }}>© 2025 — Palmer, AK</div>
      </footer>
    </div>
  );
}
