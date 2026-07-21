import { useState } from "react";
import { Settings2, X } from "lucide-react";
import type { GraphSettings } from "../../hooks/useGraphSettings";

interface Props {
  settings: GraphSettings;
  onChange: <K extends keyof GraphSettings>(key: K, value: GraphSettings[K]) => void;
}

export default function GraphSettingsPanel({ settings, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="graph-settings">
      <button
        className="graph-settings-toggle"
        onClick={() => setOpen((v) => !v)}
        title="Graph effects"
        aria-expanded={open}
      >
        {open ? <X size={14} /> : <Settings2 size={14} />}
      </button>

      {open && (
        <div className="graph-settings-panel">
          <p className="graph-settings-title">graph effects</p>

          <label className="graph-settings-row">
            <span>renderer</span>
            <span className="graph-settings-segmented">
              <button
                className={settings.renderer === "3d" ? "active" : ""}
                onClick={() => onChange("renderer", "3d")}
              >
                3D
              </button>
              <button
                className={settings.renderer === "2d" ? "active" : ""}
                onClick={() => onChange("renderer", "2d")}
              >
                2D
              </button>
            </span>
          </label>

          <label className="graph-settings-row">
            <span>spread out</span>
            <input
              type="checkbox"
              checked={settings.spreadOut}
              onChange={(e) => onChange("spreadOut", e.target.checked)}
            />
          </label>

          {settings.renderer === "3d" && (
            <>
              <label className="graph-settings-row">
                <span>idle rotation</span>
                <input
                  type="checkbox"
                  checked={settings.rotationEnabled}
                  onChange={(e) => onChange("rotationEnabled", e.target.checked)}
                />
              </label>

              <label className="graph-settings-row graph-settings-slider-row">
                <span>rotation speed</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.rotationSpeed}
                  disabled={!settings.rotationEnabled}
                  onChange={(e) => onChange("rotationSpeed", Number(e.target.value))}
                />
              </label>
            </>
          )}

          {settings.renderer === "2d" && (
            <label className="graph-settings-row">
              <span>slow drift</span>
              <input
                type="checkbox"
                checked={settings.drift2dEnabled}
                onChange={(e) => onChange("drift2dEnabled", e.target.checked)}
              />
            </label>
          )}

          <label className="graph-settings-row graph-settings-slider-row">
            <span>drag fluidity</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.fluidity}
              onChange={(e) => onChange("fluidity", Number(e.target.value))}
            />
          </label>

          {settings.renderer === "2d" && (
            <p className="graph-settings-note">
              2D is a lighter flat canvas — no WebGL, better on older devices.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
