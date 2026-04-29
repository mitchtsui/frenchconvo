import { useState } from "react";
import { speakAs, stopAll } from "../lib/tts.js";
import { tap } from "../lib/haptics.js";
import { noteFor } from "../data/grammarNotes.js";

export function PhrasePill({ text, baseRate = 0.88 }) {
  const note = noteFor(text);
  const [showNote, setShowNote] = useState(false);

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", margin: "3px 4px" }}>
      <span
        className="phrase-pill"
        style={{ margin: 0 }}
        role="button"
        tabIndex={0}
        onClick={() => {
          tap();
          stopAll();
          speakAs({ text, baseRate, prosody: { pitch: 1, rateOffset: 0 } });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            stopAll();
            speakAs({ text, baseRate, prosody: { pitch: 1, rateOffset: 0 } });
          }
        }}
        aria-label={`Lire ${text}`}
      >
        {text}
        {note && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              tap();
              setShowNote((s) => !s);
            }}
            aria-expanded={showNote}
            aria-label="Note de grammaire"
            style={{
              background: "transparent",
              border: "none",
              marginLeft: 6,
              cursor: "pointer",
              fontSize: 12,
              color: "var(--accent)",
              padding: 0,
            }}
          >
            ⓘ
          </button>
        )}
      </span>
      {showNote && note && (
        <span
          style={{
            marginTop: 4,
            padding: "8px 10px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            lineHeight: 1.5,
            color: "var(--text)",
            maxWidth: 320,
          }}
        >
          {note}
        </span>
      )}
    </span>
  );
}
