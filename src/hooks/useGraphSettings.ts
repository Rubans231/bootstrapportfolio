import { useEffect, useState } from "react";

export interface GraphSettings {
  rotationEnabled: boolean;
  /** 0–1 dial; mapped to an actual OrbitControls autoRotateSpeed internally (3D only) */
  rotationSpeed: number;
  /** 0–1 dial; how much nearby nodes get displaced when you drag a node through them */
  fluidity: number;
  /** 3D sphere/constellation (heavier, WebGL) vs a flat 2D canvas (lighter, no rotation) */
  renderer: "2d" | "3d";
  /** loosen the circle/sphere containment for a more traditional spread-out layout */
  spreadOut: boolean;
  /** 2D only — gentle perpetual ambient motion instead of a static settled layout */
  drift2dEnabled: boolean;
}

export const DEFAULT_GRAPH_SETTINGS: GraphSettings = {
  rotationEnabled: true,
  rotationSpeed: 0.4,
  fluidity: 0.5,
  renderer: "3d",
  spreadOut: false,
  drift2dEnabled: true,
};

const STORAGE_KEY = "naranderos.graphSettings";

export function useGraphSettings() {
  const [settings, setSettings] = useState<GraphSettings>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_GRAPH_SETTINGS;
      return { ...DEFAULT_GRAPH_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_GRAPH_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* localStorage unavailable — setting just won't persist, fine */
    }
  }, [settings]);

  function update<K extends keyof GraphSettings>(key: K, value: GraphSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return { settings, update };
}
