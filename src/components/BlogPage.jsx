import { useState } from "react";
import { POSTS } from "../blog.js";
import FadeIn from "./FadeIn.jsx";
import { useInView } from "../hooks.js";

// ─── Individual post view ────────────────────────────────────────────────────
function PostView({ post, onBack }) {
  const [lightbox, setLightbox] = useState(null);

  // Parse body into paragraphs
  const paragraphs = post.body.split("\n\n").filter(Boolean);
  // Images 1..3 get placed inline between the first 3 paragraphs (if they exist).
  // The grid below always picks up wherever inline placement left off, so no
  // images get silently skipped when a post has fewer than 3 paragraphs.
  const inlineImageCount = Math.min(paragraphs.length, 3, Math.max(post.images.length - 1, 0));
  const gridStart = 1 + inlineImageCount;

  // Interleave: intro paragraph, then images scattered between paragraphs
  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      {/* Back button */}
      <div style={{ padding: "24px 24px 0" }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#7A736B", fontFamily: "'EB Garamond', Garamond, Georgia, serif",
            display: "flex", alignItems: "center", gap: "8px", padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#1C1A17"}
          onMouseLeave={e => e.currentTarget.style.color = "#7A736B"}
        >
          ← Field Notes
        </button>
      </div>

      {/* Hero — the photograph is left ungraded and uncovered; the title is set
          beneath it on paper rather than burned into the frame. */}
      <div style={{ margin: "28px 0 0", overflow: "hidden", aspectRatio: "3/2", background: "#EEEAE1" }}>
        <img
          src={post.heroImage}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      <header style={{
        padding: "clamp(36px, 5vw, 60px) clamp(24px, 6vw, 72px) 0",
        maxWidth: "1180px", margin: "0 auto",
      }}>
        <div style={{
          fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
          color: "#9A928A", marginBottom: "18px",
        }}>
          {post.date} · {post.location}
        </div>
        <h1 style={{
          fontSize: "clamp(32px, 5.4vw, 64px)",
          fontWeight: 400, lineHeight: 1.06, letterSpacing: "-0.015em",
          color: "#1C1A17", maxWidth: "16em",
        }}>
          {post.title}
        </h1>
        {post.subtitle && (
          <div style={{ marginTop: "14px", fontSize: "19px", fontStyle: "italic", color: "#9A928A" }}>
            {post.subtitle}
          </div>
        )}
      </header>

      {/* Body */}
      <div style={{ padding: "clamp(32px, 4vw, 48px) clamp(24px, 6vw, 72px) clamp(72px, 10vw, 120px)", maxWidth: "1180px", margin: "0 auto" }}>
        {paragraphs.map((para, i) => (
          <div key={i}>
            <p style={{
              fontSize: "clamp(18px, 1.5vw, 21px)", color: "#57514A", lineHeight: 1.72,
              fontWeight: 400, maxWidth: "34em", marginBottom: "1.5em",
            }}>
              {para}
            </p>

            {/* Drop an image after paragraphs 0, 1, 2 */}
            {post.images[i + 1] && i < 3 && (
              <div
                onClick={() => setLightbox(i + 1)}
                style={{
                  cursor: "zoom-in",
                  marginBottom: "32px",
                  overflow: "hidden",
                  aspectRatio: i % 2 === 0 ? "3/2" : "4/3",
                  position: "relative",
                }}
              >
                <img
                  src={post.images[i + 1]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    display: "block", transition: "transform 0.5s ease",
                  }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}
                />
              </div>
            )}
          </div>
        ))}

        {/* Remaining images as a 2-up grid */}
        {post.images.length > gridStart && (
          <>
            <div style={{
              fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
              color: "#9A928A", fontFamily: "'EB Garamond', Garamond, Georgia, serif", marginBottom: "14px",
            }}>
              More from the day
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(12px, 1.6vw, 22px)", marginBottom: "clamp(44px, 6vw, 72px)" }}>
              {post.images.slice(gridStart).map((img, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(i + gridStart)}
                  style={{ cursor: "zoom-in", overflow: "hidden", aspectRatio: "1/1" }}
                >
                  <img
                    src={img} alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "22px", paddingTop: "26px", borderTop: "1px solid rgba(28,26,23,0.12)" }}>
          {post.tags.map(t => (
            <span key={t} style={{
              fontSize: "16px", color: "#9A928A", fontStyle: "italic",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(6,10,13,0.97)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
        >
          <img
            src={post.images[lightbox]}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain" }}
          />
          <button onClick={() => setLightbox(null)} style={{
            position: "absolute", top: "20px", right: "20px",
            background: "none", border: "none",
            color: "#F4F1EB", cursor: "pointer", width: "40px", height: "40px",
            fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>
      )}
    </div>
  );
}

// ─── Post list card ──────────────────────────────────────────────────────────
function PostCard({ post, onRead, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView(0.1);

  return (
    <a
      ref={ref}
      href={`/blog/${post.id}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onRead(post.id);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(30px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/9", marginBottom: "16px" }}>
        <img
          src={post.heroImage} alt={post.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.6s ease",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,14,18,0.7) 0%, transparent 55%)",
        }} />
        <div style={{ position: "absolute", bottom: "12px", left: "14px", fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#1C1A17", fontFamily: "'EB Garamond', Garamond, Georgia, serif" }}>
          {post.location}
        </div>
      </div>

      <div style={{ fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#9A928A", fontFamily: "'EB Garamond', Garamond, Georgia, serif", marginBottom: "8px" }}>
        {post.date}
      </div>
      <h3 style={{ fontFamily: "'EB Garamond', Garamond, Georgia, serif", fontSize: "22px", fontWeight: 400, lineHeight: 1.2, color: hovered ? "#1C1A17" : "#57514A", marginBottom: "8px", transition: "color 0.3s" }}>
        {post.title}
      </h3>
      <p style={{ fontSize: "16px", color: "#7A736B", lineHeight: 1.7, fontWeight: 400, fontFamily: "'EB Garamond', Garamond, Georgia, serif", marginBottom: "12px" }}>
        {post.body.split("\n\n")[0]}
      </p>
      <div style={{ fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#1C1A17", fontFamily: "'EB Garamond', Garamond, Georgia, serif", display: "flex", alignItems: "center", gap: "6px" }}>
        Read <span style={{ transform: hovered ? "translateX(4px)" : "none", transition: "transform 0.3s", display: "inline-block" }}>→</span>
      </div>
    </a>
  );
}

// ─── Blog index page ─────────────────────────────────────────────────────────
// Controlled by the parent (App.jsx) so every entry point into a post — the
// homepage card, this index list — updates the same URL, keeping /blog/:id
// links shareable no matter how the visitor got there.
export default function BlogPage({ activePostId, onOpenPost, onBack }) {
  const post = activePostId ? POSTS.find(p => p.id === activePostId) : null;

  if (post) {
    return <PostView post={post} onBack={() => onOpenPost(null)} />;
  }

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      {/* Back to portfolio */}
      <div style={{ padding: "24px 24px 0" }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#7A736B", fontFamily: "'EB Garamond', Garamond, Georgia, serif",
            display: "flex", alignItems: "center", gap: "8px", padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#1C1A17"}
          onMouseLeave={e => e.currentTarget.style.color = "#7A736B"}
        >
          ← Portfolio
        </button>
      </div>

      <div style={{ padding: "40px 24px 100px" }}>
        <FadeIn>
          <div style={{ marginBottom: "48px" }}>
            <div style={{ fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#1C1A17", fontFamily: "'EB Garamond', Garamond, Georgia, serif", marginBottom: "12px" }}>
              Field Notes
            </div>
            <h2 style={{ fontFamily: "'EB Garamond', Garamond, Georgia, serif", fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 400, lineHeight: 1.1, color: "#1C1A17" }}>
              From the field.
            </h2>
            <p style={{ marginTop: "14px", fontSize: "14px", color: "#7A736B", fontWeight: 400, lineHeight: 1.7, maxWidth: "360px" }}>
              Trip reports, gear notes, and frames worth keeping.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "56px" }}>
          {POSTS.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} onRead={onOpenPost} />
          ))}
        </div>
      </div>
    </div>
  );
}
