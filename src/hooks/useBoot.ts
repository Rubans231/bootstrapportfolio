import { useEffect, useState } from "react";

export function useBoot() {
  const [finished, setFinished] = useState(false);
  const [desktopReady, setDesktopReady] = useState(false);

  const skip = () => {
    setFinished(true);
  };

  useEffect(() => {
    if (!finished) return;

    const timer = setTimeout(() => {
      setDesktopReady(true);
    }, 120);

    return () => clearTimeout(timer);
  }, [finished]);

  return {
    finished,
    desktopReady,
    skip,
  };
}
