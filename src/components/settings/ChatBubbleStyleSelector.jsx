// FUTURE: Premium Feature Hook
// Premium users could unlock extra bubble styles or per-conversation styles.

export default function ChatBubbleStyleSelector({ bubbleStyle, onChange }) {
  return (
    <div className="app-panel" style={{ padding: 16, marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>Chat Settings</h3>
      <p style={{ marginTop: 0, marginBottom: 12, color: "var(--nw-text-muted)" }}>
        Choose how your chat bubbles look.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          className="nw-button"
          style={{
            borderColor:
              bubbleStyle === "clean"
                ? "var(--nw-accent)"
                : "rgba(255,255,255,0.2)",
          }}
          onClick={() => onChange("clean")}
        >
          Clean Tech
        </button>

        <button
          className="nw-button"
          style={{
            borderColor:
              bubbleStyle === "neon"
                ? "var(--nw-accent)"
                : "rgba(255,255,255,0.2)",
          }}
          onClick={() => onChange("neon")}
        >
          NerdWire Neon
        </button>

        <button
          className="nw-button"
          style={{
            borderColor:
              bubbleStyle === "hybrid"
                ? "var(--nw-accent)"
                : "rgba(255,255,255,0.2)",
          }}
          onClick={() => onChange("hybrid")}
        >
          Hybrid Pulse
        </button>
      </div>
    </div>
  );
}
