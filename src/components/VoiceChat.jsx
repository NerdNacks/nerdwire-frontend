import { useEffect, useRef, useState } from "react";
import socket from "../socket";

export default function VoiceChat({ channel }) {
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(true);
  const [pushToTalk, setPushToTalk] = useState(false);

  const localStream = useRef(null);
  const peers = useRef({});

  // Join voice channel
  const joinVoice = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    setJoined(true);
    socket.emit("voice:join", channel._id);
  };

  // Leave voice channel
  const leaveVoice = () => {
    setJoined(false);
    socket.emit("voice:leave", channel._id);

    Object.values(peers.current).forEach((pc) => pc.close());
    peers.current = {};
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted((m) => !m);
    localStream.current.getAudioTracks()[0].enabled = muted;
  };

  // Push-to-talk key handling
  useEffect(() => {
    if (!pushToTalk) return;

    const down = () => {
      localStream.current.getAudioTracks()[0].enabled = true;
    };

    const up = () => {
      localStream.current.getAudioTracks()[0].enabled = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [pushToTalk]);

  // WebRTC signaling
  useEffect(() => {
    if (!joined) return;

    socket.on("voice:user-joined", async (id) => {
      const pc = new RTCPeerConnection();
      peers.current[id] = pc;

      localStream.current.getTracks().forEach((t) =>
        pc.addTrack(t, localStream.current)
      );

      pc.ontrack = (e) => {
        const audio = new Audio();
        audio.srcObject = e.streams[0];
        audio.play();
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("voice:offer", { target: id, offer });
    });

    socket.on("voice:offer", async ({ sender, offer }) => {
      const pc = new RTCPeerConnection();
      peers.current[sender] = pc;

      localStream.current.getTracks().forEach((t) =>
        pc.addTrack(t, localStream.current)
      );

      pc.ontrack = (e) => {
        const audio = new Audio();
        audio.srcObject = e.streams[0];
        audio.play();
      };

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("voice:answer", { target: sender, answer });
    });

    socket.on("voice:answer", async ({ sender, answer }) => {
      await peers.current[sender].setRemoteDescription(answer);
    });

    socket.on("voice:candidate", ({ sender, candidate }) => {
      peers.current[sender].addIceCandidate(candidate);
    });

    return () => {
      socket.off("voice:user-joined");
      socket.off("voice:offer");
      socket.off("voice:answer");
      socket.off("voice:candidate");
    };
  }, [joined]);

  return (
    <div className="voice-chat">
      {!joined ? (
        <button onClick={joinVoice}>Join Voice</button>
      ) : (
        <>
          <button onClick={leaveVoice}>Leave Voice</button>
          <button onClick={toggleMute}>{muted ? "Unmute" : "Mute"}</button>

          <label>
            <input
              type="checkbox"
              checked={pushToTalk}
              onChange={() => setPushToTalk((p) => !p)}
            />
            Push to Talk
          </label>
        </>
      )}
    </div>
  );
}
