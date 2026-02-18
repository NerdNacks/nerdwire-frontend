import { useEffect, useState } from "react";
import socket from "../socket";

export default function DMVoiceCall({ channel, currentUser }) {
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const handleCallStarted = ({ userId }) => {
      if (userId !== currentUser._id) {
        setInCall(true);
      }
    };

    const handleCallEnded = () => {
      setInCall(false);
    };

    socket.on("dm:voice:call-started", handleCallStarted);
    socket.on("dm:voice:call-ended", handleCallEnded);

    return () => {
      socket.off("dm:voice:call-started", handleCallStarted);
      socket.off("dm:voice:call-ended", handleCallEnded);
    };
  }, [channel._id, currentUser._id]);

  const startCall = () => {
    socket.emit("dm:voice:start-call", {
      channelId: channel._id,
      userId: currentUser._id,
    });
    setInCall(true);
  };

  const endCall = () => {
    socket.emit("dm:voice:end-call", {
      channelId: channel._id,
      userId: currentUser._id,
    });
    setInCall(false);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    socket.emit("dm:voice:mute-toggle", {
      channelId: channel._id,
      userId: currentUser._id,
      muted: next,
    });
  };

  return (
    <div className="dm-voice-call">
      {inCall ? (
        <>
          <span>In call</span>
          <button onClick={toggleMute}>{muted ? "Unmute" : "Mute"}</button>
          <button className="end" onClick={endCall}>
            Leave
          </button>
        </>
      ) : (
        <button onClick={startCall}>Start Voice Call</button>
      )}
    </div>
  );
}
