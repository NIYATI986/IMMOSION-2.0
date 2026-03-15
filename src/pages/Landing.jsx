// src/pages/Landing.jsx
import { useEffect, useRef } from "react";

export default function Landing({ onSelect }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={styles.page}>
      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={styles.content}>
        <div style={styles.badge}>✦ Feel & Flow</div>
        <h1 style={styles.heading}>
          <span style={styles.headingLight}>Flow</span>
          <span style={styles.headingAccent}>Type</span>
        </h1>
        <p style={styles.tagline}>
          Two paths. One moment. Choose yours.
        </p>

        <div style={styles.cards}>
          <div
            style={{ ...styles.card, ...styles.cardEmotion }}
            onClick={() => onSelect("emotion")}
          >
            <div style={styles.cardGlow} />
            <div style={styles.cardIcon}>🌸</div>
            <h2 style={styles.cardTitle}>Emotion Mode</h2>
            <p style={styles.cardDesc}>
              Tell us how you feel. Receive a handcrafted message of support,
              motivation, and warmth — uniquely yours, every time.
            </p>
            <div style={styles.cardArrow}>→</div>
          </div>

          <div
            style={{ ...styles.card, ...styles.cardTyping }}
            onClick={() => onSelect("typing")}
          >
            <div style={{ ...styles.cardGlow, ...styles.cardGlowBlue }} />
            <div style={styles.cardIcon}>⌨️</div>
            <h2 style={styles.cardTitle}>Typing Mode</h2>
            <p style={styles.cardDesc}>
              30 seconds. Every keystroke counts. Discover your WPM, sharpen
              your accuracy, and feel the rhythm of your fingers.
            </p>
            <div style={styles.cardArrow}>→</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", background: "#07070b",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif", overflow: "hidden",
    position: "relative",
  },
  canvas: {
    position: "absolute", inset: 0, pointerEvents: "none",
  },
  content: {
    position: "relative", zIndex: 1,
    textAlign: "center", padding: "0 24px",
    maxWidth: 900, width: "100%",
  },
  badge: {
    display: "inline-block",
    background: "rgba(139,92,246,0.15)",
    border: "1px solid rgba(139,92,246,0.3)",
    color: "#a78bfa", borderRadius: 100,
    padding: "6px 18px", fontSize: "0.8rem",
    letterSpacing: "0.1em", marginBottom: 28,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: "clamp(3.5rem, 10vw, 7rem)",
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700, lineHeight: 1,
    margin: "0 0 20px",
  },
  headingLight: { color: "rgba(255,255,255,0.9)" },
  headingAccent: {
    color: "transparent",
    WebkitTextStroke: "2px rgba(139,92,246,0.8)",
  },
  tagline: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "1.1rem", marginBottom: 56,
    letterSpacing: "0.05em",
  },
  cards: {
    display: "flex", gap: 24,
    justifyContent: "center", flexWrap: "wrap",
  },
  card: {
    position: "relative", overflow: "hidden",
    width: 320, padding: "40px 32px",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.07)",
    cursor: "pointer", textAlign: "left",
    transition: "transform 0.25s, border-color 0.25s",
  },
  cardEmotion: {
    background: "linear-gradient(145deg, #130d1f, #0f0f15)",
  },
  cardTyping: {
    background: "linear-gradient(145deg, #0d131f, #0f0f15)",
  },
  cardGlow: {
    position: "absolute", top: -40, right: -40,
    width: 140, height: 140,
    background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  cardGlowBlue: {
    background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
  },
  cardIcon: { fontSize: "2.5rem", marginBottom: 20 },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.5rem", fontWeight: 700,
    color: "#fff", marginBottom: 12,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.45)",
    fontSize: "0.9rem", lineHeight: 1.7,
    marginBottom: 24,
  },
  cardArrow: {
    color: "#a78bfa", fontSize: "1.4rem",
  },
};