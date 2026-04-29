import { useEffect } from "react";
import { acquireWakeLock, releaseWakeLock, bindReacquireOnVisibility } from "../lib/wakeLock.js";

export function useWakeLock(active) {
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    acquireWakeLock();
    const unbind = bindReacquireOnVisibility(() => !cancelled && active);
    return () => {
      cancelled = true;
      unbind();
      releaseWakeLock();
    };
  }, [active]);
}
