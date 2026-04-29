import { characterColor } from "../lib/characterColor.js";

function speakerLabel(character) {
  if (character === "Vous") return "🎧 VOUS";
  if (character === "Narrateur") return "📖";
  if (character === "Annonce SNCF") return "📢 " + character;
  return "🗣️ " + character;
}

export function DialogueLine({
  line,
  index,
  isActive,
  isAnyActive,
  showEnglishGlobal,
  revealed,
  onClickReplay,
  onToggleReveal,
}) {
  const isNarrator = line.character === "Narrateur";
  const color = characterColor(line.character);
  const englishOpen = showEnglishGlobal || revealed;

  return (
    <div
      data-i={index}
      className={`line-row${isActive ? " is-active" : ""}`}
      style={{ borderLeftColor: isActive ? color : "transparent" }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onClickReplay}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClickReplay();
        }}
      >
        {line.character && (
          <div
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".05em",
              color,
              marginBottom: 2,
            }}
          >
            {speakerLabel(line.character)}
          </div>
        )}
        <div
          style={{
            fontFamily: isNarrator ? "'Libre Baskerville',serif" : "'DM Sans',sans-serif",
            fontSize: isNarrator ? 13.5 : 15,
            lineHeight: 1.55,
            color: isNarrator ? "var(--muted)" : "var(--text)",
            opacity: isAnyActive && !isActive ? 0.4 : 1,
            transition: "opacity .3s",
            fontStyle: isNarrator ? "italic" : "normal",
          }}
        >
          {line.fr}
        </div>
      </div>
      {!showEnglishGlobal && (
        <button
          onClick={onToggleReveal}
          className="text-button"
          style={{
            fontSize: 11,
            padding: "4px 0",
            color: revealed ? "var(--muted)" : "var(--accent)",
            minHeight: 28,
          }}
          aria-expanded={revealed}
        >
          {revealed ? "Masquer la traduction" : "Révéler la traduction"}
        </button>
      )}
      {englishOpen && (
        <div
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 12,
            color: "var(--muted)",
            marginTop: 4,
            opacity: isAnyActive && !isActive ? 0.4 : 0.85,
            transition: "opacity .3s",
          }}
        >
          {line.en}
        </div>
      )}
    </div>
  );
}
