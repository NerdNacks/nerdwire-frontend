// frontend/src/components/HexWireNode.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/chat.css";

const PHASES = {
  DANCE: "dance",
  SLOW: "slow",
  SAD: "sad",
  ENDED: "ended",
};

const DANCE_ANIMS = [
  "hex-anim-wiggle",
  "hex-anim-pulse",
  "hex-anim-bounce",
  "hex-anim-spin",
  "hex-anim-jitter",
  "hex-anim-sway",
];

const SLOW_ANIMS = [
  "hex-anim-slow-sway",
  "hex-anim-slow-pulse",
  "hex-anim-slow-drift",
];

export default function HexWireNode({
  lastOpenedTimestamp,
  onConversationEnded, // optional callback when phase becomes ENDED
}) {
  const [phase, setPhase] = useState(PHASES.DANCE);
  const [animClass, setAnimClass] = useState("");
  const [isD20, setIsD20] = useState(false);
  const [d20Value, setD20Value] = useState(null); // 1 or 20
  const [tapCount, setTapCount] = useState(0);
  const tapWindowRef = useRef(null);

  const ageMs = useMemo(() => {
    if (!lastOpenedTimestamp) return 0;
    return Date.now() - lastOpenedTimestamp;
  }, [lastOpenedTimestamp]);

  useEffect(() => {
    const h3 = 3 * 60 * 60 * 1000;
    const h9 = 9 * 60 * 60 * 1000;
    const h24 = 24 * 60 * 60 * 1000;

    if (ageMs >= h24) {
      setPhase(PHASES.ENDED);
      onConversationEnded && onConversationEnded();
    } else if (ageMs >= h9) {
      setPhase(PHASES.SAD);
    } else if (ageMs >= h3) {
      setPhase(PHASES.SLOW);
    } else {
      setPhase(PHASES.DANCE);
    }
  }, [ageMs, onConversationEnded]);

  useEffect(() => {
    if (phase === PHASES.ENDED || isD20) {
      setAnimClass("");
      return;
    }

    let active = true;

    const pickAnim = () => {
      if (!active) return;

      if (phase === PHASES.DANCE) {
        const next =
          DANCE_ANIMS[Math.floor(Math.random() * DANCE_ANIMS.length)];
        setAnimClass(next);
      } else if (phase === PHASES.SLOW) {
        const next =
          SLOW_ANIMS[Math.floor(Math.random() * SLOW_ANIMS.length)];
        setAnimClass(next);
      } else if (phase === PHASES.SAD) {
        setAnimClass("hex-anim-sad");
      }

      const delay =
        phase === PHASES.DANCE
          ? 1500 + Math.random() * 2000
          : phase === PHASES.SLOW
          ? 2500 + Math.random() * 3000
          : 4000;

      setTimeout(pickAnim, delay);
    };

    pickAnim();

    return () => {
      active = false;
    };
  }, [phase, isD20]);

  const handleTap = () => {
    if (phase === PHASES.ENDED || isD20) return;

    const now = Date.now();

    if (!tapWindowRef.current) {
      tapWindowRef.current = { start: now, count: 1 };
      setTapCount(1);
    } else {
      const { start, count } = tapWindowRef.current;
      if (now - start > 10000) {
        tapWindowRef.current = { start: now, count: 1 };
        setTapCount(1);
      } else {
        const newCount = count + 1;
        tapWindowRef.current = { start, count: newCount };
        setTapCount(newCount);
      }
    }

    if (tapWindowRef.current.count >= 20) {
      triggerD20();
      tapWindowRef.current = null;
      setTapCount(0);
    }
  };

  const triggerD20 = () => {
    setIsD20(true);
    setAnimClass("hex-anim-d20-roll");
    const roll = Math.random() < 0.5 ? 1 : 20;
    setD20Value(roll);

    setTimeout(() => {
      setIsD20(false);
      setD20Value(null);
    }, 2200);
  };

  if (phase === PHASES.ENDED) {
    return (
      <div className="hex-wire-node telephone-node">
        <span className="session-icon">📞</span>
      </div>
    );
  }

  return (
    <div
      className={`hex-wire-node ${animClass} ${
        phase === PHASES.SAD ? "hex-sad-state" : ""
      }`}
      onClick={handleTap}
    >
      {!isD20 && <div className="hex-core" />}
      {isD20 && (
        <div className="hex-d20">
          <span className="hex-d20-value">{d20Value}</span>
        </div>
      )}
      <div className="hex-sparks-layer" />
    </div>
  );
}
