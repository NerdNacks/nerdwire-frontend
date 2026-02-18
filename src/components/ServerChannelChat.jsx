import { useEffect, useRef, useState } from "react";
import "../styles/chat.css";

import UnreadHexManager from "./UnreadHexManager";
import TypingIndicator from "./TypingIndicator";

export default function ServerChannelChat({
  channel,
  bubbleStyle,
  lastOpenedTimestamp,
  onChannelOpened,
  socket,
  user,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef({}); // per-user timeouts

  // Incoming channel messages
  useEffect(() => {
    if (!socket || !channel) return;

    const handler = (msg) => {
      if (msg.channelId === channel.id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("channel_message", handler);
    return () => socket.off("channel_message", handler);
  }, [socket, channel]);

  // Incoming typing events
  useEffect(() => {
    if (!socket || !channel) return;

    const handleTypingStart = (data) => {
      if (data.channelId !== channel.id || data.userId === user.id) return;

      setTypingUsers((prev) => {
        const exists = prev.some((u) => u.id === data.userId);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: data.userId,
            username: data.username,
            tag: data.tag,
          },
        ];
      });

      // auto-timeout for that user
      clearTimeout(typingTimeoutRef.current[data.userId]);
      typingTimeoutRef.current[data.userId] = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.id !== data.userId));
      }, 3000);
    };

    const handleTypingStop = (data) => {
      if (data.channelId !== channel.id || data.userId === user.id) return;
      setTypingUsers((prev) => prev.filter((u) => u.id !== data.userId));
      clearTimeout(typingTimeoutRef.current[data.userId]);
    };

    socket.on("typing_start", handleTypingStart);
    socket.on("typing_stop", handleTypingStop);

    return () => {
      socket.off("typing_start", handleTypingStart);
      socket.off("typing_stop", handleTypingStop);
    };
  }, [socket, channel, user]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !socket) return;

    const msg = {
      id: Date.now(),
      channelId: channel.id,
      user: user.username,
      tag: user.tag,
      avatar: user.avatar,
      text,
      timestamp: Date.now(),
    };

    socket.emit("channel_message", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");

    socket.emit("typing_stop", {
      channelId: channel.id,
      userId: user.id,
    });
  };

  const handleTypingChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (!socket) return;

    socket.emit("typing_start", {
      channelId: channel.id,
      userId: user.id,
      username: user.username,
      tag: user.tag,
    });

    clearTimeout(typingTimeoutRef.current[user.id]);
    typingTimeoutRef.current[user.id] = setTimeout(() => {
      socket.emit("typing_stop", {
        channelId: channel.id,
        userId: user.id,
      });
    }, 3000);
  };

  const getBubbleClass = (self) => {
    let base = "msg-bubble";
    if (bubbleStyle === "clean") base += " bubble-clean";
    else if (bubbleStyle === "neon") base += " bubble-neon";
    else base += " bubble-hybrid";
    if (self) base += " self-bubble";
    return base;
  };

  const isNewSession = (index) => {
    if (index === 0) return true;
    const prev = messages[index - 1];
    const curr = messages[index];
    return curr.timestamp - prev.timestamp > 24 * 60 * 60 * 1000;
  };

  const { blocks, wrapperRef } = UnreadHexManager({
    messages,
    channelId: channel.id,
    lastOpenedTimestamp,
    onChannelOpened,
  });

  return (
    <div className="chat-root">
      <div className="chat-main">
        <div className="chat-messages-wrapper" ref={wrapperRef}>
          <div className="chat-wire-heavy" />

          <div className="chat-messages">
            {blocks.map((block, idx) => {
              if (block.type !== "message") return block;

              const m = block.message;
              const i = block.index;
              const self = m.user === user.username;
              const newSession = isNewSession(i);

              return (
                <div key={m.id}>
                  {newSession && (
                    <div className="session-marker session-marker-top">
                      <span className="session-icon">📞</span>
                    </div>
                  )}

                  <div className={`msg-row ${self ? "self" : "other"}`}>
                    {!self && (
                      <img src={m.avatar} alt="" className="msg-avatar" />
                    )}

                    <div className="msg-bubble-wrapper">
                      <div
                        className={`msg-connector ${
                          self ? "connector-right" : "connector-left"
                        }`}
                      />
                      <div className={getBubbleClass(self)}>
                        <div className="msg-user">
                          {m.user}
                          {m.tag && <span className="msg-tag">#{m.tag}</span>}
                        </div>
                        <div className="msg-text">{m.text}</div>
                        <div className="msg-time">
                          {new Date(m.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    {self && (
                      <img src={m.avatar} alt="" className="msg-avatar" />
                    )}
                  </div>

                  {i === messages.length - 1 && (
                    <div className="session-marker session-marker-bottom">
                      <span className="session-icon">📞</span>
                    </div>
                  )}
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>
        </div>

        {typingUsers.length > 0 && (
          <TypingIndicator usersTyping={typingUsers} />
        )}

        <div className="chat-input-bar">
          <input
            className="chat-input"
            placeholder="Send a message..."
            value={text}
            onChange={handleTypingChange}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="chat-send-btn" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
