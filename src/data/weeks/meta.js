// Lightweight week metadata for the home screen and routing. Loading the
// dialogue lines is deferred to the player via dynamic imports so the home
// screen doesn't ship 60+ KB of dialogue text on first load.

export const weekMeta = [
  { week: 1, title: "Se retrouver", sub: "Finding Your French Again", color: "#1B4332", level: "A2", days: ["Lun", "Mar", "Mer", "Jeu", "Ven"] },
  { week: 2, title: "Au café", sub: "Coffee Culture", color: "#5C4033", level: "A2", days: ["Lun", "Mar", "Mer", "Jeu", "Ven"] },
  { week: 3, title: "À table", sub: "Restaurant Dining", color: "#8B1A1A", level: "B1", days: ["Lun", "Mar", "Mer", "Jeu", "Ven"] },
  { week: 4, title: "Vins et terroirs", sub: "Wine Lover's Week", color: "#722F37", level: "B2", days: ["Lun", "Mar", "Mer", "Jeu", "Ven"] },
  { week: 5, title: "À l'hôtel", sub: "Check-in to Check-out", color: "#2C3E6B", level: "B1", days: ["Lun", "Mar", "Mer", "Jeu", "Ven"] },
  { week: 6, title: "Se déplacer", sub: "Getting Around", color: "#6B4226", level: "B1", days: ["Lun", "Mar", "Mer", "Jeu", "Ven"] },
  { week: 7, title: "Faire les courses", sub: "Shopping & Errands", color: "#4A6741", level: "B1", days: ["Lun", "Mar", "Mer", "Jeu", "Ven"] },
  { week: 8, title: "Bavarder", sub: "Social Conversations", color: "#7B5EA7", level: "B2", days: ["Lun", "Mar", "Mer", "Jeu", "Ven"] },
  { week: 9, title: "Tout ensemble", sub: "Full Scenarios", color: "#C4A35A", level: "B2", days: ["Lun", "Mar", "Mer", "Jeu", "Ven"] },
];

export const totalSessions = weekMeta.reduce((sum, w) => sum + w.days.length, 0);

export function sessionKey(weekIndex, sessionIndex) {
  return `${weekIndex}-${sessionIndex}`;
}

const loaders = [
  () => import("./week1.js").then((m) => m.week1),
  () => import("./week2.js").then((m) => m.week2),
  () => import("./week3.js").then((m) => m.week3),
  () => import("./week4.js").then((m) => m.week4),
  () => import("./week5.js").then((m) => m.week5),
  () => import("./week6.js").then((m) => m.week6),
  () => import("./week7.js").then((m) => m.week7),
  () => import("./week8.js").then((m) => m.week8),
  () => import("./week9.js").then((m) => m.week9),
];

const cache = new Array(loaders.length);

export function loadWeek(weekIndex) {
  if (cache[weekIndex]) return cache[weekIndex];
  cache[weekIndex] = loaders[weekIndex]();
  return cache[weekIndex];
}
