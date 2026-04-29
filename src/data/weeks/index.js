import { week1 } from "./week1.js";
import { week2 } from "./week2.js";
import { week3 } from "./week3.js";
import { week4 } from "./week4.js";
import { week5 } from "./week5.js";
import { week6 } from "./week6.js";
import { week7 } from "./week7.js";
import { week8 } from "./week8.js";
import { week9 } from "./week9.js";

export const weeks = [week1, week2, week3, week4, week5, week6, week7, week8, week9];

export const totalSessions = weeks.reduce((sum, w) => sum + w.sessions.length, 0);

export function sessionKey(weekIndex, sessionIndex) {
  return `${weekIndex}-${sessionIndex}`;
}
