// Daily streak. We store the local-date ISO of the last activity day and
// the current streak count. A day with no activity breaks the streak.

function localDateISO(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(aISO, bISO) {
  const a = new Date(aISO + "T00:00:00");
  const b = new Date(bISO + "T00:00:00");
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

export function emptyStreak() {
  return { count: 0, lastDay: null, best: 0 };
}

export function recordActivity(streak, today = localDateISO()) {
  if (!streak || !streak.lastDay) {
    return { count: 1, lastDay: today, best: Math.max(1, streak?.best ?? 0) };
  }
  if (streak.lastDay === today) return streak;
  const gap = daysBetween(streak.lastDay, today);
  const count = gap === 1 ? streak.count + 1 : 1;
  return {
    count,
    lastDay: today,
    best: Math.max(count, streak.best ?? 0),
  };
}

export function streakIsLive(streak, today = localDateISO()) {
  if (!streak?.lastDay) return false;
  const gap = daysBetween(streak.lastDay, today);
  return gap === 0 || gap === 1;
}
