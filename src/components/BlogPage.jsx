import { useState } from "react";
import { POSTS } from "../blog.js";
import FadeIn from "./FadeIn.jsx";
import { useInView } from "../hooks.js";

// ─── Individual post view ────────────────────────────────────────────────────
function PostView({ post, onBack }) {
  const [lightbox, setLightbox] = useState(null);

  // Parse body into paragraphs
  const paragraphs = post.body.split("\n\n").filter(Boolean);

  // Interleave: intro paragraph, then images scattered between paragraphs
  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      {/* Back button */}
      <div style={{ padding: "24px 24px 0" }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase",
            color: "#7A8A8E", fontFamily: "'DM Mono', monospace",
            display: "flex", alignItems: "center", gap: "8px", padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#C4A35A"}
          onMouseLeave={e => e.currentTarget.style.color = "#7A8A8E"}
        >
          ← Field Notes
        </button>
      </div>

      {/* Hero */}
      <div style={{ margin: "28px 0 0", position: "relative", overflow: "hidden", aspectRatio: "3/2" }}>
        <img
          src={post.heroImage}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.75)" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,14,18,1) 0%, rgba(10,14,18,0.1) 60%)",
        }} />
        <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px" }}>
          <div style={{
            fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase",
            color: "#C4A35A", fontFamily: "'DM Mono', monospace", marginBottom: "10px",
          }}>
            {post.date} — {post.location}
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 8vw, 52px)",
            fontWeight: 900, lineHeight: 1.05, color: "#EDE8DF",
          }}>
            {post.title}
          </h1>
          <div style={{
            marginTop: "6px", fontSize: "14px", fontStyle: "italic",
            fontFamily: "'Playfair Display', serif", color: "#8FA99A",
          }}>
            {post.subtitle}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "40px 24px 80px" }}>
        {paragraphs.map((para, i) => (
          <div key={i}>
            <p style={{
              fontSize: "16px", color: "#8FA99A", lineHeight: 1.85,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              maxWidth: "600px", marginBottom: "28px",
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
                <div style={{
                  position: "absolute", bottom: "10px", right: "12px",
                  fontSize: "9px", letterSpacing: "2px", color: "rgba(196,163,90,0.6)",
                  fontFamily: "'DM Mono', monospace",
                }}>
                  X-T3
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Remaining images as a 2-up grid */}
        {post.images.length > 4 && (
          <>
            <div style={{
              fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase",
              color: "#4A5A60", fontFamily: "'DM Mono', monospace", marginBottom: "14px",
            }}>
              More from the day
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "40px" }}>
              {post.images.slice(4).map((img, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(i + 4)}
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "8px", borderTop: "1px solid rgba(196,163,90,0.1)" }}>
          {post.tags.map(t => (
            <span key={t} style={{
              fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase",
              color: "#4A5A60", fontFamily: "'DM Mono', monospace",
              border: "1px solid rgba(74,90,96,0.3)", padding: "3px 8px",
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
            background: "none", border: "1px solid rgba(196,163,90,0.3)",
            color: "#C4A35A", cursor: "pointer", width: "32px", height: "32px",
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
    <div
      ref={ref}
      onClick={() => onRead(post.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
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
        <div style={{ position: "absolute", bottom: "12px", left: "14px", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#C4A35A", fontFamily: "'DM Mono', monospace" }}>
          {post.location}
        </div>
      </div>

      <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#4A5A60", fontFamily: "'DM Mono', monospace", marginBottom: "8px" }}>
        {post.date}
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, lineHeight: 1.2, color: hovered ? "#EDE8DF" : "#C9C2B7", marginBottom: "8px", transition: "color 0.3s" }}>
        {post.title}
      </h3>
      <p style={{ fontSize: "13px", color: "#7A8A8E", lineHeight: 1.7, fontWeight: 300, fontFamily: "'DM Sans', sans-serif", marginBottom: "12px" }}>
        {post.body.split("\n\n")[0]}
      </p>
      <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C4A35A", fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: "6px" }}>
        Read <span style={{ transform: hovered ? "translateX(4px)" : "none", transition: "transform 0.3s", display: "inline-block" }}>→</span>
      </div>
    </div>
  );
}

// ─── Blog index page ─────────────────────────────────────────────────────────
export default function BlogPage({ initialPostId, onBack }) {
  const [activePost, setActivePost] = useState(initialPostId || null);

  const post = activePost ? POSTS.find(p => p.id === activePost) : null;

  if (post) {
    return <PostView post={post} onBack={() => setActivePost(null)} />;
  }

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh" }}>
      {/* Back to portfolio */}
      <div style={{ padding: "24px 24px 0" }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase",
            color: "#7A8A8E", fontFamily: "'DM Mono', monospace",
            display: "flex", alignItems: "center", gap: "8px", padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#C4A35A"}
          onMouseLeave={e => e.currentTarget.style.color = "#7A8A8E"}
        >
          ← Portfolio
        </button>
      </div>

      <div style={{ padding: "40px 24px 100px" }}>
        <FadeIn>
          <div style={{ marginBottom: "48px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "4px", textTransform: "uppercase", color: "#C4A35A", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>
              Field Notes
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 8vw, 52px)", fontWeight: 700, lineHeight: 1.1, color: "#EDE8DF" }}>
              From the field.
            </h2>
            <p style={{ marginTop: "14px", fontSize: "14px", color: "#7A8A8E", fontWeight: 300, lineHeight: 1.7, maxWidth: "360px" }}>
              Trip reports, gear notes, and frames worth keeping.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "56px" }}>
          {POSTS.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} onRead={setActivePost} />
          ))}
        </div>
      </div>
    </div>
  );
}
