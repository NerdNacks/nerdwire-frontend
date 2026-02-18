// frontend/src/utils/playlistsManager.js
const STORAGE_KEY = "nw_playlists";

function loadPlaylists() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function savePlaylists(playlists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
}

function ensureDefaultPlaylist(defaultPlaylist) {
  let playlists = loadPlaylists();
  const hasDefault = playlists.some((p) => p.id === "default");

  if (!hasDefault) {
    playlists = [defaultPlaylist, ...playlists];
    savePlaylists(playlists);
  }

  return playlists;
}

const playlistsManager = {
  getPlaylists(defaultPlaylist) {
    return ensureDefaultPlaylist(defaultPlaylist);
  },

  save(playlists) {
    savePlaylists(playlists);
  },

  createPlaylist(name, defaultPlaylist) {
    let playlists = ensureDefaultPlaylist(defaultPlaylist);

    // FUTURE: Premium Feature Hook
    // Free users: max 5 playlists.
    // Premium users: increase/remove this limit by checking user.isPremium.
    if (playlists.length >= 5) return { ok: false, reason: "limit" };

    const id = `pl_${Date.now()}`;
    playlists.push({ id, name, tracks: [] });
    savePlaylists(playlists);
    return { ok: true, playlists };
  },

  deletePlaylist(id, defaultPlaylist) {
    let playlists = ensureDefaultPlaylist(defaultPlaylist);
    if (id === "default") return { ok: false, reason: "nodefault" };

    playlists = playlists.filter((p) => p.id !== id);
    savePlaylists(playlists);
    return { ok: true, playlists };
  },

  addTrackToPlaylist(playlistId, track, defaultPlaylist) {
    const playlists = ensureDefaultPlaylist(defaultPlaylist);

    const updated = playlists.map((p) => {
      if (p.id !== playlistId) return p;

      // FUTURE: Premium Feature Hook
      // Free users: max 50 tracks per playlist.
      // Premium users: increase/remove this limit.
      if (p.tracks.length >= 50) {
        return { ...p, tooMany: true };
      }

      if (p.tracks.some((t) => t.id === track.id)) return p;

      return { ...p, tracks: [...p.tracks, track] };
    });

    savePlaylists(updated);
    return updated;
  },

  removeTrackFromPlaylist(playlistId, trackId, defaultPlaylist) {
    const playlists = ensureDefaultPlaylist(defaultPlaylist);
    const updated = playlists.map((p) =>
      p.id !== playlistId
        ? p
        : { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
    );
    savePlaylists(updated);
    return updated;
  },
};

export default playlistsManager;
