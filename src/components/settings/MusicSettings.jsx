// frontend/src/components/settings/MusicSettings.jsx
import { useState, useEffect } from "react";
import playlistsManager from "../../utils/playlistsManager";
import audioManager from "../../utils/audioManager.js";

import PlaylistWire from "./PlaylistWire";
import ThemeSelector from "./ThemeSelector";

export default function MusicSettings({ currentTheme, onThemeChange }) {
  const defaultPlaylist = {
    id: "default",
    name: "NerdWire Default",
    tracks: [],
  };

  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  useEffect(() => {
    const loaded = playlistsManager.getPlaylists(defaultPlaylist);
    setPlaylists(loaded);

    const savedId = localStorage.getItem("nw_music_playlist") || "default";
    const found = loaded.find((p) => p.id === savedId) || loaded[0];

    setActivePlaylist(found);
  }, []);

  const handleSelectTrack = (index) => {
    setActiveTrackIndex(index);
    audioManager.loadPlaylist(activePlaylist);
    audioManager.playTrack(index);
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      {/* THEME SELECTOR */}
      <ThemeSelector currentTheme={currentTheme} onChange={onThemeChange} />

      {/* FUTURE: Premium Feature Hook
         Premium users may unlock:
         - More playlists
         - More tracks per playlist
         - Cloud sync
         - Custom playlist icons
      */}

      <h2 style={{ marginBottom: 12 }}>Background Music</h2>

      {activePlaylist && (
        <PlaylistWire
          playlist={activePlaylist}
          activeTrackIndex={activeTrackIndex}
          onSelectTrack={handleSelectTrack}
        />
      )}

      <div style={{ marginTop: 20 }}>
        <h3>Your Playlists</h3>

        {playlists.map((p) => (
          <button
            key={p.id}
            className="nw-button"
            style={{
              marginRight: 8,
              marginBottom: 8,
              borderColor:
                activePlaylist?.id === p.id
                  ? "var(--nw-accent)"
                  : "rgba(255,255,255,0.2)",
            }}
            onClick={() => setActivePlaylist(p)}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
