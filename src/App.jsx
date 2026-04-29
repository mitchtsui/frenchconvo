import { useCallback, useMemo, useState } from "react";
import { weeks, sessionKey } from "./data/weeks/index.js";
import { usePersistentState } from "./hooks/usePersistentState.js";
import { KEYS } from "./lib/storage.js";
import { addPhrasesToDeck, dueCards } from "./lib/srs.js";
import { recordActivity, emptyStreak, streakIsLive } from "./lib/streak.js";
import { stopAll } from "./lib/tts.js";
import { tap } from "./lib/haptics.js";
import { HomeHeader, WeekHeader } from "./components/Header.jsx";
import { WeekList } from "./components/WeekList.jsx";
import { SessionView } from "./components/SessionView.jsx";
import { DialoguePlayer } from "./components/DialoguePlayer.jsx";
import { ReviewDeck } from "./components/ReviewDeck.jsx";
import { Toast } from "./components/Toast.jsx";

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

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedSession, setSelectedSession] = useState(0);
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
      setDone((prev) => {
        if (prev[key]) return prev;
        return { ...prev, [key]: true };
      });
      // Pull this session's phrases into the SRS deck.
      const [wIdx, sIdx] = key.split("-").map(Number);
      const session = weeks[wIdx]?.sessions[sIdx];
      if (session) {
        setDeck((prev) => addPhrasesToDeck(prev, session.phrases));
      }
      setStreak((prev) => recordActivity(prev));
      setToast(`Bravo · ${session?.phrases.length ?? 0} phrases ajoutées à la révision`);
    },
    [setDone, setDeck, setStreak]
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
      setSelectedSession(prevWeek.sessions.length - 1);
    }
  };

  const onNextSession = () => {
    const week = weeks[selectedWeek];
    if (selectedSession < week.sessions.length - 1) {
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
        <ReviewDeck
          deck={deck}
          onUpdateDeck={setDeck}
          onClose={() => setView("home")}
          baseRate={baseRate}
        />
        <Toast message={toast} onDone={() => setToast("")} />
      </Shell>
    );
  }

  if (view === "player" && selectedWeek !== null) {
    return (
      <Shell>
        <DialoguePlayer
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
        <Toast message={toast} onDone={() => setToast("")} />
      </Shell>
    );
  }

  if (view === "week" && selectedWeek !== null) {
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
          weekIndex={selectedWeek}
          sessionIndex={selectedSession}
          done={done}
          baseRate={baseRate}
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
