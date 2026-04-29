# Rafraîchir son français 🇫🇷

A 9-week French refresher PWA aimed at intermediate learners (A2 → B2) who
want to bring their conversational French back fast.

## What you get

- **45 dialogues across 9 themed weeks**, level-tagged A2 / B1 / B2
- **Mobile-first PWA**: installable, offline shell, dark mode, screen wake-lock
  during playback, lock-screen play/pause via Media Session API
- **Active learning, not passive listening**:
  - Translations default OFF; tap any line to reveal
  - **🪞 Shadow mode** — pauses after each line so you can repeat aloud
  - **🎤 À vous mode** — when the speaker is "Vous", the app stops and
    listens via Web Speech Recognition, fuzzy-matches your French, gives
    pass/try-again feedback
  - **Comprehension quiz** per session (multiple choice)
  - **Spaced repetition** review deck: completing a session enqueues its
    phrases on an SM-2 schedule
  - **Auto-extracted vocab list** per session with mark-as-known / learning
  - **Tap-to-expand grammar notes** on key phrases (tu/vous register,
    conditional politeness, terroir vocabulary, …)
  - **Daily streak** counter
- **Per-character voices** with deterministic pitch/rate variation, French TTS
  with auto-resume to dodge Chrome's 15-second silent-cancel bug

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The production build code-splits each week's dialogue corpus (~7 KB each)
plus the player and review deck, so the home screen ships ~55 KB gzipped.

## Project structure

```
src/
  data/
    weeks/        per-week dialogue corpus (week1.js … week9.js, lazy-loaded)
    weeks/meta.js light metadata (titles, colours, levels, days)
    grammarNotes.js  tap-to-expand notes keyed by phrase
    comprehension.js per-session multiple-choice quiz data
  lib/
    tts.js, prosody.js, characterColor.js
    speechMatch.js, speechRecognition.js
    srs.js, storage.js, streak.js, vocab.js
    wakeLock.js, haptics.js
  hooks/
    usePersistentState, useWeek, useWakeLock, useMediaSession, useSwipe
  components/
    Header, WeekList, SessionView, DialoguePlayer, DialogueLine,
    PhrasePill, SpeakingPrompt, ComprehensionQuiz, VocabPanel,
    ReviewDeck, Toast
  styles/
    global.css   safe-area, dark mode, ≥44px touch targets
```

All progress is stored in `localStorage` under the `fr.` namespace.
