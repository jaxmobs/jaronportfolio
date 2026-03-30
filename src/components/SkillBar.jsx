import { useInView } from "../hooks.js";

export default function SkillBar({ label, value, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{
          fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
          color: "#7A8A8E", fontFamily: "'DM Mono', monospace",
        }}>
          {label}
        </span>
        <span style={{ fontSize: "11px", color: "#C4A35A", fontFamily: "'DM Mono', monospace" }}>
          {value}%
        </span>
      </div>
      <div style={{ height: "2px", background: "#1E2832", position: "relative" }}>
        <div style={{
          position: "absolute", top: 0, left: 0, height: "100%",
          width: inView ? `${value}%` : "0%",
          background: "linear-gradient(90deg, #C4A35A, #8FA99A)",
          transition: `width 1.2s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`,
        }} />
      </div>
    </div>
  );
}
