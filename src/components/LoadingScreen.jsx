import { useEffect, useRef } from "react";

export default function LoadingScreen() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {});
    }

    return () => {
      // Cleanup when loading screen unmounts
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="loading-screen">
      <audio ref={audioRef} src="/audio/NerdWireLoading.wav" />
      {/* your loading UI */}
    </div>
  );
}
