import { useEffect, useState } from "react";
import { loadWeek } from "../data/weeks/index.js";

export function useWeek(weekIndex) {
  const [week, setWeek] = useState(null);
  useEffect(() => {
    if (weekIndex == null) {
      setWeek(null);
      return;
    }
    let cancelled = false;
    loadWeek(weekIndex).then((w) => {
      if (!cancelled) setWeek(w);
    });
    return () => {
      cancelled = true;
    };
  }, [weekIndex]);
  return week;
}
