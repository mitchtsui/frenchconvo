// SM-2 lite spaced-repetition scheduler.
// Each card stores: id, due (ms), interval (days), ease, reps, lapses.
// Quality grades: 0 = "again", 1 = "hard", 2 = "good", 3 = "easy".

const DAY_MS = 24 * 60 * 60 * 1000;

export function newCard(id, now = Date.now()) {
  return {
    id,
    due: now,
    interval: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
  };
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

export function addPhrasesToDeck(deck, ids, now = Date.now()) {
  const next = { ...deck };
  for (const id of ids) {
    if (!next[id]) next[id] = newCard(id, now);
  }
  return next;
}
