// frontend/src/utils/lastOpened.js

const STORAGE_KEY = "nw_last_opened";

function loadLastOpened() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { servers: {}, channels: {}, dms: {} };
    }
    const parsed = JSON.parse(raw);
    return {
      servers: parsed.servers || {},
      channels: parsed.channels || {},
      dms: parsed.dms || {},
    };
  } catch {
    return { servers: {}, channels: {}, dms: {} };
  }
}

function saveLastOpened(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLastOpened() {
  return loadLastOpened();
}

export function markServerOpened(serverId) {
  const data = loadLastOpened();
  data.servers[serverId] = Date.now();
  saveLastOpened(data);
}

export function markChannelOpened(channelId) {
  const data = loadLastOpened();
  data.channels[channelId] = Date.now();
  saveLastOpened(data);
}

export function markDMOpened(userId) {
  const data = loadLastOpened();
  data.dms[userId] = Date.now();
  saveLastOpened(data);
}
