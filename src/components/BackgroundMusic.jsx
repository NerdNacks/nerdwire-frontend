import { useEffect, useState } from "react";
import audioManager from "../utils/audioManager";
import playlistsManager from "../utils/playlistsManager";

import track1 from "../assets/audio/1. The sound of Morning.wav";
import track2 from "../assets/audio/2. Ray of Sunshine.wav";
import track3 from "../assets/audio/3. Leaves Descending.wav";
import track4 from "../assets/audio/4. Rushing Wind.wav";
import track5 from "../assets/audio/5. Puddles in the Rain.wav";
import track6 from "../assets/audio/6. Lightning Strikes.wav";
import track7 from "../assets/audio/7. Falling star.wav";
import track8 from "../assets/audio/8. The End.wav";

export const defaultPlaylist = {
  id: "default",
  name: "NerdWire Default",
  tracks: [
    { id: "nw1", name: "The Sound of Morning", url: track1, length: "2:41" },
    { id: "nw2", name: "Ray of Sunshine", url: track2, length: "3:05" },
    { id: "nw3", name: "Leaves Descending", url: track3, length: "2:52" },
    { id: "nw4", name: "Rushing Wind", url: track4, length: "3:10" },
    { id: "nw5", name: "Puddles in the Rain", url: track5, length: "2:58" },
    { id: "nw6", name: "Lightning Strikes", url: track6, length: "3:20" },
    { id: "nw7", name: "Falling Star", url: track7, length: "2:47" },
    { id: "nw8", name: "The End", url: track8, length: "3:00" },
  ],
};

export default function BackgroundMusic() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const pls = playlistsManager.getPlaylists(defaultPlaylist);
    setPlaylists(pls);
    audioManager.resumeIfEnabled(pls);
  }, []);

  return null;
}
