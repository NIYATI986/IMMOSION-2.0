// src/pages/TypingMode.jsx
import { useState, useEffect, useRef } from "react";
import { getRandomParagraph } from "../utils/typingParagraphs";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../hooks/useAuth";

const TIMER_DURATION = 30;

export default function TypingMode({ onBack }) {
  const { user } = useAuth();
  const [currentParagraph, setCurrentParagraph] = useState("");
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showAuth, setShowAuth] = useState(false);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const lastParagraphRef = useRef("");
  const attemptsRef = useRef(0);
  const typedRef = useRef("");
  const currentParagraphRef = useRef("");
  const totalTypedRef = useRef("");
  const totalCorrectRef = useRef(0);
  const totalCharsRef = useRef(0);
  const timeLeftRef = useRef(TIMER_DURATION);
  const startedRef = useRef(false);

  const loadNewParagraph = () => {
    const text = getRandomParagraph(lastParagraphRef.current);
    lastParagraphRef.current = text;
    currentParagraphRef.current = text;
    setCurrentParagraph(text);
    setTyped("");
    typedRef.current = "";
  };

  useEffect(() => {
    loadNewParagraph();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const finishTest = () => {
    clearInterval(timerRef.current);

    const elapsed = TIMER_DURATION - timeLeftRef.current || 1;
    const currentTyped = typedRef.current;
    const currentPara = currentParagraphRef.current;

    let correct = 0;
    for (let i = 0; i < currentTyped.length; i++) {
      if (currentTyped[i] === currentPara[i]) correct++;
    }

    const allTyped = totalTypedRef.current + " " + currentTyped;
    const words = allTyped.trim().split(/\s+/).filter(Boolean);
    const wpm = Math.round((words.length / elapsed) * 60);
    const allCorrect = totalCorrectRef.current + correct;
    const allChars = totalCharsRef.current + currentTyped.length;
    const accuracy = allChars > 0 ? Math.round((allCorrect / allChars) * 100) : 0;

    attemptsRef.current = attemptsRef.current + 1;
    setAttempts(attemptsRef.current);
    startedRef.current = false;
    setStarted(false);
    setFinished(true);
    setResults({ wpm, accuracy, wordsTyped: words.length });
  };

  // Timer using pure ref-based interval
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      timeLeftRef.current = timeLeftRef.current - 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearInterval(timerRef.current);
        finishTest();
      }
    }, 1000);
  };

  const handleInput = (e) => {
    const val = e.target.value;
    if (finished) return;

    // Start timer only on first keystroke
    if (!startedRef.current && val.length > 0) {
      startedRef.current = true;
      setStarted(true);
      startTimer();
    }

    const para = currentParagraphRef.current;

    // Paragraph completed — load next
    if (val.length >= para.length) {
      let correct = 0;
      for (let i = 0; i < para.length; i++) {
        if (val[i] === para[i]) correct++;
      }
      totalCorrectRef.current += correct;
      totalCharsRef.current += para.length;
      totalTypedRef.current += " " + val;
      loadNewParagraph();
      return;
    }

    typedRef.current = val;
    setTyped(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (finished) {
        if (!user && attemptsRef.current >= 3) {
          setShowAuth(true);
        } else {
          handleRestart();
        }
      } else if (startedRef.current) {
        finishTest();
      }
    }
  };

  const handleRestart = () => {
    if (!user && attemptsRef.current >= 3) {
      setShowAuth(true);
      return;
    }
    clearInterval(timerRef.current);
    typedRef.current = "";
    timeLeftRef.current = TIMER_DURATION;
    startedRef.current = false;
    totalTypedRef.current = "";
    totalCorrectRef.current = 0;
    totalCharsRef.current = 0;
    setTyped("");
    setTimeLeft(TIMER_DURATION);
    setStarted(false);
    setFinished(false);
    setResults(null);
    loadNewParagraph();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const renderParagraph = () => {
    return currentParagraph.split("").map((char, i) => {
      let color = "rgba(255,255,255,0.2)";
      if (i < typed.length) {
        color = typed[i] === char ? "#4ade80" : "#f87171";
      } else if (i === typed.length) {
        color = "#fff";
      }
      return (
        <span key={i} style={{
          color,
          borderBottom: i === typed.length ? "2px solid #a78bfa" : "none",
          transition: "color 0.05s",
        }}>
          {char}
        </span>
      );
    });
  };

  const timerPercent = (timeLeft / TIMER_DURATION) * 100;
  const timerColor = timeLeft > 15 ? "#4ade80" : timeLeft > 7 ? "#f59e0b" : "#f87171";

  return (
    <div style={styles.page}>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      <button style={styles.back} onClick={onBack}>← Back</button>

      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.badge}>⌨️ Typing Mode</div>
          {!user && (
  <div style={styles.attemptBadge}>
    {Math.max(0, 3 - attempts)} free attempts left
  </div>
)}
        </div>

        {/* Timer Ring */}
        <div style={styles.timerWrap}>
          <svg width="90" height="90" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="45" cy="45" r="38" fill="none"
              stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle cx="45" cy="45" r="38" fill="none"
              stroke={timerColor} strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 38}`}
              strokeDashoffset={`${2 * Math.PI * 38 * (1 - timerPercent / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
            />
          </svg>
          <div style={{ ...styles.timerNum, color: timerColor }}>{timeLeft}</div>
        </div>

        {/* Paragraph */}
        <div style={styles.paragraphBox} onClick={() => inputRef.current?.focus()}>
          <p style={styles.paragraph}>{renderParagraph()}</p>
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          style={styles.hiddenInput}
          value={typed}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={finished}
          autoFocus
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {!started && !finished && (
          <p style={styles.hint}>Start typing to begin · Enter to stop & see results</p>
        )}
        {started && !finished && (
          <p style={styles.hint}>Keep going! · Press Enter to stop early</p>
        )}

        {/* Results */}
        {finished && results && (
          <div style={styles.resultsBox}>
            <h2 style={styles.resultsTitle}>Your Results</h2>
            <div style={styles.stats}>
              <div style={styles.stat}>
                <div style={{ ...styles.statNum, color: "#4ade80" }}>{results.wpm}</div>
                <div style={styles.statLabel}>WPM</div>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <div style={{ ...styles.statNum, color: "#a78bfa" }}>{results.accuracy}%</div>
                <div style={styles.statLabel}>Accuracy</div>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.stat}>
                <div style={{ ...styles.statNum, color: "#60a5fa" }}>{results.wordsTyped}</div>
                <div style={styles.statLabel}>Words</div>
              </div>
            </div>
            <div style={styles.ratingBox}>
              {results.wpm < 30 && "🌱 Keep practicing — consistency is key!"}
              {results.wpm >= 30 && results.wpm < 50 && "⚡ Good pace! You're building momentum."}
              {results.wpm >= 50 && results.wpm < 70 && "🔥 Great speed! You're above average."}
              {results.wpm >= 70 && results.wpm < 90 && "🚀 Excellent! You're a fast typist."}
              {results.wpm >= 90 && "🏆 Outstanding! You're in the top tier."}
            </div>
            {!user && attemptsRef.current >= 3 ? (
              <button style={styles.restartBtn} onClick={() => setShowAuth(true)}>
                Sign Up to Continue →
              </button>
            ) : (
              <button style={styles.restartBtn} onClick={handleRestart}>
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
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
  container: { maxWidth: 760, width: "100%", textAlign: "center" },
  header: {
    display: "flex", justifyContent: "center",
    alignItems: "center", gap: 12, marginBottom: 32, flexWrap: "wrap",
  },
  badge: {
    background: "rgba(139,92,246,0.12)",
    border: "1px solid rgba(139,92,246,0.25)",
    color: "#a78bfa", borderRadius: 100,
    padding: "6px 18px", fontSize: "0.8rem", letterSpacing: "0.08em",
  },
  attemptBadge: {
    background: "rgba(251,191,36,0.1)",
    border: "1px solid rgba(251,191,36,0.25)",
    color: "#fbbf24", borderRadius: 100,
    padding: "6px 16px", fontSize: "0.78rem",
  },
  timerWrap: {
    position: "relative", width: 90, height: 90, margin: "0 auto 32px",
  },
  timerNum: {
    position: "absolute", inset: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.5rem", fontWeight: 700,
    fontFamily: "'Playfair Display', serif",
  },
  paragraphBox: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20, padding: "32px 36px",
    cursor: "text", marginBottom: 16, textAlign: "left",
  },
  paragraph: {
    fontSize: "1.1rem", lineHeight: 1.9,
    letterSpacing: "0.01em",
    fontFamily: "'DM Mono', 'Courier New', monospace",
    margin: 0, wordBreak: "break-word", whiteSpace: "pre-wrap",
  },
  hiddenInput: {
    position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1,
  },
  hint: {
    color: "rgba(255,255,255,0.2)",
    fontSize: "0.82rem", letterSpacing: "0.06em", marginTop: 8,
  },
  resultsBox: {
    marginTop: 32,
    background: "linear-gradient(145deg, #130d1f, #0f0f15)",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: 24, padding: "36px 32px",
  },
  resultsTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.6rem", color: "#fff", marginBottom: 28,
  },
  stats: {
    display: "flex", justifyContent: "center",
    alignItems: "center", marginBottom: 24,
  },
  stat: { flex: 1, textAlign: "center" },
  statNum: {
    fontSize: "2.8rem", fontWeight: 800,
    fontFamily: "'Playfair Display', serif", lineHeight: 1,
  },
  statLabel: {
    color: "rgba(255,255,255,0.3)",
    fontSize: "0.78rem", letterSpacing: "0.12em",
    textTransform: "uppercase", marginTop: 6,
  },
  statDivider: {
    width: 1, height: 60,
    background: "rgba(255,255,255,0.07)", margin: "0 8px",
  },
  ratingBox: {
    color: "rgba(255,255,255,0.55)", fontSize: "0.95rem",
    marginBottom: 24, padding: "14px 20px",
    background: "rgba(255,255,255,0.03)", borderRadius: 12,
  },
  restartBtn: {
    padding: "12px 32px",
    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    border: "none", borderRadius: 12,
    color: "#fff", fontSize: "0.95rem",
    fontWeight: 600, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
};