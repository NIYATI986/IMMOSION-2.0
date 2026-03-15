// src/pages/EmotionMode.jsx
import { useState } from "react";
import { getEmotionalSupport } from "../utils/emotionResponses";

const EMOTIONS = [
  { key: "happy", label: "Happy", emoji: "😊", color: "#f59e0b" },
  { key: "sad", label: "Sad", emoji: "😔", color: "#60a5fa" },
  { key: "anxious", label: "Anxious", emoji: "😰", color: "#f97316" },
  { key: "motivated", label: "Need Motivation", emoji: "🔥", color: "#8b5cf6" },
  { key: "lonely", label: "Lonely", emoji: "🌙", color: "#a78bfa" },
  { key: "other", label: "Something Else", emoji: "💭", color: "#6ee7b7" },
];

const FEEDBACK_OPTIONS = [
  { key: "yes_lot", label: "Yes, a lot! 🚀" },
  { key: "yes_little", label: "A little 🌱" },
  { key: "neutral", label: "Neutral 😐" },
  { key: "no", label: "Not really 😔" },
];

export default function EmotionMode({ onBack }) {
  const [step, setStep] = useState("choose");
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [customEmotion, setCustomEmotion] = useState("");
  const [supportText, setSupportText] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [experience, setExperience] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  const handleEmotionSelect = async (emotion) => {
    if (emotion.key === "other" && !customEmotion.trim()) return;
    setSelectedEmotion(emotion);
    setStep("loading");
    setError("");
    try {
      const text = await getEmotionalSupport(
        emotion.key,
        emotion.key === "other" ? customEmotion : emotion.label
      );
      setSupportText(text);
      setDisplayedText("");
      setStep("support");
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 18);
    } catch (e) {
      setError("Couldn't connect to Claude. Please check your API key in .env file.");
      setStep("choose");
    }
  };

  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={onBack}>← Back</button>

      {step === "choose" && (
        <div style={styles.container}>
          <div style={styles.badge}>🌸 Emotion Mode</div>
          <h1 style={styles.heading}>How are you feeling?</h1>
          <p style={styles.sub}>Choose your emotion and we'll be right there with you.</p>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.emotionGrid}>
            {EMOTIONS.map((em) => (
              <div
                key={em.key}
                style={{
                  ...styles.emotionCard,
                  borderColor: selectedEmotion?.key === em.key
                    ? em.color : "rgba(255,255,255,0.07)",
                  boxShadow: selectedEmotion?.key === em.key
                    ? `0 0 20px ${em.color}30` : "none",
                }}
                onClick={() => {
                  setSelectedEmotion(em);
                  if (em.key !== "other") handleEmotionSelect(em);
                }}
              >
                <span style={styles.emotionEmoji}>{em.emoji}</span>
                <span style={{ ...styles.emotionLabel, color: em.color }}>
                  {em.label}
                </span>
              </div>
            ))}
          </div>

          {selectedEmotion?.key === "other" && (
            <div style={styles.customBox}>
              <textarea
                style={styles.textarea}
                placeholder="Tell us what you're feeling... we're listening 💙"
                value={customEmotion}
                onChange={(e) => setCustomEmotion(e.target.value)}
                rows={4}
              />
              <button
                style={styles.submitBtn}
                onClick={() => handleEmotionSelect(selectedEmotion)}
                disabled={!customEmotion.trim()}
              >
                Get Support →
              </button>
            </div>
          )}
        </div>
      )}

      {step === "loading" && (
        <div style={styles.loadingBox}>
          <div style={styles.pulse}>🌸</div>
          <p style={styles.loadingText}>Crafting something just for you...</p>
        </div>
      )}

      {step === "support" && (
        <div style={styles.container}>
          <div style={styles.badge}>{selectedEmotion?.emoji} A message for you</div>
          <div style={styles.supportCard}>
            <div style={styles.supportGlow} />
            <p style={styles.supportText}>{displayedText}</p>
            {displayedText.length === supportText.length && (
              <button style={styles.submitBtn} onClick={() => setStep("feedback")}>
                Share your experience →
              </button>
            )}
          </div>
        </div>
      )}

      {step === "feedback" && (
        <div style={styles.container}>
          <div style={styles.badge}>💬 Optional Feedback</div>
          <h2 style={styles.heading}>Did you get your dopamine?</h2>
          <p style={styles.sub}>Your feedback is optional but means a lot to us.</p>

          <div style={styles.feedbackGrid}>
            {FEEDBACK_OPTIONS.map((opt) => (
              <div
                key={opt.key}
                style={{
                  ...styles.feedbackCard,
                  borderColor: feedback === opt.key ? "#8b5cf6" : "rgba(255,255,255,0.07)",
                  background: feedback === opt.key
                    ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.03)",
                }}
                onClick={() => setFeedback(opt.key)}
              >
                {opt.label}
              </div>
            ))}
          </div>

          <textarea
            style={{ ...styles.textarea, marginTop: 24 }}
            placeholder="Want to share your experience? (optional)"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows={3}
          />

          <div style={styles.feedbackActions}>
            <button
              style={{ ...styles.submitBtn, background: "rgba(255,255,255,0.07)" }}
              onClick={() => setStep("done")}
            >
              Skip
            </button>
            <button style={styles.submitBtn} onClick={() => setStep("done")}>
              Submit →
            </button>
          </div>
        </div>
      )}

      {step === "done" && (
        <div style={{ ...styles.container, textAlign: "center" }}>
          <div style={styles.doneEmoji}>✨</div>
          <h2 style={styles.heading}>Take care of yourself</h2>
          <p style={styles.sub}>
            You matter. Come back anytime you need a moment of warmth.
          </p>
          <button style={styles.submitBtn} onClick={onBack}>Back to Home</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", background: "#07070b",
    fontFamily: "'DM Sans', sans-serif",
    display: "flex", alignItems: "center",
    justifyContent: "center", padding: "80px 24px 40px",
    position: "relative",
  },
  back: {
    position: "fixed", top: 24, left: 24,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "rgba(255,255,255,0.6)", borderRadius: 10,
    padding: "8px 16px", cursor: "pointer",
    fontSize: "0.9rem", fontFamily: "'DM Sans', sans-serif",
    zIndex: 10,
  },
  container: { maxWidth: 680, width: "100%", textAlign: "center" },
  badge: {
    display: "inline-block",
    background: "rgba(139,92,246,0.12)",
    border: "1px solid rgba(139,92,246,0.25)",
    color: "#a78bfa", borderRadius: 100,
    padding: "6px 18px", fontSize: "0.8rem",
    letterSpacing: "0.08em", marginBottom: 24,
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
    fontWeight: 700, color: "#fff", marginBottom: 12,
  },
  sub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.95rem", marginBottom: 40,
  },
  error: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171", borderRadius: 12,
    padding: "12px 16px", marginBottom: 24, fontSize: "0.88rem",
  },
  emotionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 14, marginBottom: 24,
  },
  emotionCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: "20px 16px",
    cursor: "pointer", transition: "all 0.2s",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 10,
  },
  emotionEmoji: { fontSize: "2rem" },
  emotionLabel: { fontSize: "0.88rem", fontWeight: 600 },
  customBox: { marginTop: 8, textAlign: "left" },
  textarea: {
    width: "100%", padding: "14px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14, color: "#fff",
    fontSize: "0.95rem", resize: "vertical",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none", boxSizing: "border-box", lineHeight: 1.6,
  },
  submitBtn: {
    marginTop: 16, padding: "12px 28px",
    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    border: "none", borderRadius: 12,
    color: "#fff", fontSize: "0.95rem",
    fontWeight: 600, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  loadingBox: { textAlign: "center" },
  pulse: { fontSize: "3rem", animation: "pulse 1.5s ease-in-out infinite" },
  loadingText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "1.1rem", marginTop: 20, fontStyle: "italic",
  },
  supportCard: {
    position: "relative", overflow: "hidden",
    background: "linear-gradient(145deg, #130d1f, #0f0f15)",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: 24, padding: "40px 36px", textAlign: "left",
  },
  supportGlow: {
    position: "absolute", top: -60, right: -60,
    width: 200, height: 200,
    background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  supportText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "1.05rem", lineHeight: 1.85,
    fontFamily: "'Courier New', Courier, monospace",
    fontStyle: "normal", marginBottom: 28, minHeight: 60,
    letterSpacing: "0.03em",
  },
  feedbackGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12, marginBottom: 8,
  },
  feedbackCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 14, padding: "16px 12px",
    cursor: "pointer", fontSize: "0.9rem",
    color: "rgba(255,255,255,0.7)",
    transition: "all 0.2s", fontWeight: 500,
  },
  feedbackActions: {
    display: "flex", gap: 12,
    justifyContent: "center", marginTop: 16,
  },
  doneEmoji: { fontSize: "4rem", marginBottom: 20 },
};