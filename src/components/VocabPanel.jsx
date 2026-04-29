import { useMemo } from "react";
import { extractSessionVocab } from "../lib/vocab.js";
import { speakAs, stopAll } from "../lib/tts.js";
import { tap } from "../lib/haptics.js";

export function VocabPanel({ session, vocab, onMarkKnown, onMarkLearning, baseRate }) {
  const words = useMemo(() => extractSessionVocab(session), [session]);
  if (words.length === 0) return null;
  return (
    <div
      style={{
        marginTop: 12,
        padding: "12px 14px",
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
          marginBottom: 8,
        }}
      >
        Vocabulaire de la session
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {words.map((w) => {
          const status = vocab[w]; // "known" | "learning" | undefined
          return (
            <span
              key={w}
              className="phrase-pill"
              style={{
                opacity: status === "known" ? 0.4 : 1,
                borderColor:
                  status === "learning"
                    ? "var(--accent)"
                    : status === "known"
                      ? "var(--border)"
                      : "var(--border)",
              }}
              onClick={() => {
                tap();
                stopAll();
                speakAs({ text: w, baseRate, prosody: { pitch: 1, rateOffset: 0 } });
              }}
            >
              {w}
              <button
                className="text-button"
                style={{ marginLeft: 6, padding: 0, fontSize: 11, minHeight: 18 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkKnown(w);
                }}
                aria-label={`Je connais ${w}`}
              >
                ✓
              </button>
              <button
                className="text-button"
                style={{ marginLeft: 4, padding: 0, fontSize: 11, minHeight: 18 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkLearning(w);
                }}
                aria-label={`Apprendre ${w}`}
              >
                ★
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
