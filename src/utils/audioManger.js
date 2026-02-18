// frontend/src/utils/audioManager.js
const audio = new Audio();
audio.loop = true;

let currentPlaylist = null;

const audioManager = {
  audio, // exposed for visualizer / analyzer

  loadPlaylist(playlist) {
    currentPlaylist = playlist;
  },

  playTrack(index) {
    if (!currentPlaylist || !currentPlaylist.tracks[index]) return;

    const track = currentPlaylist.tracks[index];
    const volume = Number(localStorage.getItem("nw_music_volume") || 0.15);

    audio.src = track.url;
    audio.volume = volume;

    audio.play().catch(() => {});
    localStorage.setItem("nw_music_enabled", "true");
    localStorage.setItem("nw_music_playlist", currentPlaylist.id);
    localStorage.setItem("nw_music_track", index);
  },

  stop() {
    audio.pause();
    localStorage.setItem("nw_music_enabled", "false");
  },

  setVolume(v) {
    audio.volume = v;
    localStorage.setItem("nw_music_volume", v);
  },

  resumeIfEnabled(playlists) {
    const enabled = localStorage.getItem("nw_music_enabled") === "true";
    const playlistId = localStorage.getItem("nw_music_playlist") || "default";
    const trackIndex = Number(localStorage.getItem("nw_music_track") || 0);
    const volume = Number(localStorage.getItem("nw_music_volume") || 0.15);

    audio.volume = volume;

    const playlist = playlists.find((p) => p.id === playlistId) || playlists[0];
    if (!playlist) return;

    currentPlaylist = playlist;

    if (enabled && playlist.tracks[trackIndex]) {
      audio.src = playlist.tracks[trackIndex].url;
      audio.play().catch(() => {});
    }
  },
};

export default audioManager;
