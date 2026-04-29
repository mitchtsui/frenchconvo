import { Suspense, lazy, useCallback, useMemo, useState } from "react";
import { weeks, sessionKey } from "./data/weeks/index.js";
import { useWeek } from "./hooks/useWeek.js";
import { usePersistentState } from "./hooks/usePersistentState.js";
import { KEYS } from "./lib/storage.js";
import { addPhrasesToDeck, dueCards } from "./lib/srs.js";
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

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedSession, setSelectedSession] = useState(0);
  const loadedWeek = useWeek(selectedWeek);
  const [view, setView] = useState("home"); // "home" | "week" | "player" | "review"
  const [toast, setToast] = useState("");

  const baseRate = settings.speed === "slow" ? 0.6 : 0.88;

  const doneCount = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const dueCount = useMemo(() => dueCards(deck).length, [deck]);

  const updateSettings = (patch) => setSettings((prev) => ({ ...prev, ...patch }));

  const toggleDone = useCallback(
    (key) => {
      setDone((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        return next;
      });
    },
    [setDone]
  );

  const handleSessionDone = useCallback(
    (key) => {
      setDone((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
      const [, sIdx] = key.split("-").map(Number);
      const session = loadedWeek?.sessions[sIdx];
      if (session) {
        setDeck((prev) => addPhrasesToDeck(prev, session.phrases));
      }
      setStreak((prev) => recordActivity(prev));
      setToast(`Bravo · ${session?.phrases.length ?? 0} phrases ajoutées à la révision`);
    },
    [loadedWeek, setDone, setDeck, setStreak]
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
          onMarkVocab={(w, status) => setVocab((prev) => ({ ...prev, [w]: status }))}
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
            🌱 Réviser {dueCount} {dueCount === 1 ? "phrase" : "phrases"}
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
