// src/components/AuthModal.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AuthModal({ onClose }) {
  const { signup, login } = useAuth();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/ \(auth.*\)\.?/, ""));
    }
    setLoading(false);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.glow} />
        <h2 style={styles.title}>
          {isLogin ? "Welcome back" : "Join FlowType"}
        </h2>
        <p style={styles.subtitle}>
          {isLogin
            ? "Sign in to continue your journey"
            : "You've used 3 free attempts — create an account to keep going"}
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          style={styles.input}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
        </button>

        <p style={styles.toggle}>
          {isLogin ? "New here? " : "Already have an account? "}
          <span style={styles.toggleLink} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    background: "#0f0f13",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "48px 40px",
    width: "100%", maxWidth: "420px",
    overflow: "hidden",
  },
  glow: {
    position: "absolute", top: -60, right: -60,
    width: 200, height: 200,
    background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem", fontWeight: 700,
    color: "#fff", marginBottom: 8, textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.45)",
    fontSize: "0.875rem", textAlign: "center",
    marginBottom: 32, lineHeight: 1.6,
  },
  error: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171", borderRadius: 10,
    padding: "10px 14px", fontSize: "0.85rem", marginBottom: 16,
  },
  input: {
    width: "100%", padding: "14px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12, color: "#fff",
    fontSize: "0.95rem", marginBottom: 12,
    outline: "none", boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    width: "100%", padding: "14px",
    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    border: "none", borderRadius: 12,
    color: "#fff", fontSize: "1rem",
    fontWeight: 600, cursor: "pointer",
    marginTop: 8, fontFamily: "'DM Sans', sans-serif",
  },
  toggle: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.85rem", textAlign: "center", marginTop: 20,
  },
  toggleLink: {
    color: "#a78bfa", cursor: "pointer", textDecoration: "underline",
  },
};