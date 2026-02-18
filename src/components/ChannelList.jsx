export default function ChannelList({
  channels,
  activeChannel,
  onSelectChannel,
  loading,
  error,
  onRetry,
}) {
  return (
    <div className="sidebar-channels">
      <div className="channel-header">TEXT CHANNELS</div>

      {/* Error */}
      {error && (
        <div className="channel-error">
          <p>{error}</p>
          <button onClick={onRetry}>Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && !error && <div className="channel-spinner"></div>}

      {/* Channels */}
      {!loading &&
        !error &&
        channels.map((channel) => (
          <div
            key={channel.id}
            className={`channel-item ${
              activeChannel === channel.id ? "active" : ""
            }`}
            onClick={() => onSelectChannel(channel.id)}
          >
            # {channel.name}
          </div>
        ))}
    </div>
  );
}
