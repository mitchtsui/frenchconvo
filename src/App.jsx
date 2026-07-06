import { Suspense, lazy, useCallback, useMemo, useState } from "react";
import { weeks } from "./data/weeks/index.js";
import { useWeek } from "./hooks/useWeek.js";
import { usePersistentState } from "./hooks/usePersistentState.js";
import { KEYS } from "./lib/storage.js";
import {
  addCardsToDeck,
  dueCards,
  resolvePhraseCard,
  resolveVocabCard,
} from "./lib/srs.js";
import { questionsFor } from "./data/comprehension.js";
import { recordActivity, emptyStreak, streakIsLive } from "./lib/streak.js";
import { stopAll } from "./lib/tts.js";
import { tap } from "./lib/haptics.js";
import { HomeHeader, WeekHeader } from "./components/Header.jsx";
import { WeekList } from "./components/WeekList.jsx";
import { SessionView } from "./components/SessionView.jsx";
import { Toast } from "./components/Toast.jsx";

const DialoguePlayer = lazy(() =>
  import("./components/DialoguePlayer.jsx").then((m) => ({ default: m.DialoguePlayer }))
);
const ReviewDeck = lazy(() =>
  import("./components/ReviewDeck.jsx").then((m) => ({ default: m.ReviewDeck }))
);

function LoadingShell() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted)",
      }}
    >
      Chargement…
    </div>
  );
}

const DEFAULT_SETTINGS = {
  speed: "normal", // "normal" | "slow"
  showEnglish: false,
  shadowMode: false,
  vousMode: false,
};

export default function App() {
  const [done, setDone] = usePersistentState(KEYS.done, {});
  const [settings, setSettings] = usePersistentState(KEYS.settings, DEFAULT_SETTINGS);
  const [streak, setStreak] = usePersistentState(KEYS.streak, emptyStreak());
  const [deck, setDeck] = usePersistentState(KEYS.srs, {});
  const [vocab, setVocab] = usePersistentState(KEYS.vocab, {});
  const [quizResults, setQuizResults] = usePersistentState(KEYS.quiz, {});
  const [listened, setListened] = usePersistentState(KEYS.listened, {});

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedSession, setSelectedSession] = useState(0);
  const loadedWeek = useWeek(selectedWeek);
  const [view, setView] = useState("home"); // "home" | "week" | "player" | "review"
  const [toast, setToast] = useState("");

  const baseRate = settings.speed === "slow" ? 0.6 : 0.88;

  const doneCount = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const dueCount = useMemo(() => dueCards(deck).length, [deck]);

  const updateSettings = (patch) => setSettings((prev) => ({ ...prev, ...patch }));

  // Fully credit a session: mark done, enqueue its key phrases (with resolved
  // English + context) into the SRS deck, and record the streak.
  const finalizeSession = useCallback(
    (key, session) => {
      setDone((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
      if (session) {
        const specs = session.phrases.map((p) => resolvePhraseCard(session, p));
        setDeck((prev) => addCardsToDeck(prev, specs));
      }
      setStreak((prev) => recordActivity(prev));
      setToast(`Bravo · ${session?.phrases.length ?? 0} phrases ajoutées à la révision`);
    },
    [setDone, setDeck, setStreak]
  );

  // Manual toggle: un-marking just clears the flag; marking done gives full
  // credit (phrase enqueue + streak) so "done" always means "phrases enqueued".
  const toggleDone = useCallback(
    (key) => {
      if (done[key]) {
        setDone((prev) => ({ ...prev, [key]: false }));
        return;
      }
      const [, sIdx] = key.split("-").map(Number);
      finalizeSession(key, loadedWeek?.sessions[sIdx] ?? null);
    },
    [done, loadedWeek, setDone, finalizeSession]
  );

  // Playback finished. If the session has a comprehension quiz that has never
  // been completed, this only counts as "listened" — the learner must do the
  // quiz to fully validate the session.
  const handleSessionDone = useCallback(
    (key) => {
      const [wIdx, sIdx] = key.split("-").map(Number);
      const session = loadedWeek?.sessions[sIdx];
      const hasQuiz = questionsFor(wIdx, sIdx).length > 0;
      if (hasQuiz && !quizResults[key]) {
        setListened((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
        setToast("Session écoutée · faites le quiz pour valider");
        return;
      }
      finalizeSession(key, session);
    },
    [loadedWeek, quizResults, setListened, finalizeSession]
  );

  // Quiz finished (any score). Persist the result and, if playback already
  // happened, finalize the session now.
  const handleQuizComplete = useCallback(
    (key, score, total) => {
      setQuizResults((prev) => ({ ...prev, [key]: { score, total, ts: Date.now() } }));
      if (listened[key] && !done[key]) {
        const [, sIdx] = key.split("-").map(Number);
        finalizeSession(key, loadedWeek?.sessions[sIdx]);
      }
    },
    [listened, done, loadedWeek, setQuizResults, finalizeSession]
  );

  // A missed quiz answer that carries a review line enqueues it as a card.
  const handleReviewCard = useCallback(
    (reviewItem) => {
      if (!reviewItem?.fr) return;
      setDeck((prev) =>
        addCardsToDeck(prev, [
          {
            id: reviewItem.fr,
            fr: reviewItem.fr,
            en: reviewItem.en ?? null,
            contextEn: reviewItem.en ?? null,
            kind: "line",
          },
        ])
      );
    },
    [setDeck]
  );

  // A skipped or failed "À vous" line is enqueued for review, due in ~10 min.
  const handleLineMissed = useCallback(
    (line) => {
      if (!line?.fr) return;
      setDeck((prev) =>
        addCardsToDeck(
          prev,
          [{ id: line.fr, fr: line.fr, en: line.en ?? null, contextEn: line.en ?? null, kind: "line" }],
          Date.now() + 10 * 60 * 1000
        )
      );
    },
    [setDeck]
  );

  // Marking a word: cosmetic vocab map + SRS side effects.
  const handleMarkVocab = useCallback(
    (word, status) => {
      setVocab((prev) => ({ ...prev, [word]: status }));
      const session = loadedWeek?.sessions[selectedSession];
      if (!session) return;
      if (status === "learning") {
        setDeck((prev) => addCardsToDeck(prev, [resolveVocabCard(session, word)]));
      } else if (status === "known") {
        setDeck((prev) => {
          const id = `vocab:${word}`;
          if (!prev[id]) return prev;
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    },
    [loadedWeek, selectedSession, setVocab, setDeck]
  );

  const openSession = (weekIdx, sessionIdx = 0) => {
    setSelectedWeek(weekIdx);
    setSelectedSession(sessionIdx);
    setView("week");
  };

  const playSession = () => {
    setView("player");
  };

  const onPrevSession = () => {
    if (selectedSession > 0) {
      setSelectedSession((p) => p - 1);
    } else if (selectedWeek > 0) {
      const prevWeek = weeks[selectedWeek - 1];
      setSelectedWeek(selectedWeek - 1);
      setSelectedSession(prevWeek.days.length - 1);
    }
  };

  const onNextSession = () => {
    const week = weeks[selectedWeek];
    if (selectedSession < week.days.length - 1) {
      setSelectedSession((p) => p + 1);
    } else if (selectedWeek < weeks.length - 1) {
      setSelectedWeek((p) => p + 1);
      setSelectedSession(0);
    }
  };

  const cycleSpeed = () =>
    updateSettings({ speed: settings.speed === "normal" ? "slow" : "normal" });

  // --- Render ---

  if (view === "review") {
    return (
      <Shell>
        <Suspense fallback={<LoadingShell />}>
          <ReviewDeck
            deck={deck}
            onUpdateDeck={setDeck}
            onClose={() => setView("home")}
            baseRate={baseRate}
          />
        </Suspense>
        <Toast message={toast} onDone={() => setToast("")} />
      </Shell>
    );
  }

  if (view === "player" && selectedWeek !== null) {
    if (!loadedWeek) {
      return (
        <Shell>
          <LoadingShell />
        </Shell>
      );
    }
    return (
      <Shell>
        <Suspense fallback={<LoadingShell />}>
        <DialoguePlayer
          week={loadedWeek}
          weekIndex={selectedWeek}
          sessionIndex={selectedSession}
          baseRate={baseRate}
          showEnglish={settings.showEnglish}
          shadowMode={settings.shadowMode}
          vousMode={settings.vousMode}
          done={done}
          onBack={() => {
            stopAll();
            setView("week");
          }}
          onMarkDone={(key) => {
            tap();
            toggleDone(key);
          }}
          onSessionDone={handleSessionDone}
          onLineMissed={handleLineMissed}
          onPrevSession={onPrevSession}
          onNextSession={onNextSession}
          onChangeSpeed={cycleSpeed}
          onToggleEnglish={() => updateSettings({ showEnglish: !settings.showEnglish })}
          onToggleShadow={() => updateSettings({ shadowMode: !settings.shadowMode })}
          onToggleVousMode={() => updateSettings({ vousMode: !settings.vousMode })}
        />
        </Suspense>
        <Toast message={toast} onDone={() => setToast("")} />
      </Shell>
    );
  }

  if (view === "week" && selectedWeek !== null) {
    if (!loadedWeek) {
      return (
        <Shell>
          <div
            style={{
              padding: "calc(20px + var(--safe-top)) 20px 14px",
              borderBottom: "1px solid var(--border)",
              flexShrink: 0,
            }}
          >
            <WeekHeader week={weeks[selectedWeek]} onBack={() => setView("home")} />
          </div>
          <LoadingShell />
        </Shell>
      );
    }
    return (
      <Shell>
        <div
          style={{
            padding: "calc(20px + var(--safe-top)) 20px 14px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <WeekHeader week={weeks[selectedWeek]} onBack={() => setView("home")} />
        </div>
        <SessionView
          week={loadedWeek}
          weekIndex={selectedWeek}
          sessionIndex={selectedSession}
          done={done}
          baseRate={baseRate}
          vocab={vocab}
          quizResults={quizResults}
          listened={listened}
          onMarkVocab={handleMarkVocab}
          onQuizComplete={handleQuizComplete}
          onReviewCard={handleReviewCard}
          onToggleDone={toggleDone}
          onSelectSession={setSelectedSession}
          onPrevSession={onPrevSession}
          onNextSession={onNextSession}
          onPlay={playSession}
        />
        <Toast message={toast} onDone={() => setToast("")} />
      </Shell>
    );
  }

  // Home view
  return (
    <Shell>
      <div
        style={{
          padding: "calc(20px + var(--safe-top)) 20px 14px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <HomeHeader doneCount={doneCount} streak={streakIsLive(streak) ? streak : null} />
        {dueCount > 0 && (
          <button
            className="cta-button"
            style={{ marginTop: 14 }}
            onClick={() => setView("review")}
          >
            🌱 Réviser {dueCount} {dueCount === 1 ? "carte" : "cartes"}
          </button>
        )}
      </div>
      <WeekList done={done} onSelectWeek={openSession} />
      <Toast message={toast} onDone={() => setToast("")} />
    </Shell>
  );
}

function Shell({ children }) {
  return <div className="app-shell">{children}</div>;
}
