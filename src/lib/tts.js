// Browser TTS wrapper. Awaitable voice loading, deterministic voice picking,
// safe rate/pitch clamping, and a Chrome-bug workaround that pauses/resumes
// every 10s to keep long utterances from being silently dropped.

let cachedVoices = [];
let voicesPromise = null;

function listFrenchVoices() {
  const all = window.speechSynthesis?.getVoices?.() || [];
  return all.filter((v) => v.lang && v.lang.toLowerCase().startsWith("fr"));
}

export function loadVoices() {
  if (voicesPromise) return voicesPromise;
  voicesPromise = new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      cachedVoices = [];
      resolve(cachedVoices);
      return;
    }
    const tryResolve = () => {
      const v = listFrenchVoices();
      if (v.length > 0) {
        cachedVoices = v;
        resolve(cachedVoices);
        return true;
      }
      return false;
    };
    if (tryResolve()) return;
    const onChanged = () => {
      if (tryResolve()) {
        synth.removeEventListener?.("voiceschanged", onChanged);
      }
    };
    synth.addEventListener?.("voiceschanged", onChanged);
    setTimeout(() => {
      cachedVoices = listFrenchVoices();
      resolve(cachedVoices);
    }, 1500);
  });
  return voicesPromise;
}

export function getCachedVoices() {
  return cachedVoices;
}

export function pickVoice(prosody) {
  if (cachedVoices.length === 0) return null;
  if (cachedVoices.length === 1) return cachedVoices[0];
  const idx = Math.round((prosody.pitch - 0.8) * 10);
  const safe = ((idx % cachedVoices.length) + cachedVoices.length) % cachedVoices.length;
  return cachedVoices[safe] || cachedVoices[0];
}

export function stopAll() {
  window.speechSynthesis?.cancel();
}

const PARENS = /\(.*?\)/gs;
const BRACKETS = /\[.*?\]/gs;

export function speak(text, rate, pitch, voice) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      resolve();
      return;
    }
    const cleaned = text.replace(PARENS, "").replace(BRACKETS, "").trim();
    if (!cleaned) {
      resolve();
      return;
    }
    const utter = new SpeechSynthesisUtterance(cleaned);
    utter.lang = "fr-FR";
    utter.rate = Math.max(0.4, Math.min(rate, 1.5));
    utter.pitch = Math.max(0.5, Math.min(pitch, 2));
    if (voice) utter.voice = voice;
    const keepAlive = setInterval(() => {
      if (!synth.speaking) {
        clearInterval(keepAlive);
        return;
      }
      synth.pause();
      synth.resume();
    }, 10000);
    utter.onend = () => {
      clearInterval(keepAlive);
      resolve();
    };
    utter.onerror = () => {
      clearInterval(keepAlive);
      resolve();
    };
    synth.speak(utter);
  });
}

// Convenience: speak a French text using the current speed and a character's
// prosody. Awaits voice loading on first call so the very first utterance also
// uses a French voice instead of falling back to the default browser voice.
export async function speakAs({ text, baseRate, prosody }) {
  if (cachedVoices.length === 0) await loadVoices();
  const voice = pickVoice(prosody);
  return speak(text, baseRate + (prosody.rateOffset ?? 0), prosody.pitch ?? 1, voice);
}
