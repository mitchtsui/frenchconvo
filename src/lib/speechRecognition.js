// Thin wrapper around the Web Speech Recognition API.
// Resolves with a transcript string, or null if the API is unavailable
// or the user did not say anything within the time limit.

export function isSpeechRecognitionAvailable() {
  return typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function recognizeFrench({ timeoutMs = 6000 } = {}) {
  return new Promise((resolve) => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      resolve(null);
      return;
    }
    const rec = new Ctor();
    rec.lang = "fr-FR";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      try {
        rec.stop();
      } catch {
        // ignore
      }
      resolve(value);
    };

    rec.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      finish(transcript);
    };
    rec.onerror = () => finish(null);
    rec.onend = () => finish(null);

    try {
      rec.start();
    } catch {
      finish(null);
      return;
    }
    setTimeout(() => finish(null), timeoutMs);
  });
}
