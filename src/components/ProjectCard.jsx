import { useState, useRef } from "react";
import { useInView } from "../hooks.js";
import VideoModal from "./VideoModal.jsx";

export default function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const dismissTimer = useRef(null);
  const [ref, inView] = useInView(0.1);
  const isEven = index % 2 === 0;
  const hasVideo = !!project.youtubeId;

  return (
    <>
      <div
        ref={ref}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : `translateX(${isEven ? "-50px" : "50px"})`,
          transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s`,
          display: "flex",
          flexDirection: "column",
          cursor: hasVideo ? "pointer" : "default",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPreviewReady(false);
          if (dismissTimer.current) { clearTimeout(dismissTimer.current); dismissTimer.current = null; }
        }}
        onClick={() => hasVideo && setModalOpen(true)}
        role={hasVideo ? "button" : undefined}
        tabIndex={hasVideo ? 0 : undefined}
        aria-label={hasVideo ? `Play ${project.title}` : undefined}
        onKeyDown={hasVideo ? (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setModalOpen(true); }
        } : undefined}
      >
        {/* Thumbnail */}
        <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/9" }}>
          <img
            src={project.thumb}
            alt={project.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.6s ease",
            }}
          />

          {/* Hover video preview — Netflix-style */}
          {hasVideo && hovered && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              opacity: 1,
              transition: "opacity 0.3s ease",
            }}>
              <iframe
                src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${project.youtubeId}&rel=0&playsinline=1&modestbranding=1&start=0`}
                title={`${project.title} preview`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => {
                  // Hold the icon a beat past load so it covers the buffer gap,
                  // then fade it as the preview actually becomes visible.
                  dismissTimer.current = setTimeout(() => setPreviewReady(true), 350);
                }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "120%",
                  height: "120%",
                  transform: "translate(-50%, -50%)",
                  border: "none",
                  pointerEvents: "none",
                }}
              />
            </div>
          )}

          {/* Overlay */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            background: hovered
              ? "linear-gradient(to top, rgba(10,14,18,0.75) 0%, rgba(10,14,18,0.1) 50%, transparent 100%)"
              : "linear-gradient(to top, rgba(10,14,18,0.6) 0%, transparent 60%)",
            transition: "background 0.4s ease",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Play button — only shown if video exists */}
            {hasVideo && (
              <div style={{
                width: "52px", height: "52px",
                borderRadius: "50%",
                border: "2px solid rgba(196,163,90,0.8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: hovered && !previewReady ? 1 : 0,
                transform: hovered && !previewReady ? "scale(1)" : "scale(0.8)",
                transition: "all 0.3s ease",
                background: "rgba(10,14,18,0.6)",
              }}>
                <div style={{
                  width: 0, height: 0,
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderLeft: "16px solid #C4A35A",
                  marginLeft: "4px",
                }} />
              </div>
            )}

            {/* Category label bottom-left */}
            <span style={{
              position: "absolute", bottom: "16px", left: "16px",
              fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase",
              color: "#C4A35A", fontFamily: "'DM Mono', monospace",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "none" : "translateY(8px)",
              transition: "all 0.35s ease",
            }}>
              {project.category} — {project.year}
            </span>
          </div>
        </div>

        {/* Text */}
        <div style={{ padding: "16px 4px 0" }}>
          <div style={{
            fontSize: "11px", letterSpacing: "2px", color: "#C4A35A",
            fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: "6px",
          }}>
            {project.client}
          </div>
          <div style={{
            fontSize: "20px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
            color: "#EDE8DF", fontWeight: 700, lineHeight: 1.2, marginBottom: "8px",
          }}>
            {project.title}
          </div>
          <div style={{
            fontSize: "13px", color: "#7A8A8E", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
            maxHeight: hovered ? "60px" : "0", overflow: "hidden",
            transition: "max-height 0.4s ease",
          }}>
            {project.description}
          </div>
          {hasVideo && (
            <div style={{
              marginTop: "8px", fontSize: "9px", letterSpacing: "2px",
              color: "#C4A35A", fontFamily: "'DM Mono', monospace", textTransform: "uppercase",
              opacity: hovered ? 1 : 0, transition: "opacity 0.3s ease",
            }}>
              Watch Film →
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <VideoModal
          youtubeId={project.youtubeId}
          title={project.title}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
