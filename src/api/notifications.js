const API_BASE = "http://localhost:4000";

export async function fetchNotifications() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function markNotificationRead(id) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/notifications/read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });
  return res.json();
}

export async function markAllNotificationsRead() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/notifications/read-all`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
