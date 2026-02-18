import React from "react";
import "../styles/chat.css";

export default function TypingIndicator({ usersTyping }) {
  if (!usersTyping || usersTyping.length === 0) return null;

  let message = "";

  if (usersTyping.length === 1) {
    const u = usersTyping[0];
    const label = `${u.username}#${u.tag}`;
    message = `signal incoming from ${label}…`;
  } else if (usersTyping.length === 2) {
    message = "watch out for floods…";
  } else {
    message = "here comes a tsunami…";
  }

  return (
    <div className="typing-indicator-wrapper">
      <div className="typing-wire-curve" />
      <div className="typing-indicator">
        <div className="typing-hex-row">
          {usersTyping.map((u) => (
            <div className="typing-hex" key={u.id} />
          ))}
        </div>
        <span className="typing-text">{message}</span>
      </div>
    </div>
  );
}
