// frontend/src/components/ServerList.jsx
import "../../styles/chat.css";
import HexWireNode from "./HexWireNode";

export default function ServerList({
  servers = [],
  onSelectServer,
  lastOpenedMap = {},
}) {
  return (
    <div className="nw-serverlist">
      {servers.map((server) => {
        const icon = server.icon || null;
        const lastOpened = lastOpenedMap[server.id] || 0;

        return (
          <div
            key={server.id}
            className="nw-server-icon-wrapper"
            onClick={() => onSelectServer(server.id)}
          >
            <div className="nw-server-icon-hex">
              {icon ? (
                <img src={icon} alt="" className="nw-server-icon-img" />
              ) : (
                <div className="nw-server-icon-fallback">
                  {server.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <HexWireNode lastOpenedTimestamp={lastOpened} />
          </div>
        );
      })}
    </div>
  );
}
