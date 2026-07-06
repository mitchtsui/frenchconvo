import { useCallback, useEffect, useRef, useState } from "react";
import { sessionKey } from "../data/weeks/index.js";
import { speakAs, stopAll, loadVoices } from "../lib/tts.js";
import { getProsody } from "../lib/prosody.js";
import { tap } from "../lib/haptics.js";
import { useWakeLock } from "../hooks/useWakeLock.js";
import { useSwipe } from "../hooks/useSwipe.js";
import { useMediaSession } from "../hooks/useMediaSession.js";
import { PlayerHeader } from "./Header.jsx";
import { PhrasePill } from "./PhrasePill.jsx";
import { DialogueLine } from "./DialogueLine.jsx";
import { SpeakingPrompt } from "./SpeakingPrompt.jsx";

const SHADOW_GAP_FACTOR = 1.5; // 1.5x line speech-time of silence after each line

function estimateSpeechMs(text) {
  // ~14 chars/sec in normal French TTS; clamp to a sensible range.
  return Math.max(1200, Math.min(7000, Math.round((text.length / 14) * 1000)));
}

export function DialoguePlayer({
  week,
  weekIndex,
  sessionIndex,
  baseRate,
  showEnglish,
  shadowMode,
  vousMode,
  onBack,
  onMarkDone,
  onSessionDone,
  onLineMissed,
  onPrevSession,
  onNextSession,
  onChangeSpeed,
  onToggleEnglish,
  onToggleShadow,
  onToggleVousMode,
  done,
}) {
  const session = week.sessions[sessionIndex];
  const lines = session.lines;
  const key = sessionKey(weekIndex, sessionIndex);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealed, setRevealed] = useState(() => new Set());
  const [waitingForUser, setWaitingForUser] = useState(false);

  const stopRequested = useRef(false);
  const scrollRef = useRef(null);
  const continueResolverRef = useRef(null);

  useWakeLock(isPlaying);
  useSwipe(scrollRef, {
    onLeft: () => {
      stopAll();
      stopRequested.current = true;
      setIsPlaying(false);
      setActiveIndex(-1);
      onNextSession?.();
    },
    onRight: () => {
      stopAll();
      stopRequested.current = true;
      setIsPlaying(false);
      setActiveIndex(-1);
      onPrevSession?.();
    },
  });

  useEffect(() => {
    loadVoices();
  }, []);

  useEffect(() => {
    if (activeIndex < 0 || !scrollRef.current) return;
    const el = scrollRef.current.querySelector(`[data-i="${activeIndex}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [activeIndex]);

  const stopAndResetSpeaking = useCallback(() => {
    stopRequested.current = true;
    stopAll();
    setIsPlaying(false);
    setWaitingForUser(false);
    if (continueResolverRef.current) {
      continueResolverRef.current();
      continueResolverRef.current = null;
    }
  }, []);

  // Pause-and-resume helper: returns a promise the caller can await; resolves
  // with a result object when the user advances or skips. { missed: true }
  // means the line was skipped or failed (not a clean pass).
  const waitForUser = useCallback(() => {
    setWaitingForUser(true);
    return new Promise((resolve) => {
      continueResolverRef.current = (result) => {
        setWaitingForUser(false);
        continueResolverRef.current = null;
        resolve(result);
      };
    });
  }, []);

  const playFrom = useCallback(
    async (start = 0) => {
      if (lines.length === 0) return;
      stopRequested.current = false;
      setIsPlaying(true);
      // Playback queue of line indices. Missed "À vous" lines are re-inserted
      // once at the end (guarded so a line can never re-queue more than once).
      const queue = [];
      for (let i = start; i < lines.length; i++) queue.push(i);
      const requeued = new Set();

      for (let qi = 0; qi < queue.length; qi++) {
        if (stopRequested.current) break;
        const i = queue[qi];
        setActiveIndex(i);
        const line = lines[i];
        const isVous = line.character === "Vous";
        const isNarrator = line.character === "Narrateur";
        const prosody = isNarrator
          ? { pitch: 0.95, rateOffset: -0.05 }
          : getProsody(line.character);

        if (isVous && vousMode) {
          const result = await waitForUser();
          if (stopRequested.current) break;
          if (result?.missed) {
            onLineMissed?.(line);
            if (!requeued.has(i)) {
              requeued.add(i);
              queue.push(i);
            }
          }
        } else {
          await speakAs({ text: line.fr, baseRate, prosody });
          if (stopRequested.current) break;
          if (shadowMode && !isNarrator) {
            await new Promise((r) => setTimeout(r, estimateSpeechMs(line.fr) * SHADOW_GAP_FACTOR));
          } else {
            await new Promise((r) => setTimeout(r, 500));
          }
          if (stopRequested.current) break;
        }
      }
      setIsPlaying(false);
      if (!stopRequested.current) {
        setActiveIndex(-1);
        if (!done[key]) {
          onSessionDone?.(key);
        }
      }
    },
    [lines, baseRate, shadowMode, vousMode, waitForUser, done, key, onSessionDone, onLineMissed]
  );

  useMediaSession({
    title: session.title,
    artist: `Semaine ${week.week} · ${session.day}`,
    isPlaying,
    onPlay: () => playFrom(activeIndex >= 0 ? activeIndex : 0),
    onPause: () => stopAndResetSpeaking(),
    onPrev: () => onPrevSession?.(),
    onNext: () => onNextSession?.(),
  });

  // Auto-play the dialogue when the player mounts. We capture playFrom in the
  // dep array so the effect can read the latest closure (fixes the previous
  // stale-deps bug in App.jsx).
  useEffect(() => {
    const t = setTimeout(() => playFrom(0), 500);
    return () => {
      clearTimeout(t);
      stopAll();
    };
    // We intentionally only fire this once on mount; re-creating the effect on
    // every playFrom change would loop. playFrom captures latest state via refs
    // and props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLineReplay = (i) => {
    stopAndResetSpeaking();
    setActiveIndex(i);
    const line = lines[i];
    const prosody =
      line.character === "Narrateur"
        ? { pitch: 0.95, rateOffset: -0.05 }
        : getProsody(line.character);
    speakAs({ text: line.fr, baseRate, prosody });
  };

  const toggleReveal = (i) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const headerControls = (
    <>
      <button
        className={`chip${baseRate < 0.7 ? " is-active" : ""}`}
        onClick={() => {
          tap();
          onChangeSpeed?.();
        }}
      >
        {baseRate < 0.7 ? "🐢 Lent" : "🐇 Normal"}
      </button>
      <button
        className={`chip${showEnglish ? " is-active" : ""}`}
        onClick={() => {
          tap();
          onToggleEnglish?.();
        }}
      >
        🇬🇧 {showEnglish ? "EN visible" : "EN caché"}
      </button>
      <button
        className={`chip${shadowMode ? " is-active" : ""}`}
        onClick={() => {
          tap();
          onToggleShadow?.();
        }}
        aria-label="Mode shadow"
      >
        🪞 Shadow
      </button>
      <button
        className={`chip${vousMode ? " is-active" : ""}`}
        onClick={() => {
          tap();
          onToggleVousMode?.();
        }}
        aria-label="Mode votre tour"
      >
        🎤 À vous
      </button>
    </>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <div
        style={{
          padding: "calc(20px + var(--safe-top)) 18px 12px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <PlayerHeader
          week={week}
          session={session}
          lineIndex={activeIndex}
          totalLines={lines.length}
          onBack={() => {
            stopAndResetSpeaking();
            onBack?.();
          }}
          controls={headerControls}
        />
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 16px calc(140px + var(--safe-bottom))",
        }}
      >
        <div
          style={{
            marginBottom: 14,
            padding: "10px 12px",
            borderRadius: 10,
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 6,
            }}
          >
            Phrases clés · taper pour entendre
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {session.phrases.map((p, i) => (
              <PhrasePill key={i} text={p} baseRate={baseRate} />
            ))}
          </div>
        </div>

        {lines.map((line, i) => {
          const isVousActive =
            i === activeIndex && line.character === "Vous" && vousMode && waitingForUser;
          return (
            <div key={i}>
              <DialogueLine
                line={line}
                index={i}
                isActive={i === activeIndex}
                isAnyActive={activeIndex >= 0}
                showEnglishGlobal={showEnglish}
                revealed={revealed.has(i)}
                onClickReplay={() => onLineReplay(i)}
                onToggleReveal={() => toggleReveal(i)}
              />
              {isVousActive && (
                <SpeakingPrompt
                  target={line.fr}
                  onPass={() => continueResolverRef.current?.({ missed: false })}
                  onSkip={() => continueResolverRef.current?.({ missed: true })}
                />
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "calc(18px + var(--safe-bottom))",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 12,
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <button
          className="icon-button"
          style={{ pointerEvents: "auto", boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}
          onClick={() => {
            tap();
            stopAndResetSpeaking();
            setTimeout(() => playFrom(0), 100);
          }}
          aria-label="Recommencer"
        >
          ⏮
        </button>
        <button
          className={`play-fab${isPlaying ? " is-stop" : ""}`}
          style={{ pointerEvents: "auto" }}
          onClick={() => {
            tap();
            if (isPlaying) {
              stopAndResetSpeaking();
            } else {
              playFrom(activeIndex >= 0 ? activeIndex : 0);
            }
          }}
          aria-label={isPlaying ? "Arrêter" : "Lire"}
        >
          {isPlaying ? "⏹" : "▶"}
        </button>
        <button
          className="icon-button"
          style={{ pointerEvents: "auto", boxShadow: "0 2px 8px rgba(0,0,0,.1)" }}
          onClick={() => {
            tap();
            onMarkDone?.(key);
          }}
          aria-label={done[key] ? "Marquer non terminé" : "Marquer terminé"}
        >
          {done[key] ? "✓" : "☐"}
        </button>
      </div>
    </div>
  );
}
