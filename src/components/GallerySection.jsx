import { useState } from "react";
import { useInView } from "../hooks.js";
import FadeIn from "./FadeIn.jsx";
import ImageLightbox from "./ImageLightbox.jsx";

// No lift, no shadow, no rounded corner — the photograph is the object, and
// anything drawn around it is one more thing competing with it.
function GalleryCard({ item, index, onClick }) {
  const [ref, inView] = useInView(0.08);
  const [hovered, setHovered] = useState(false);
  const stagger = Math.min(index * 0.04, 0.4);

  return (
    <button
      ref={ref}
      onClick={() => onClick(item)}
      aria-label={item.alt || "View photo"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block", padding: 0, border: "none", background: "#EEEAE1",
        position: "relative", overflow: "hidden", aspectRatio: "4/3",
        cursor: "pointer", width: "100%",
        opacity: inView ? (hovered ? 0.86 : 1) : 0,
        transform: inView ? "none" : "translateY(20px)",
        transition: `opacity 0.8s ease ${stagger}s, transform 0.8s ease ${stagger}s`,
      }}
    >
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </button>
  );
}

export default function GallerySection({
  items: rawItems,
  limit = null,
  onSeeMore = null,
  asPage = false,
  onBack = null,
}) {
  const items = Array.isArray(rawItems) ? rawItems : [];
  const [lightboxItem, setLightboxItem] = useState(null);

  const visible = limit ? items.slice(0, limit) : items;
  const hasMore = limit != null && items.length > limit;

  const quietLink = {
    background: "none", border: "none", cursor: "pointer", padding: 0,
    fontFamily: "inherit", fontSize: "17px", color: "#1C1A17",
  };

  return (
    <>
      <section
        id="gallery"
        style={{
          padding: asPage
            ? "clamp(120px, 16vw, 200px) clamp(24px, 6vw, 72px) clamp(96px, 14vw, 176px)"
            : "clamp(96px, 14vw, 176px) clamp(24px, 6vw, 72px)",
          background: "#EEEAE1",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          {asPage && onBack && (
            <button onClick={onBack} style={{ ...quietLink, color: "#9A928A", marginBottom: "36px" }}
              onMouseEnter={e => e.currentTarget.style.color = "#1C1A17"}
              onMouseLeave={e => e.currentTarget.style.color = "#9A928A"}
            >
              ← Portfolio
            </button>
          )}

          <FadeIn>
            <div style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}>
              <div style={{
                fontSize: "13px", letterSpacing: "0.16em", textTransform: "uppercase",
                color: "#9A928A", marginBottom: "18px",
              }}>
                Photographs
              </div>
              <h2 style={{
                fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 400,
                lineHeight: 1.08, letterSpacing: "-0.012em", color: "#1C1A17",
              }}>
                {asPage ? <>Every <em style={{ fontStyle: "italic" }}>frame</em>.</> : <>Selected <em style={{ fontStyle: "italic" }}>frames</em>.</>}
              </h2>
            </div>
          </FadeIn>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: "clamp(12px, 1.6vw, 22px)",
            }}
          >
            {visible.map((item, i) => (
              <GalleryCard key={item.id} item={item} index={i} onClick={setLightboxItem} />
            ))}
          </div>

          {hasMore && onSeeMore && (
            <FadeIn>
              <div style={{ marginTop: "clamp(44px, 6vw, 72px)" }}>
                <button onClick={onSeeMore} style={{
                  ...quietLink,
                  borderBottom: "1px solid rgba(28,26,23,0.25)", paddingBottom: "2px",
                  transition: "border-color 0.3s ease",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#1C1A17"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(28,26,23,0.25)"}
                >
                  See all {items.length} photographs
                </button>
              </div>
            </FadeIn>
          )}
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
