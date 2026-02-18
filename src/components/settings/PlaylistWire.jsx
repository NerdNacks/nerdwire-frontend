// frontend/src/components/settings/PlaylistWire.jsx
import { useMemo, useState, useRef, useEffect } from "react";
import audioManager from "../../utils/audioManager";

export default function PlaylistWire({
  playlist,
  activeTrackIndex,
  onSelectTrack,
}) {
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startRotation, setStartRotation] = useState(0);

  const [corePulse, setCorePulse] = useState(1);
  const [coreColor, setCoreColor] = useState("#00ffc8");
  const [coreFlash, setCoreFlash] = useState(false);
  const [idleBreath, setIdleBreath] = useState(1);

  const velocityRef = useRef(0);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const momentumFrame = useRef(null);
  const snapTimeout = useRef(null);

  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  const dataPulseAngleRef = useRef(0);

  // AUDIO ANALYZER (beat + color + breathing + pulses)
  useEffect(() => {
    if (!audioManager.audio) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audioManager.audio);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    let breathPhase = 0;

    const animatePulse = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      let bass = 0;
      for (let i = 0; i < 10; i++) bass += dataArrayRef.current[i];
      bass /= 10;

      let mids = 0;
      for (let i = 10; i < 40; i++) mids += dataArrayRef.current[i];
      mids /= 30;

      let highs = 0;
      for (let i = 40; i < 80; i++) highs += dataArrayRef.current[i];
      highs /= 40;

      const totalEnergy = (bass + mids + highs) / 3;

      const pulse = 1 + (bass / 255) * 0.4;
      setCorePulse(pulse);

      const bassWeight = bass / 255;
      const midWeight = mids / 255;
      const highWeight = highs / 255;

      const r =
        bassWeight * 0 +
        midWeight * 255 +
        highWeight * 255;

      const g =
        bassWeight * 255 +
        midWeight * 0 +
        highWeight * 255;

      const b =
        bassWeight * 200 +
        midWeight * 255 +
        highWeight * 255;

      setCoreColor(`rgb(${r}, ${g}, ${b})`);

      if (totalEnergy < 20) {
        breathPhase += 0.03;
        const breath = 1 + Math.sin(breathPhase) * 0.05;
        setIdleBreath(breath);
      } else {
        setIdleBreath(1);
      }

      dataPulseAngleRef.current =
        (dataPulseAngleRef.current + 1.5) % 360;

      requestAnimationFrame(animatePulse);
    };

    animatePulse();
  }, []);

  const nodes = useMemo(() => {
    if (!playlist) return [];
    const total = playlist.tracks.length || 1;
    return playlist.tracks.map((track, index) => {
      const angle = (index / total) * 360;
      return { ...track, angle, index };
    });
  }, [playlist]);

  const radius = 110;

  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    setDragging(true);
    setStartAngle(angle);
    setStartRotation(rotation);

    lastAngleRef.current = angle;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    if (momentumFrame.current) cancelAnimationFrame(momentumFrame.current);
    if (snapTimeout.current) clearTimeout(snapTimeout.current);
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const delta = angle - startAngle;
    setRotation(startRotation + delta);

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      const da = angle - lastAngleRef.current;
      velocityRef.current = da / dt;
    }

    lastAngleRef.current = angle;
    lastTimeRef.current = now;
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
      startMomentumSpin();
    }
  };

  const startMomentumSpin = () => {
    let velocity = velocityRef.current * 16;
    const friction = 0.92;

    const animate = () => {
      velocity *= friction;

      if (Math.abs(velocity) < 0.1) {
        scheduleSnap();
        return;
      }

      setRotation((prev) => prev + velocity);
      momentumFrame.current = requestAnimationFrame(animate);
    };

    momentumFrame.current = requestAnimationFrame(animate);
  };

  const handleWheel = (e) => {
    e.preventDefault();

    const sensitivity = 2;
    setRotation((prev) => prev + e.deltaY * sensitivity);

    if (momentumFrame.current) cancelAnimationFrame(momentumFrame.current);
    if (snapTimeout.current) clearTimeout(snapTimeout.current);

    scheduleSnap();
  };

  const scheduleSnap = () => {
    snapTimeout.current = setTimeout(() => {
      snapToNearestHex();
    }, 120);
  };

  const snapToNearestHex = () => {
    if (!nodes.length) return;

    let normalized = ((rotation % 360) + 360) % 360;

    let closest = null;
    let smallestDiff = Infinity;

    nodes.forEach((node) => {
      const diff = Math.abs(normalized - node.angle);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closest = node;
      }
    });

    if (!closest) return;

    const targetRotation = rotation - (normalized - closest.angle);

    setRotation(targetRotation);

    onSelectTrack(closest.index);
    audioManager.playTrack(closest.index);

    setCoreFlash(true);
    setTimeout(() => setCoreFlash(false), 120);
  };

  const handleNodeClick = (index) => {
    onSelectTrack(index);
    audioManager.playTrack(index);

    const total = nodes.length;
    const angle = (index / total) * 360;

    const normalized = ((rotation % 360) + 360) % 360;
    const targetRotation = rotation - (normalized - angle);

    setRotation(targetRotation);

    setCoreFlash(true);
    setTimeout(() => setCoreFlash(false), 120);
  };

  const pulseRadius = radius + 6;
  const pulseAngle1 = dataPulseAngleRef.current;
  const pulseAngle2 = (dataPulseAngleRef.current + 180) % 360;

  const rad1 = (pulseAngle1 * Math.PI) / 180;
  const rad2 = (pulseAngle2 * Math.PI) / 180;

  const pulse1 = {
    left: 150 + pulseRadius * Math.cos(rad1),
    top: 150 + pulseRadius * Math.sin(rad1),
  };

  const pulse2 = {
    left: 150 + pulseRadius * Math.cos(rad2),
    top: 150 + pulseRadius * Math.sin(rad2),
  };

  return (
    <div
      className="wire-loop-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <div
        className="wire-loop"
        style={{ transform: `rotate(${rotation}deg)` }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="wire-data-pulse"
          style={{ left: pulse1.left, top: pulse1.top }}
        />
        <div
          className="wire-data-pulse"
          style={{ left: pulse2.left, top: pulse2.top }}
        />

        {nodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = 150 + radius * Math.cos(rad);
          const y = 150 + radius * Math.sin(rad);
          const isActive = node.index === activeTrackIndex;

          return (
            <div
              key={node.id}
              className={`wire-node ${isActive ? "active" : ""}`}
              style={{ left: x, top: y }}
              onClick={() => handleNodeClick(node.index)}
            >
              <div className="wire-node-hex" />
              <div className="wire-node-label">
                <span className="wire-node-title">{node.name}</span>
                <span className="wire-node-length">{node.length}</span>
              </div>
            </div>
          );
        })}

        <div
          className={`wire-core ${coreFlash ? "flash" : ""}`}
          style={{
            transform: `scale(${corePulse * idleBreath})`,
            background: coreColor,
            boxShadow: `0 0 25px ${coreColor}`,
          }}
        />
      </div>
    </div>
  );
}
