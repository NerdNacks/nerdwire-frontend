// frontend/src/components/UnreadHexManager.jsx
import { useEffect, useRef } from "react";
import HexWireNode from "./HexWireNode";

export default function UnreadHexManager({
  messages,
  channelId,
  lastOpenedTimestamp,
  onChannelOpened,
}) {
  const wrapperRef = useRef(null);

  // Detect unread boundary
  const firstUnreadIndex = messages.findIndex(
    (m) => m.timestamp > lastOpenedTimestamp
  );

  const hasUnread = firstUnreadIndex !== -1;

  // Determine if ENDED hex should appear at bottom
  const ageMs = Date.now() - lastOpenedTimestamp;
  const showEnded =
    !hasUnread && lastOpenedTimestamp > 0 && ageMs >= 24 * 60 * 60 * 1000;

  // Scroll detection to auto-mark channel opened
  useEffect(() => {
    if (!hasUnread) return;

    const el = wrapperRef.current;
    if (!el) return;

    const onScroll = () => {
      const marker = document.querySelector(".unread-marker-wrapper");
      if (!marker) return;

      const rect = marker.getBoundingClientRect();
      const fullyVisible =
        rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (fullyVisible) {
        onChannelOpened(channelId);
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasUnread, channelId, onChannelOpened]);

  // Build render blocks
  const blocks = [];

  messages.forEach((m, i) => {
    const isUnreadBoundary = hasUnread && i === firstUnreadIndex;

    if (isUnreadBoundary) {
      blocks.push(
        <div className="unread-marker-wrapper" key="unread-marker">
          <HexWireNode lastOpenedTimestamp={lastOpenedTimestamp} />
        </div>
      );
    }

    blocks.push({ type: "message", message: m, index: i });
  });

  // Add ENDED hex at bottom if needed
  if (showEnded) {
    blocks.push(
      <div className="unread-ended-wrapper" key="ended-marker">
        <HexWireNode
          lastOpenedTimestamp={lastOpenedTimestamp}
          onConversationEnded={() => {}}
        />
      </div>
    );
  }

  return { blocks, wrapperRef };
}
