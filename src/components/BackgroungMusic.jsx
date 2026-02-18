import { useEffect } from "react";
import audioManager from "../utils/audioManager";

// Import your 8 WAV files
import track1 from "../assets/audio/1. The sound of Morning.wav";
import track2 from "../assets/audio/2. Ray of Sunshine.wav";
import track3 from "../assets/audio/3. Leaves Descending.wav";
import track4 from "../assets/audio/4. Rushing Wind.wav";
import track5 from "../assets/audio/5. Puddles in the Rain.wav";
import track6 from "../assets/audio/6. Lightning Strikes.wav";
import track7 from "../assets/audio/7. Falling star.wav";
import track8 from "../assets/audio/8. The End.wav";

export default function BackgroundMusic() {
  useEffect(() => {
    audioManager.loadTracks([
      { name: "The Sound of Morning", url: track1 },
      { name: "Ray of Sunshine", url: track2 },
      { name: "Leaves Descending", url: track3 },
      { name: "Rushing Wind", url: track4 },
      { name: "Puddles in the Rain", url: track5 },
      { name: "Lightning Strikes", url: track6 },
      { name: "Falling Star", url: track7 },
      { name: "The End", url: track8 },
    ]);

    audioManager.resumeIfEnabled();
  }, []);

  return null;
}
