import { usePresence } from "../context/PresenceContext";

export default function DMUserHeader({ otherUser }) {
  const { isOnline } = usePresence();

  if (!otherUser) return null;

  const online = isOnline(otherUser._id);

  return (
    <div className="dm-header">
      <div className="dm-header-avatar">
        {otherUser.username?.[0]?.toUpperCase() || "?"}
      </div>
      <div className="dm-header-info">
        <div className="dm-header-name">{otherUser.username}</div>
        <div className={`dm-header-status ${online ? "online" : "offline"}`}>
          {online ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
}
