import { useState } from "react";
import { PROJECTS, GALLERY, ONE_SHEET } from "../data.js";

// ─────────────────────────────────────────────────────────────
//  ONE-SHEET — the pitch link at /one-sheet
//
//  A destination, not a doorway: no nav, nothing to wander off
//  to, and short enough to read on a phone in under a minute.
//  Selection lives in ONE_SHEET in data.js.
// ─────────────────────────────────────────────────────────────

const EMAIL = "jaronmobley@gmail.com";
const INSTAGRAM_URL = "https://instagram.com/jaronmobley.mp4";

// Three YouTube iframes would pull well over a megabyte before the visitor
// has asked for anything. Show the poster, load the player on the first tap.
function Film({ project }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure style={{ margin: 0 }}>
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/9", background: "#EEEAE1" }}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={project.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            aria-label={`Play ${project.title}`}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              padding: 0, border: "none", background: "none", cursor: "pointer",
              display: "block",
            }}
          >
            <img
              src={project.thumb}
              alt={`Still from ${project.title}, a ${project.category.toLowerCase()} for ${project.client}`}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* The only mark allowed over a photograph, because without it
                there is nothing telling the visitor this is a film. */}
            <span style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "64px", height: "64px", borderRadius: "50%",
              background: "rgba(244,241,235,0.92)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                width: 0, height: 0, marginLeft: "5px",
                borderTop: "11px solid transparent",
                borderBottom: "11px solid transparent",
                borderLeft: "18px solid #1C1A17",
              }} />
            </span>
          </button>
        )}
      </div>

      <figcaption style={{
        display: "flex", flexWrap: "wrap", alignItems: "baseline",
        gap: "6px 18px", marginTop: "18px",
      }}>
        <h2 style={{
          fontSize: "clamp(21px, 2.2vw, 28px)", fontWeight: 400,
          lineHeight: 1.2, letterSpacing: "-0.01em", color: "#1C1A17", margin: 0,
        }}>
          {project.title}
        </h2>
        <span style={{ fontSize: "15px", color: "#9A928A", fontStyle: "italic" }}>
          {project.client} · {project.year}
        </span>
        <p style={{
          flexBasis: "100%", margin: "8px 0 0",
          fontSize: "17px", lineHeight: 1.6, color: "#57514A", maxWidth: "34em",
        }}>
          {project.description}
        </p>
      </figcaption>
    </figure>
  );
}

export default function OneSheet() {
  const films = ONE_SHEET.films
    .map((id) => PROJECTS.find((p) => p.id === id))
    .filter(Boolean);
  const photos = ONE_SHEET.photos
    .map((id) => GALLERY.find((g) => g.id === id))
    .filter(Boolean);

  const GUTTER = "clamp(24px, 6vw, 72px)";

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: `clamp(48px, 8vw, 96px) ${GUTTER} clamp(72px, 10vw, 120px)` }}>
      <header style={{ marginBottom: "clamp(48px, 7vw, 88px)" }}>
        <div style={{ fontSize: "21px", color: "#1C1A17", marginBottom: "clamp(28px, 4vw, 44px)" }}>
          Jaron <em style={{ fontStyle: "italic" }}>Mobley</em>
        </div>
        <h1 style={{
          fontSize: "clamp(34px, 5.6vw, 62px)", fontWeight: 400,
          lineHeight: 1.06, letterSpacing: "-0.016em", color: "#1C1A17",
          maxWidth: "12em", marginBottom: "clamp(22px, 3vw, 32px)",
        }}>
          Selected <em style={{ fontStyle: "italic" }}>work</em>.
        </h1>
        <p style={{
          fontSize: "clamp(17px, 1.5vw, 21px)", lineHeight: 1.62,
          color: "#57514A", maxWidth: "32em",
        }}>
          {ONE_SHEET.intro}
        </p>
      </header>

      <section style={{ display: "grid", gap: "clamp(56px, 8vw, 104px)" }}>
        {films.map((p) => <Film key={p.id} project={p} />)}
      </section>

      {photos.length > 0 && (
        <section style={{ marginTop: "clamp(72px, 10vw, 128px)" }}>
          <div style={{
            fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
            color: "#9A928A", marginBottom: "clamp(24px, 3vw, 36px)",
          }}>
            Stills
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
            gap: "clamp(12px, 1.6vw, 20px)",
          }}>
            {photos.map((ph) => (
              <img
                key={ph.id}
                src={ph.src}
                alt={ph.alt}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%", aspectRatio: "4/3", objectFit: "cover",
                  display: "block", background: "#EEEAE1",
                }}
              />
            ))}
          </div>
        </section>
      )}

      <section style={{ marginTop: "clamp(72px, 10vw, 128px)" }}>
        <h2 style={{
          fontSize: "clamp(26px, 3.6vw, 40px)", fontWeight: 400,
          lineHeight: 1.1, letterSpacing: "-0.012em", color: "#1C1A17",
          marginBottom: "clamp(24px, 3vw, 36px)",
        }}>
          Let's make <em style={{ fontStyle: "italic" }}>something</em>.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", alignItems: "flex-start" }}>
          <a href={`mailto:${EMAIL}`} style={{
            fontSize: "clamp(20px, 2.6vw, 32px)", color: "#1C1A17", lineHeight: 1.35,
            borderBottom: "1px solid rgba(28,26,23,0.25)", paddingBottom: "3px",
          }}>
            {EMAIL}
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" style={{ fontSize: "17px", color: "#9A928A" }}>
            @jaronmobley.mp4
          </a>
          <a href="/" style={{ fontSize: "17px", color: "#9A928A" }}>
            jaronmobley.com
          </a>
        </div>
      </section>
    </main>
  );
}
