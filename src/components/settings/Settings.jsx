import ThemeSelector from "./ThemeSelector";
import ChatBubbleStyleSelector from "./ChatBubbleStyleSelector";
import MusicSettings from "./MusicSettings";

export default function Settings({
  currentTheme,
  onThemeChange,
  bubbleStyle,
  onBubbleStyleChange,
}) {
  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <ThemeSelector currentTheme={currentTheme} onChange={onThemeChange} />

      <ChatBubbleStyleSelector
        bubbleStyle={bubbleStyle}
        onChange={onBubbleStyleChange}
      />

      <MusicSettings currentTheme={currentTheme} onThemeChange={onThemeChange} />
    </div>
  );
}
