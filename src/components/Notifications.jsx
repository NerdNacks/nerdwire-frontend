import { useEffect, useState } from "react";
import socket from "../socket";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../api/notifications";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetchNotifications().then((data) => {
      setNotifications(data || []);
    });

    socket.emit("notifications:join", { userId });

    const handleNew = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    socket.on("notification:new", handleNew);

    return () => {
      socket.off("notification:new", handleNew);
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRead = async (id) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const handleReadAll = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="notifications-wrapper">
      <button className="notifications-button" onClick={() => setOpen(!open)}>
        Notifications
        {unreadCount > 0 && (
          <span className="notifications-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <span>Notifications</span>
            {notifications.length > 0 && (
              <button onClick={handleReadAll}>Mark all as read</button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 && (
              <div className="notifications-empty">No notifications</div>
            )}

            {notifications.map((n) => (
              <div
                key={n._id}
                className={
                  "notification-item" + (n.read ? " read" : " unread")
                }
                onClick={() => handleRead(n._id)}
              >
                <div className="notification-message">{n.message}</div>
                <div className="notification-time">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
