import { useEffect, useState } from "react";

export function useBoot() {
  const [finished, setFinished] = useState(false);

  // boot overlay fading
  const [fading, setFading] = useState(false);

  // desktop animations enabled
  const [desktopReady, setDesktopReady] = useState(false);

  const skip = () => {
    if (finished || fading) return;

    setFading(true);

    // allow overlay to fade first
    setTimeout(() => {
      setFinished(true);
      setDesktopReady(true);
    }, 220);
  };

  return {
    finished,
    fading,
    desktopReady,
    skip,
  };
}
