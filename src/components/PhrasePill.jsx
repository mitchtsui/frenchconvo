import { speakAs, stopAll } from "../lib/tts.js";
import { tap } from "../lib/haptics.js";

export function PhrasePill({ text, baseRate = 0.88 }) {
  return (
    <span
      className="phrase-pill"
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
    </span>
  );
}
