import { useEffect, useRef, useState } from "react";
import { loadJSON, saveJSON } from "../lib/storage.js";

export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    const stored = loadJSON(key, undefined);
    if (stored === undefined) {
      return typeof initial === "function" ? initial() : initial;
    }
    return stored;
  });
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    saveJSON(key, value);
  }, [key, value]);
  return [value, setValue];
}
