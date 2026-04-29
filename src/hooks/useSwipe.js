import { useEffect } from "react";

export function useSwipe(targetRef, { onLeft, onRight, threshold = 60 } = {}) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    let startX = 0;
    let startY = 0;
    let active = false;
    const onStart = (e) => {
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      active = true;
    };
    const onEnd = (e) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) < threshold) return;
      if (Math.abs(dy) > Math.abs(dx)) return; // mostly vertical, ignore
      if (dx < 0) onLeft?.();
      else onRight?.();
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [targetRef, onLeft, onRight, threshold]);
}
