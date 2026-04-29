import { memo } from "react";
import { weeks, sessionKey } from "../data/weeks/index.js";
import { PhrasePill } from "./PhrasePill.jsx";
import { characterColor } from "../lib/characterColor.js";
import { tap } from "../lib/haptics.js";

function clampSession(week, sessionIndex) {
  const max = week.sessions.length - 1;
  return Math.max(0, Math.min(sessionIndex, max));
}

export const SessionView = memo(function SessionView({
  weekIndex,
  sessionIndex,
  done,
  onToggleDone,
  onSelectSession,
  onPrevSession,
  onNextSession,
  onPlay,
  baseRate,
}) {
  const week = weeks[weekIndex];
  const session = week.sessions[clampSession(week, sessionIndex)];
  const key = sessionKey(weekIndex, sessionIndex);
  const isDone = !!done[key];
  const isLastInCourse =
    sessionIndex === week.sessions.length - 1 && weekIndex === weeks.length - 1;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px calc(28px + var(--safe-bottom))" }}>
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          overflowX: "auto",
          paddingBottom: 4,
          WebkitOverflowScrolling: "touch",
        }}
      >
        {week.sessions.map((s, i) => (
          <button
            key={i}
            className={`session-pill${i === sessionIndex ? " is-active" : ""}`}
            onClick={() => {
              tap();
              onSelectSession(i);
            }}
          >
            {s.day}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
          gap: 10,
        }}
      >
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{session.title}</h3>
          <div
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              color: "var(--muted)",
              marginTop: 2,
            }}
          >
            {session.focus}
          </div>
        </div>
        <button
          className={`checkbox-circle${isDone ? " is-active" : ""}`}
          onClick={() => {
            tap();
            onToggleDone(key);
          }}
          aria-label={isDone ? "Marquer comme non terminé" : "Marquer comme terminé"}
        >
          {isDone ? "✓" : ""}
        </button>
      </div>

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
        Phrases · taper pour entendre
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 16 }}>
        {session.phrases.map((p, i) => (
          <PhrasePill key={i} text={p} baseRate={baseRate} />
        ))}
      </div>

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
        Aperçu · {session.lines.length} lignes
      </div>
      <div
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          background: "var(--card)",
          border: "1px solid var(--border)",
          marginBottom: 18,
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {session.lines.slice(0, 3).map((l, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <strong style={{ color: characterColor(l.character), fontSize: 11 }}>
              {l.character}
            </strong>{" "}
            <span style={{ color: "var(--text)" }}>{l.fr}</span>
            <br />
            <span style={{ color: "var(--muted)", fontSize: 12 }}>{l.en}</span>
          </div>
        ))}
        <div style={{ color: "var(--muted)", fontSize: 12, opacity: 0.6 }}>
          … {session.lines.length - 3} lignes de plus
        </div>
      </div>

      <button className="cta-button" onClick={onPlay}>
        ▶ Lire le dialogue
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 18,
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 14,
        }}
      >
        <button
          className="text-button"
          disabled={sessionIndex === 0 && weekIndex === 0}
          onClick={onPrevSession}
          style={{ color: "var(--accent)" }}
        >
          ← Précédent
        </button>
        <button
          className="text-button"
          disabled={isLastInCourse}
          onClick={onNextSession}
          style={{ color: isLastInCourse ? "var(--border)" : "var(--accent)" }}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
});
