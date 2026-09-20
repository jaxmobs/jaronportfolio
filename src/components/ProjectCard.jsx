import { useState, useEffect, useRef } from "react";
import { useInView } from "../hooks.js";
import VideoModal from "./VideoModal.jsx";

export default function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dismissTimer = useRef(null);
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch(window.matchMedia("(pointer: coarse)").matches); }, []);
  const [ref, inView] = useInView(0.1);
  const hasVideo = !!project.youtubeId;

  useEffect(() => () => { if (dismissTimer.current) clearTimeout(dismissTimer.current); }, []);

  return (
    <>
      <figure
        ref={ref}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(28px)",
          transition: `opacity 0.9s ease ${index * 0.08}s, transform 0.9s ease ${index * 0.08}s`,
          margin: 0,
          cursor: hasVideo ? "pointer" : "default",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
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
        {/* The frame carries nothing but the image — no scrim, no label on top. */}
        <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/9", background: "#EEEAE1" }}>
          <img
            src={project.thumb}
            alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />

          {hasVideo && hovered && !isTouch && (
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
              <iframe
                src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${project.youtubeId}&rel=0&playsinline=1&modestbranding=1&start=0`}
                title={`${project.title} preview`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: "120%", height: "120%",
                  transform: "translate(-50%, -50%)",
                  border: "none", pointerEvents: "none",
                }}
              />
            </div>
          )}
        </div>

        {/* Caption sits under the frame, the way a print would be labelled. */}
        <figcaption style={{
          display: "flex", flexWrap: "wrap", alignItems: "baseline",
          gap: "8px 20px", marginTop: "22px",
        }}>
          <h3 style={{
            fontSize: "clamp(22px, 2.4vw, 30px)", fontWeight: 400,
            lineHeight: 1.2, letterSpacing: "-0.01em", color: "#1C1A17",
            margin: 0,
          }}>
            {project.title}
          </h3>
          <span style={{ fontSize: "15px", color: "#9A928A", fontStyle: "italic" }}>
            {project.client} · {project.category} · {project.year}
          </span>

          <p style={{
            flexBasis: "100%", margin: "10px 0 0",
            fontSize: "17px", lineHeight: 1.62, color: "#57514A", maxWidth: "36em",
          }}>
            {project.description}
          </p>

          {hasVideo && (
            <span style={{
              flexBasis: "100%", marginTop: "12px",
              fontSize: "16px", color: "#1C1A17",
              borderBottom: `1px solid ${hovered ? "#1C1A17" : "rgba(28,26,23,0.25)"}`,
              paddingBottom: "2px", alignSelf: "flex-start",
              width: "fit-content", transition: "border-color 0.3s ease",
            }}>
              Watch the film
            </span>
          )}
        </figcaption>
      </figure>

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
