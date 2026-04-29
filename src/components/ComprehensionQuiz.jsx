import { useState } from "react";
import { tap, pulse } from "../lib/haptics.js";

export function ComprehensionQuiz({ questions, onComplete }) {
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = questions[pos];

  const choose = (i) => {
    if (picked != null) return;
    tap();
    setPicked(i);
    if (i === q.correctIndex) {
      pulse();
      setScore((s) => s + 1);
    }
    setTimeout(() => {
      if (pos + 1 < questions.length) {
        setPos(pos + 1);
        setPicked(null);
      } else {
        setDone(true);
        onComplete?.(score + (i === q.correctIndex ? 1 : 0), questions.length);
      }
    }, 800);
  };

  if (questions.length === 0) return null;

  if (done) {
    return (
      <div
        style={{
          marginTop: 12,
          padding: "14px 16px",
          borderRadius: 10,
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Compréhension : {score}/{questions.length}</div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          {score === questions.length
            ? "Parfait ! Vous avez tout compris."
            : "Pas mal. Réécoutez les passages clés et essayez encore."}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 12,
        padding: "14px 16px",
        borderRadius: 10,
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 6,
        }}
      >
        Compréhension · {pos + 1}/{questions.length}
      </div>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>{q.prompt}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = picked != null && i === q.correctIndex;
          const isWrong = isPicked && i !== q.correctIndex;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              className="chip"
              style={{
                width: "100%",
                justifyContent: "flex-start",
                padding: "12px 14px",
                background: isCorrect
                  ? "var(--accent)"
                  : isWrong
                    ? "var(--error)"
                    : "var(--card)",
                color: isCorrect || isWrong ? "#fff" : "var(--text)",
                borderColor: isCorrect ? "var(--accent)" : isWrong ? "var(--error)" : "var(--border)",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
