import { useEffect } from "react";

export default function ImageLightbox({ src, alt, caption, date, onClose }) {
  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handle);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(6,10,13,0.96)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "24px",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>

      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "24px", right: "24px",
          background: "none", border: "1px solid rgba(196,163,90,0.3)",
          color: "#C4A35A", cursor: "pointer",
          width: "40px", height: "40px", fontSize: "18px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        ✕
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "85vh", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: "100%", maxHeight: "75vh", objectFit: "contain",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          }}
        />
        <div style={{
          marginTop: "20px", textAlign: "center", maxWidth: "560px",
        }}>
          {caption && (
            <p style={{
              fontSize: "15px", color: "#EDE8DF", fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.6, marginBottom: "6px",
            }}>
              {caption}
            </p>
          )}
          {date && (
            <p style={{
              fontSize: "10px", letterSpacing: "2px", color: "#C4A35A",
              fontFamily: "'DM Mono', monospace", textTransform: "uppercase",
            }}>
              {date}
            </p>
          )}
        </div>
      </div>

      <p style={{
        marginTop: "16px", fontSize: "10px", letterSpacing: "1px",
        color: "#3A4A50", fontFamily: "'DM Mono', monospace",
      }}>
        Click outside or press ESC to close
      </p>
    </div>
  );
}
