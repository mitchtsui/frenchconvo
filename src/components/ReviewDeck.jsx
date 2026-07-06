import { useState } from "react";
import { reviewQueue, review } from "../lib/srs.js";
import { normalizeFrench } from "../lib/speechMatch.js";
import { speakAs, stopAll } from "../lib/tts.js";
import { tap } from "../lib/haptics.js";

// Wrap occurrences of `word` inside a French sentence with a highlight, matching
// on normalized (accent/case/punctuation-insensitive) word tokens.
function highlightWord(sentence, word) {
  const target = normalizeFrench(word);
  if (!target) return sentence;
  return sentence.split(/(\s+)/).map((part, i) => {
    // Elisions normalize to multiple tokens ("l'hôtel" → "l hotel"), so match
    // the word against any sub-token of the part.
    if (normalizeFrench(part).split(" ").includes(target)) {
      return (
        <mark
          key={i}
          style={{ background: "transparent", color: "var(--accent)", fontWeight: 700 }}
        >
          {part}
        </mark>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const speakFrench = (text, baseRate) =>
  speakAs({ text, baseRate, prosody: { pitch: 1, rateOffset: 0 } });

export function ReviewDeck({ deck, onUpdateDeck, onClose, baseRate }) {
  // Freeze the batch for this visit so grading (which reschedules cards) does
  // not reshuffle the queue mid-session.
  const [{ cards, remaining }] = useState(() => reviewQueue(deck));
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  if (cards.length === 0) {
    return (
      <div style={{ padding: "calc(20px + var(--safe-top)) 20px 20px" }}>
        <button className="text-button" onClick={onClose}>
          ←
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 12 }}>Révision du jour</h2>
        <p style={{ marginTop: 12, color: "var(--muted)" }}>
          {"Rien à réviser pour le moment. Terminez d'autres sessions pour ajouter des phrases à votre file."}
        </p>
      </div>
    );
  }

  if (finished) {
    return (
      <div style={{ padding: "calc(20px + var(--safe-top)) 20px 20px" }}>
        <button className="text-button" onClick={onClose}>
          ←
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 12 }}>Révision terminée</h2>
        <p style={{ marginTop: 12, color: "var(--muted)" }}>
          {remaining > 0
            ? `Bravo ! +${remaining} ${remaining === 1 ? "autre" : "autres"} en attente pour plus tard.`
            : "Bravo ! Vous avez tout revu pour aujourd'hui."}
        </p>
        <button className="cta-button" style={{ marginTop: 16 }} onClick={onClose}>
          Retour
        </button>
      </div>
    );
  }

  const card = cards[pos];
  // English shown on the front for active recall. Vocab cards have no `en` but
  // borrow their sentence translation (contextEn).
  const frontEn = card.en ?? card.contextEn;
  const enFront = !!frontEn; // otherwise fall back to the old FR-front behavior
  const isVocab = card.kind === "vocab";

  const grade = (quality) => {
    const next = review(card, quality);
    onUpdateDeck((prev) => ({ ...prev, [card.id]: next }));
    stopAll();
    setRevealed(false);
    if (pos + 1 < cards.length) setPos(pos + 1);
    else setFinished(true);
  };

  const doReveal = () => {
    tap();
    setRevealed(true);
    if (enFront) speakFrench(card.fr, baseRate);
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
          {pos + 1} / {cards.length}
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
        {!revealed && enFront && (
          <>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{frontEn}</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>
              {isVocab ? "Dites-le en français (mot ou phrase)" : "Dites-le en français"}
            </div>
          </>
        )}

        {!revealed && !enFront && (
          <>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>{card.fr}</div>
            <button
              className="chip"
              onClick={() => {
                tap();
                speakFrench(card.fr, baseRate);
              }}
              aria-label="Écouter"
            >
              🔊 Écouter
            </button>
          </>
        )}

        {revealed && (
          <div>
            {isVocab && card.contextFr ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, lineHeight: 1.5 }}>
                  {highlightWord(card.contextFr, card.fr)}
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
                  Mot : <span style={{ color: "var(--accent)", fontWeight: 700 }}>{card.fr}</span>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{card.fr}</div>
                {card.contextFr && card.contextFr !== card.fr && (
                  <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
                    {card.contextFr}
                  </div>
                )}
              </>
            )}
            <button
              className="chip"
              onClick={() => {
                tap();
                speakFrench(card.fr, baseRate);
              }}
              aria-label="Réécouter"
            >
              🔊 Réécouter
            </button>
            {!enFront && (
              <div style={{ marginTop: 14, color: "var(--muted)", fontSize: 13 }}>
                {`Vous l'avez vue ${card.reps} fois · prochaine échéance dans ${card.interval} jour(s)`}
              </div>
            )}
          </div>
        )}

        {!revealed && (
          <div style={{ marginTop: 24 }}>
            <button
              className="text-button"
              onClick={doReveal}
              style={{ color: "var(--accent)" }}
            >
              Révéler
            </button>
          </div>
        )}
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
