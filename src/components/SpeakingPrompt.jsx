import { useEffect, useRef, useState } from "react";
import { isSpeechRecognitionAvailable, recognizeFrench } from "../lib/speechRecognition.js";
import { isMatch, similarity } from "../lib/speechMatch.js";
import { pulse, tap } from "../lib/haptics.js";

export function SpeakingPrompt({ target, onPass, onSkip, autoStart = true }) {
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(0);
  const startedRef = useRef(false);

  const start = async () => {
    if (status === "listening") return;
    if (!isSpeechRecognitionAvailable()) {
      setStatus("unsupported");
      return;
    }
    setStatus("listening");
    setTranscript("");
    const result = await recognizeFrench({ timeoutMs: 7000 });
    if (result == null) {
      setStatus("idle");
      return;
    }
    setTranscript(result);
    const sim = similarity(result, target);
    setScore(sim);
    if (isMatch(result, target)) {
      pulse();
      setStatus("pass");
      setTimeout(() => onPass?.(), 600);
    } else {
      setStatus("fail");
    }
  };

  useEffect(() => {
    if (!autoStart) return;
    if (startedRef.current) return;
    startedRef.current = true;
    const t = setTimeout(start, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        marginTop: 6,
        padding: "10px 12px",
        borderRadius: 10,
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "var(--accent)",
          marginBottom: 6,
        }}
      >
        🎤 À vous — dites cette phrase
      </div>
      <div style={{ fontSize: 14, marginBottom: 8 }}>{target}</div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button
          className="chip"
          onClick={() => {
            tap();
            start();
          }}
          disabled={status === "listening"}
          aria-pressed={status === "listening"}
        >
          {status === "listening" ? "🔴 …écoute" : "🎤 Parler"}
        </button>
        <button
          className="chip"
          onClick={() => {
            tap();
            onSkip?.();
          }}
        >
          Passer
        </button>
        {status === "pass" && <span style={{ color: "var(--accent)", fontSize: 13 }}>✓ Bravo</span>}
        {status === "fail" && (
          <span style={{ color: "var(--error)", fontSize: 13 }}>
            Pas tout à fait ({Math.round(score * 100)}%)
          </span>
        )}
        {status === "unsupported" && (
          <span style={{ color: "var(--muted)", fontSize: 12 }}>
            Reconnaissance vocale indisponible
          </span>
        )}
      </div>
      {transcript && (
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
          Vous avez dit : <em>{transcript}</em>
        </div>
      )}
    </div>
  );
}
