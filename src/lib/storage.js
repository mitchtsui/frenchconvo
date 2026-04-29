// Tiny localStorage wrapper with JSON serialization and graceful failure.
// All keys are namespaced under "fr." so the app can be uninstalled cleanly.

const NS = "fr.";

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage unavailable — silently ignore.
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(NS + key);
  } catch {
    // ignore
  }
}

export const KEYS = {
  done: "done",
  settings: "settings",
  streak: "streak",
  srs: "srs",
  vocab: "vocab",
  revealed: "revealedLines",
};
