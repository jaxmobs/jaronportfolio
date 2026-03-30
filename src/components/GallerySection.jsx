import { useState, useEffect } from "react";
import { useInView } from "../hooks.js";
import FadeIn from "./FadeIn.jsx";
import ImageLightbox from "./ImageLightbox.jsx";

function GalleryCard({ item, index, onClick }) {
  const [ref, inView] = useInView(0.08);
  const [ready, setReady] = useState(false);
  const stagger = Math.min(index * 0.03, 0.45);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setReady(true), (stagger + 0.55) * 1000);
    return () => clearTimeout(t);
  }, [inView, stagger]);

  return (
    <div
      ref={ref}
      onClick={() => onClick(item)}
      style={{
        position: "relative",
        overflow: "hidden",
        aspectRatio: "4/3",
        cursor: "pointer",
        borderRadius: "6px",
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, opacity 0.55s ease",
        transitionDelay: ready ? "0s" : inView ? `${stagger}s` : "0s",
        transform: inView ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
        opacity: inView ? 1 : 0,
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
      onMouseEnter={(e) => {
        if (!inView) return;
        e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(196,163,90,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = inView ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.25)";
      }}
    >
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

export default function GallerySection({ items: rawItems }) {
  const items = Array.isArray(rawItems) ? rawItems : [];
  const [lightboxItem, setLightboxItem] = useState(null);

  return (
    <>
      <section
        id="gallery"
        style={{
          padding: "80px 24px 80px",
          background: "#0D1218",
          borderTop: "1px solid rgba(196,163,90,0.08)",
          position: "relative",
        }}
      >
        <FadeIn>
          <div style={{ marginBottom: "40px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "4px", textTransform: "uppercase", color: "#C4A35A", fontFamily: "'DM Mono', monospace", marginBottom: "12px" }}>
              Still Frames
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 8vw, 48px)", fontWeight: 700, lineHeight: 1.1, color: "#EDE8DF" }}>
              From the field.
            </h2>
          </div>
        </FadeIn>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {items.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={i}
              onClick={setLightboxItem}
            />
          ))}
        </div>
      </section>

      {lightboxItem && (
        <ImageLightbox
          src={lightboxItem.src}
          alt={lightboxItem.alt}
          caption={lightboxItem.caption}
          date={lightboxItem.date}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </>
  );
}
