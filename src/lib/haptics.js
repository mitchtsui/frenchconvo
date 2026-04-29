export function tap() {
  navigator.vibrate?.(10);
}

export function pulse() {
  navigator.vibrate?.([15, 30, 15]);
}
