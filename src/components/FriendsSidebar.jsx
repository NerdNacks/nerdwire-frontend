// frontend/src/components/sidebar/FriendsSidebar.jsx
import { useEffect, useState } from "react";
import { usePresence } from "../context/PresenceContext";
import "../../styles/chat.css";
import HexWireNode from "../HexWireNode";

const API_BASE = "http://localhost:4000";

export default function FriendsSidebar({ onSelectFriend, lastOpened }) {
  const [friends, setFriends] = useState([]);
  const { isOnline } = usePresence();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/friends`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setFriends(data);
        else setFriends([]);
      })
      .catch(() => setFriends([]));
  }, []);

  return (
    <div className="nw-friends-sidebar">
      <div className="nw-sidebar-title">Friends</div>

      <div className="nw-sidebar-wire" />

      <div className="nw-friends-list">
        {friends.map((f) => {
          const user = f.friend || f;
          const online = isOnline(user._id);
          const lastOpenedDM = lastOpened?.dms?.[user._id] || 0;

          return (
            <div
              key={user._id}
              className="nw-friend-item"
              onClick={() => onSelectFriend && onSelectFriend(user)}
            >
              <div className="nw-friend-avatar-wrapper">
                <img src={user.avatar} alt="" className="nw-friend-avatar" />
                <span
                  className={`nw-friend-status ${
                    online ? "status-online" : "status-offline"
                  }`}
                />
              </div>

              <div className="nw-friend-info">
                <div className="nw-friend-name">{user.username}</div>
                <div className="nw-friend-sub">
                  {online ? "Online" : "Offline"}
                </div>
              </div>

              <HexWireNode lastOpenedTimestamp={lastOpenedDM} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
