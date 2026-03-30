import { useInView } from "../hooks.js";

export default function FadeIn({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, inView] = useInView();
  const translateMap = {
    up: "translateY(40px)",
    down: "translateY(-40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : (translateMap[direction] || "translateY(40px)"),
        transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
