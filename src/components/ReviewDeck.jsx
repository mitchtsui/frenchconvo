import { useMemo, useState } from "react";
import { dueCards, review } from "../lib/srs.js";
import { speakAs, stopAll } from "../lib/tts.js";
import { tap } from "../lib/haptics.js";

export function ReviewDeck({ deck, onUpdateDeck, onClose, baseRate }) {
  const due = useMemo(() => dueCards(deck), [deck]);
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (due.length === 0) {
    return (
      <div style={{ padding: "calc(20px + var(--safe-top)) 20px 20px" }}>
        <button className="text-button" onClick={onClose}>
          ←
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 12 }}>Révision du jour</h2>
        <p style={{ marginTop: 12, color: "var(--muted)" }}>
          Rien à réviser pour le moment. Terminez d'autres sessions pour ajouter des phrases à
          votre file.
        </p>
      </div>
    );
  }

  const card = due[pos];
  const phrase = card.id;

  const grade = (quality) => {
    const next = review(card, quality);
    const newDeck = { ...deck, [card.id]: next };
    onUpdateDeck(newDeck);
    stopAll();
    setRevealed(false);
    if (pos + 1 < due.length) setPos(pos + 1);
    else onClose?.();
  };

  return (
    <div
      style={{
        padding: "calc(20px + var(--safe-top)) 20px calc(20px + var(--safe-bottom))",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="text-button" onClick={onClose}>
          ← Retour
        </button>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>
          {pos + 1} / {due.length}
        </span>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 12 }}>Révision du jour</h2>
      <div
        style={{
          marginTop: 24,
          padding: 24,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{phrase}</div>
        <button
          className="chip"
          onClick={() => {
            tap();
            speakAs({ text: phrase, baseRate, prosody: { pitch: 1, rateOffset: 0 } });
          }}
          aria-label="Écouter"
        >
          🔊 Écouter
        </button>
        <div style={{ marginTop: 24, color: "var(--muted)", fontSize: 13 }}>
          {revealed ? (
            <span style={{ color: "var(--text)" }}>
              Vous l'avez vue {card.reps} fois · prochaine échéance dans {card.interval} jour(s)
            </span>
          ) : (
            <button
              className="text-button"
              onClick={() => {
                tap();
                setRevealed(true);
              }}
              style={{ color: "var(--accent)" }}
            >
              Toucher pour révéler
            </button>
          )}
        </div>
      </div>
      {revealed && (
        <div style={{ marginTop: 18, display: "flex", gap: 8, justifyContent: "space-between" }}>
          <button className="chip" onClick={() => grade(0)}>
            Encore
          </button>
          <button className="chip" onClick={() => grade(1)}>
            Difficile
          </button>
          <button className="chip" onClick={() => grade(2)}>
            Bien
          </button>
          <button className="chip is-active" onClick={() => grade(3)}>
            Facile
          </button>
        </div>
      )}
    </div>
  );
}
