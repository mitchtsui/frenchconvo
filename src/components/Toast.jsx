import { useEffect, useState } from "react";

export function Toast({ message, duration = 1800, onDone }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDone]);
  if (!message || !visible) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}
