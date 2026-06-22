import { useInView } from "../hooks.js";

function WordReveal({ wordList, baseDelay, inView, color }) {
  return (
    <span>
      {wordList.map((w, i) => (
        <span key={i} style={{
          display: "inline-block",
          marginRight: "0.28em",
          color: color || "inherit",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(18px)",
          transition: `opacity 0.5s ease ${baseDelay + i * 0.045}s, transform 0.5s ease ${baseDelay + i * 0.045}s`,
        }}>
          {w}
        </span>
      ))}
    </span>
  );
}

export default function LifeMottoSection() {
  const [ref, inView] = useInView(0.2);

  const line1 = ["To", "see", "the", "world,", "things", "dangerous", "to", "come", "to,"];
  const line2 = ["to", "see", "behind", "walls,", "draw", "closer,", "to", "find", "each", "other"];
  const line3 = ["and", "to", "feel."];
  const line4 = ["That", "is", "the", "purpose", "of", "life."];

  return (
    <section
      ref={ref}
      style={{
        padding: "100px 24px",
        background: "#060A0D",
        borderTop: "1px solid rgba(196,163,90,0.08)",
        borderBottom: "1px solid rgba(196,163,90,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* LIFE Magazine stamp */}
      <div style={{
        position: "absolute", top: "28px", right: "24px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
        fontSize: "11px", letterSpacing: "6px",
        color: "rgba(196,163,90,0.15)",
        textTransform: "uppercase",
        border: "1px solid rgba(196,163,90,0.1)",
        padding: "5px 10px",
        opacity: inView ? 1 : 0,
        transition: "opacity 1s ease 0.2s",
      }}>
        LIFE Magazine
      </div>

      {/* Rule */}
      <div style={{
        width: inView ? "60px" : "0px", height: "1px",
        background: "#C4A35A", marginBottom: "32px",
        transition: "width 0.8s ease 0.1s",
      }} />

      <div style={{
        fontSize: "9px", letterSpacing: "4px", color: "#C4A35A",
        fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: "28px",
        opacity: inView ? 1 : 0, transition: "opacity 0.6s ease 0.1s",
      }}>
        The Motto
      </div>

      <p style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
        fontSize: "clamp(24px, 7vw, 44px)",
        fontWeight: 700, lineHeight: 1.35,
        color: "#EDE8DF", maxWidth: "560px",
      }}>
        <WordReveal wordList={line1} baseDelay={0.2} inView={inView} />
        <br />
        <WordReveal wordList={line2} baseDelay={0.6} inView={inView} />
        <br />
        <WordReveal wordList={line3} baseDelay={1.05} inView={inView} color="#C4A35A" />
        <br />
        <span style={{ fontSize: "0.75em", fontStyle: "italic", color: "#8FA99A" }}>
          <WordReveal wordList={line4} baseDelay={1.25} inView={inView} color="#8FA99A" />
        </span>
      </p>

      <div style={{
        marginTop: "36px", fontSize: "10px", letterSpacing: "2px",
        color: "#4A5A60", fontFamily: "'DM Mono', monospace", textTransform: "uppercase",
        opacity: inView ? 1 : 0, transition: "opacity 0.8s ease 2s",
        display: "flex", alignItems: "center", gap: "12px",
        flexWrap: "wrap",
      }}>
        <span>The Secret Life of Walter Mitty, 2013</span>
        <span style={{ width: "24px", height: "1px", background: "#4A5A60", display: "inline-block" }} />
        <span style={{ color: "#C4A35A" }}>A personal north star.</span>
      </div>
    </section>
  );
}
