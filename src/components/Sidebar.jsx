// frontend/src/components/sidebar/Sidebar.jsx
import "../../styles/chat.css";
import HexWireNode from "../HexWireNode";

export default function Sidebar({ servers, channels, onSelect, lastOpened }) {
  return (
    <div className="nw-sidebar">
      {/* SERVERS */}
      <div className="nw-sidebar-section">
        <div className="nw-sidebar-title">Servers</div>

        <div className="nw-sidebar-wire" />

        <div className="nw-serverlist">
          {servers.map((s) => {
            const lastOpenedServer =
              lastOpened?.servers?.[s.id] || 0;

            return (
              <div
                key={s.id}
                className="nw-server-icon-wrapper"
                onClick={() => onSelect("server", s.id)}
              >
                <div className="nw-server-icon-hex">
                  {s.icon ? (
                    <img src={s.icon} alt="" className="nw-server-icon-img" />
                  ) : (
                    <div className="nw-server-icon-fallback">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <HexWireNode lastOpenedTimestamp={lastOpenedServer} />
              </div>
            );
          })}
        </div>
      </div>

      {/* CHANNELS */}
      <div className="nw-sidebar-section">
        <div className="nw-sidebar-title">Channels</div>

        <div className="nw-sidebar-wire" />

        {channels.map((c) => {
          const lastOpenedChannel =
            lastOpened?.channels?.[c.id] || 0;

          return (
            <div
              key={c.id}
              className="nw-sidebar-item nw-channel-row"
              onClick={() => onSelect("channel", c.id)}
            >
              <span>#{c.name}</span>
              <HexWireNode lastOpenedTimestamp={lastOpenedChannel} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
