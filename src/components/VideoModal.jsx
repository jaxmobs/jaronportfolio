import { useEffect } from "react";

export default function VideoModal({ youtubeId, title, onClose }) {
  // Close on Escape key
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

      {/* Header */}
      <div style={{
        width: "100%", maxWidth: "800px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "16px",
      }}>
        <span style={{
          fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
          color: "#C4A35A", fontFamily: "'DM Mono', monospace",
        }}>
          {title}
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "1px solid rgba(196,163,90,0.3)",
            color: "#C4A35A", cursor: "pointer",
            width: "32px", height: "32px", fontSize: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      {/* Iframe — stop click propagation so clicking video doesn't close modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: "800px", aspectRatio: "16/9", background: "#000" }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </div>

      <p style={{
        marginTop: "12px", fontSize: "10px", letterSpacing: "1px",
        color: "#3A4A50", fontFamily: "'DM Mono', monospace",
      }}>
        Click outside or press ESC to close
      </p>
    </div>
  );
}
