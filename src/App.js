// src/App.js
import { useState } from "react";
import { AuthProvider } from "./hooks/useAuth";
import Landing from "./pages/Landing";
import EmotionMode from "./pages/EmotionMode";
import TypingMode from "./pages/TypingMode";

export default function App() {
  const [mode, setMode] = useState("landing");

  return (
    <AuthProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #07070b; }

        input::placeholder, textarea::placeholder {
          color: rgba(255,255,255,0.25);
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #07070b; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 3px; }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
      `}</style>

      {mode === "landing" && <Landing onSelect={setMode} />}
      {mode === "emotion" && <EmotionMode onBack={() => setMode("landing")} />}
      {mode === "typing" && <TypingMode onBack={() => setMode("landing")} />}
    </AuthProvider>
  );
}