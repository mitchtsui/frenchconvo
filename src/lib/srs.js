// SM-2 lite spaced-repetition scheduler.
// Each card stores: id, fr, en, contextFr, contextEn, kind, due (ms),
// interval (days), ease, reps, lapses.
// kind ∈ 'phrase' | 'line' | 'vocab'. id is unique (fr string for phrase/line,
// "vocab:<word>" for vocab).
// Quality grades: 0 = "again", 1 = "hard", 2 = "good", 3 = "easy".

import { normalizeFrench } from "./speechMatch.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// Cap the review queue per deck visit so debt never becomes overwhelming.
export const REVIEW_CAP = 20;

// Build a card from a spec object (or a bare id string for legacy callers).
export function makeCard(spec, now = Date.now()) {
  const s = typeof spec === "string" ? { id: spec } : spec;
  return {
    id: s.id,
    fr: s.fr ?? s.id,
    en: s.en ?? null,
    contextFr: s.contextFr ?? null,
    contextEn: s.contextEn ?? null,
    kind: s.kind ?? "phrase",
    due: s.due ?? now,
    interval: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
  };
}

// Backfill fields on legacy cards (older decks stored only {id, due, ...}).
export function normalizeCard(card) {
  if (!card) return card;
  return {
    ...card,
    fr: card.fr ?? card.id,
    en: card.en ?? null,
    contextFr: card.contextFr ?? null,
    contextEn: card.contextEn ?? null,
    kind: card.kind ?? "phrase",
  };
}

export function newCard(id, now = Date.now()) {
  return makeCard(id, now);
}

export function review(card, quality, now = Date.now()) {
  const next = { ...card };
  if (quality <= 0) {
    next.lapses += 1;
    next.reps = 0;
    next.interval = 0;
    next.ease = Math.max(1.3, next.ease - 0.2);
    next.due = now + 10 * 60 * 1000; // 10 minutes
    return next;
  }
  next.reps += 1;
  if (next.reps === 1) {
    next.interval = quality >= 3 ? 3 : 1;
  } else if (next.reps === 2) {
    next.interval = quality >= 3 ? 7 : 3;
  } else {
    const easeBonus = quality === 1 ? 1.2 : quality === 2 ? next.ease : next.ease * 1.3;
    next.interval = Math.round(next.interval * easeBonus);
  }
  if (quality === 1) next.ease = Math.max(1.3, next.ease - 0.15);
  else if (quality === 3) next.ease = next.ease + 0.15;
  next.due = now + next.interval * DAY_MS;
  return next;
}

export function dueCards(deck, now = Date.now()) {
  return Object.values(deck).filter((c) => c.due <= now);
}

// The capped, oldest-debt-first queue for a single review visit. Returns the
// batch to study plus how many due cards did not fit.
export function reviewQueue(deck, now = Date.now(), cap = REVIEW_CAP) {
  const due = Object.values(deck)
    .filter((c) => c.due <= now)
    .map(normalizeCard)
    .sort((a, b) => a.due - b.due);
  return { cards: due.slice(0, cap), remaining: Math.max(0, due.length - cap) };
}

// Add card specs to the deck, skipping ids already present.
export function addCardsToDeck(deck, specs, now = Date.now()) {
  const next = { ...deck };
  for (const spec of specs) {
    if (!spec?.id) continue;
    if (!next[spec.id]) next[spec.id] = makeCard(spec, now);
  }
  return next;
}

// Legacy helper: enqueue bare phrase strings as phrase cards.
export function addPhrasesToDeck(deck, ids, now = Date.now()) {
  return addCardsToDeck(
    deck,
    ids.map((id) => ({ id, fr: id, kind: "phrase" })),
    now
  );
}

// Resolve a session phrase's English + surrounding line by matching the
// normalized phrase against the normalized French of each line.
export function resolvePhraseCard(session, phrase) {
  const norm = normalizeFrench(phrase);
  const line = norm
    ? session.lines.find((l) => normalizeFrench(l.fr).includes(norm)) ?? null
    : null;
  return {
    id: phrase,
    fr: phrase,
    en: line?.en ?? null,
    contextFr: line?.fr ?? null,
    contextEn: line?.en ?? null,
    kind: "phrase",
  };
}

// Resolve a vocab word to a card, attaching the first line that contains it.
export function resolveVocabCard(session, word) {
  const norm = normalizeFrench(word);
  const line = norm
    ? session.lines.find((l) => normalizeFrench(l.fr).includes(norm)) ?? null
    : null;
  return {
    id: `vocab:${word}`,
    fr: word,
    en: null,
    contextFr: line?.fr ?? null,
    contextEn: line?.en ?? null,
    kind: "vocab",
  };
}
