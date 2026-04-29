// Deterministic per-character voice prosody (pitch + rate-jitter).
// Stable across renders because it hashes the character name rather than
// relying on first-seen-order in module-scoped mutables.

const PITCH_TABLE = [0.82, 0.92, 1.0, 1.08, 1.18, 1.3, 0.88, 1.12];
const RATE_OFFSETS = [-0.05, 0.02, 0, -0.03, 0.04, -0.06, 0.03, -0.02];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getProsody(character) {
  if (!character) return { pitch: 0.95, rateOffset: 0 };
  const h = hashString(character);
  return {
    pitch: PITCH_TABLE[h % PITCH_TABLE.length],
    rateOffset: RATE_OFFSETS[h % RATE_OFFSETS.length],
  };
}
