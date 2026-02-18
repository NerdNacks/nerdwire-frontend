// frontend/src/components/settings/ThemeSelector.jsx

// FUTURE: Premium Feature Hook
// Premium users can unlock:
// - Custom themes
// - Animated themes
// - User-created themes
// Add premium checks here when implementing NerdWire Premium.

export default function ThemeSelector({ currentTheme, onChange }) {
  return (
    <div className="app-panel" style={{ padding: 16, marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>Theme</h3>
      <p style={{ marginTop: 0, marginBottom: 12, color: "var(--nw-text-muted)" }}>
        Choose how NerdWire looks.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          className="nw-button"
          style={{
            borderColor:
              currentTheme === "cyberpunk"
                ? "var(--nw-accent)"
                : "rgba(255,255,255,0.2)",
          }}
          onClick={() => onChange("cyberpunk")}
        >
          Heavy Cyberpunk
        </button>

        <button
          className="nw-button"
          style={{
            borderColor:
              currentTheme === "nerdwire"
                ? "var(--nw-accent)"
                : "rgba(255,255,255,0.2)",
          }}
          onClick={() => onChange("nerdwire")}
        >
          NerdWire Signature
        </button>

        <button
          className="nw-button"
          style={{
            borderColor:
              currentTheme === "minimal"
                ? "var(--nw-accent)"
                : "rgba(255,255,255,0.2)",
          }}
          onClick={() => onChange("minimal")}
        >
          Minimal Techno
        </button>
      </div>
    </div>
  );
} 
