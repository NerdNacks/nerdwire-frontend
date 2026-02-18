// frontend/src/components/home/Home.jsx
import { useState } from "react";

import ServerList from "../ServerList.jsx";
import ChannelList from "../ChannelList.jsx";
import CreateChannelModal from "../CreateChannelModal.jsx";
import ServerChannelChat from "../ServerChannelChat.jsx";
import VoiceChat from "../VoiceChat.jsx";

import FriendsSidebar from "../FriendsSidebar.jsx";
import AddFriendModal from "../AddFriendModal.jsx";
import DMChatWindow from "../DMChatWindow.jsx";

export default function Home({
  bubbleStyle,
  lastOpened,
  onServerOpened,
  onChannelOpened,
  onDMOpened,
}) {
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [activeDMChannel, setActiveDMChannel] = useState(null);

  const [showCreateChannel, setShowCreateChannel] = useState(false);

  const handleChannelCreated = (channel) => {
    console.log("Channel created:", channel);
  };

  return (
    <div className="layout">
      <ServerList
        servers={[]}
        lastOpenedMap={lastOpened.servers}
        onSelectServer={(serverId) => {
          onServerOpened(serverId);
          setSelectedServer(serverId);
          setSelectedChannel(null);
          setActiveDMChannel(null);
        }}
      />

      {selectedServer && (
        <ChannelList
          server={selectedServer}
          lastOpened={lastOpened.channels}
          onSelect={(channel) => {
            onChannelOpened(channel.id);
            setSelectedChannel(channel);
            setActiveDMChannel(null);
          }}
          onCreateClick={() => setShowCreateChannel(true)}
        />
      )}

      {selectedChannel && selectedChannel.type === "text" && (
        <ServerChannelChat
          channel={selectedChannel}
          bubbleStyle={bubbleStyle}
          lastOpenedTimestamp={lastOpened.channels[selectedChannel.id] || 0}
          onChannelOpened={onChannelOpened}
        />
      )}

      {selectedChannel && selectedChannel.type === "voice" && (
        <VoiceChat channel={selectedChannel} />
      )}

      {activeDMChannel && (
       <DMChatWindow
          socket={socket}
          user={user}
          targetUser={selectedFriend}
          bubbleStyle={bubbleStyle}
          lastOpenedTimestamp={lastOpened.dms[selectedFriend._id] || 0}
          onDMOpened={onDMOpened}
        />
      )}

      <FriendsSidebar
        lastOpened={lastOpened}
        onSelectFriend={(friend) => {
          setSelectedFriend(friend);
          setSelectedChannel(null);

          onDMOpened(friend._id);

          fetch("http://localhost:4000/dm/open", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ targetUserId: friend._id }),
          })
            .then((res) => res.json())
            .then((channel) => {
              setActiveDMChannel(channel);
            });
        }}
      />

      {showAddFriend && (
        <AddFriendModal onClose={() => setShowAddFriend(false)} />
      )}

      {showCreateChannel && selectedServer && (
        <CreateChannelModal
          server={selectedServer}
          onClose={() => setShowCreateChannel(false)}
          onCreated={handleChannelCreated}
        />
      )}

      <button
        className="add-friend-button"
        onClick={() => setShowAddFriend(true)}
      >
        Add Friend
      </button>
    </div>
  );
}
