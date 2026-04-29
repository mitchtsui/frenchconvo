import { useEffect } from "react";

// Bind the browser Media Session API to the player so the lock-screen
// (and bluetooth headset buttons) can pause/resume/skip the dialogue.
export function useMediaSession({ title, artist, isPlaying, onPlay, onPause, onPrev, onNext }) {
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title,
      artist,
      album: "Rafraîchir son français",
    });
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";

    const handlers = [
      ["play", onPlay],
      ["pause", onPause],
      ["previoustrack", onPrev],
      ["nexttrack", onNext],
    ];
    for (const [evt, fn] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(evt, fn || null);
      } catch {
        // Some browsers throw on unsupported actions; ignore.
      }
    }
    return () => {
      for (const [evt] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(evt, null);
        } catch {
          // ignore
        }
      }
    };
  }, [title, artist, isPlaying, onPlay, onPause, onPrev, onNext]);
}
