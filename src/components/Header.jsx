import { totalSessions } from "../data/weeks/index.js";

export function HomeHeader({ doneCount, streak }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 2,
        }}
      >
        Cours de français · 9 semaines
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Rafraîchir son français</h1>
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13,
          color: "var(--muted)",
          marginTop: 4,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>
          {doneCount}/{totalSessions} terminés
        </span>
        {streak?.count > 0 && (
          <span
            aria-label={`Streak ${streak.count} jours`}
            title={streak.best > 0 ? `Record : ${streak.best} jours` : undefined}
          >
            🔥 {streak.count} {streak.count === 1 ? "jour" : "jours"}
            {streak.best > streak.count && (
              <span style={{ color: "var(--muted)" }}> · record {streak.best}</span>
            )}
          </span>
        )}
      </div>
      <div className="progress-bar" style={{ marginTop: 10 }}>
        <div
          className="progress-fill"
          style={{ width: `${(doneCount / totalSessions) * 100}%`, background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}

export function WeekHeader({ week, onBack }) {
  return (
    <div>
      <button className="text-button" onClick={onBack} aria-label="Toutes les semaines">
        ← Toutes les semaines
      </button>
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".08em",
          color: week.color,
          textTransform: "uppercase",
          marginTop: 8,
        }}
      >
        Semaine {week.week} · {week.sub}
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700 }}>{week.title}</h2>
    </div>
  );
}

export function PlayerHeader({ week, session, lineIndex, totalLines, onBack, controls }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <button
          className="text-button"
          onClick={onBack}
          aria-label="Retour"
          style={{ fontSize: 18, padding: 8 }}
        >
          ←
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".08em",
              color: week.color,
              textTransform: "uppercase",
            }}
          >
            Semaine {week.week} · {session.day}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{session.title}</div>
        </div>
        {lineIndex >= 0 && (
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "var(--muted)" }}>
            {lineIndex + 1}/{totalLines}
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{controls}</div>
    </div>
  );
}
