// Screen wake lock. Released automatically if the tab is hidden; we
// reacquire on visibilitychange so a paused dialogue doesn't leave the
// screen permanently awake when the user comes back.

let sentinel = null;

export async function acquireWakeLock() {
  if (sentinel) return sentinel;
  if (!("wakeLock" in navigator)) return null;
  try {
    sentinel = await navigator.wakeLock.request("screen");
    sentinel.addEventListener?.("release", () => {
      sentinel = null;
    });
    return sentinel;
  } catch {
    sentinel = null;
    return null;
  }
}

export async function releaseWakeLock() {
  if (!sentinel) return;
  try {
    await sentinel.release();
  } catch {
    // ignore
  } finally {
    sentinel = null;
  }
}

export function bindReacquireOnVisibility(shouldHold) {
  const onVisibility = () => {
    if (document.visibilityState === "visible" && shouldHold()) {
      acquireWakeLock();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);
  return () => document.removeEventListener("visibilitychange", onVisibility);
}
