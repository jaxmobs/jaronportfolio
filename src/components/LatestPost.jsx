import { useState } from "react";
import { useInView } from "../hooks.js";
import { POSTS } from "../blog.js";

export default function LatestPost({ onReadPost }) {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView(0.15);
  const post = POSTS[0];
  if (!post) return null;

  // Show just the first paragraph as a teaser
  const teaser = post.body.split("\n\n")[0];

  return (
    <section
      ref={ref}
      style={{
        padding: "80px 24px",
        background: "#EEEAE1",
        borderTop: "1px solid rgba(28,26,23,0.08)",
      }}
    >
      {/* Section label */}
      <div style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(20px)",
        transition: "opacity 0.7s ease 0.05s, transform 0.7s ease 0.05s",
        marginBottom: "36px",
      }}>
        <div style={{
          fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
          color: "#1C1A17", fontFamily: "'EB Garamond', Garamond, Georgia, serif", marginBottom: "10px",
        }}>
          Latest
        </div>
        <div style={{ width: "40px", height: "1px", background: "rgba(28,26,23,0.3)" }} />
      </div>

      {/* Card */}
      <a
        href={`/blog/${post.id}`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          onReadPost(post.id);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "block", textDecoration: "none", color: "inherit", cursor: "pointer" }}
      >
        {/* Hero image */}
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(30px)",
          transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          position: "relative", overflow: "hidden", aspectRatio: "16/9",
          marginBottom: "24px",
        }}>
          <img
            src={post.heroImage}
            alt={post.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.6s ease",
              filter: "brightness(0.9)",
            }}
          />
          {/* Gradient */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(10,14,18,0.7) 0%, transparent 50%)",
          }} />
          {/* Location tag */}
          <div style={{
            position: "absolute", bottom: "14px", left: "16px",
            fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#1C1A17", fontFamily: "'EB Garamond', Garamond, Georgia, serif",
          }}>
            {post.location}
          </div>
        </div>

        {/* Text */}
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
        }}>
          <div style={{
            fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#9A928A", fontFamily: "'EB Garamond', Garamond, Georgia, serif", marginBottom: "10px",
          }}>
            {post.date} — {post.subtitle}
          </div>

          <h3 style={{
            fontFamily: "'EB Garamond', Garamond, Georgia, serif",
            fontSize: "clamp(24px, 6vw, 36px)",
            fontWeight: 400, lineHeight: 1.15,
            color: hovered ? "#1C1A17" : "#57514A",
            marginBottom: "14px",
            transition: "color 0.3s ease",
          }}>
            {post.title}
          </h3>

          <p style={{
            fontSize: "14px", color: "#7A736B",
            fontFamily: "'EB Garamond', Garamond, Georgia, serif",
            lineHeight: 1.75, fontWeight: 400,
            maxWidth: "480px", marginBottom: "20px",
          }}>
            {teaser}
          </p>

          {/* Read link */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#1C1A17", fontFamily: "'EB Garamond', Garamond, Georgia, serif",
            borderBottom: `1px solid ${hovered ? "#1C1A17" : "transparent"}`,
            paddingBottom: "2px",
            transition: "border-color 0.3s ease",
          }}>
            Read the Post
            <span style={{
              transform: hovered ? "translateX(4px)" : "none",
              transition: "transform 0.3s ease",
              display: "inline-block",
            }}>→</span>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "20px" }}>
            {post.tags.map(t => (
              <span key={t} style={{
                fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
                color: "#9A928A", fontFamily: "'EB Garamond', Garamond, Georgia, serif",
                border: "1px solid rgba(28,26,23,0.3)", padding: "3px 8px",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </a>
    </section>
  );
}
