import { memo } from "react";
import { weeks } from "../data/weeks/index.js";
import { sessionKey } from "../data/weeks/index.js";

function weekProgress(weekIndex, week, done) {
  const total = week.sessions.length;
  const completed = week.sessions.filter((_, j) => done[sessionKey(weekIndex, j)]).length;
  return { completed, total };
}

export const WeekList = memo(function WeekList({ done, onSelectWeek }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px calc(28px + var(--safe-bottom))" }}>
      {weeks.map((week, i) => {
        const progress = weekProgress(i, week, done);
        return (
          <div
            key={i}
            className="week-card"
            style={{ marginBottom: 10 }}
            onClick={() => onSelectWeek(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onSelectWeek(i);
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: week.color,
                  }}
                >
                  Semaine {week.week} · {week.level}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{week.title}</div>
                <div
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    color: "var(--muted)",
                  }}
                >
                  {week.sub}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11,
                    color: "var(--muted)",
                  }}
                >
                  {progress.completed}/{progress.total}
                </div>
                <div className="progress-bar" style={{ width: 50, marginTop: 4 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(progress.completed / progress.total) * 100}%`,
                      background: week.color,
                    }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {week.sessions.map((session, si) => {
                const isDone = done[sessionKey(i, si)];
                return (
                  <div
                    key={si}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      fontSize: 10,
                      fontFamily: "'DM Sans',sans-serif",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isDone ? week.color : "transparent",
                      color: isDone ? "#fff" : "var(--muted)",
                      border: `1.5px solid ${isDone ? week.color : "var(--border)"}`,
                    }}
                    aria-label={`${session.day}${isDone ? " terminé" : ""}`}
                  >
                    {session.day.charAt(0)}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});
