import React from "react";
import Sidebar from "../components/Sidebar";
import ChannelList from "../components/ChannelList";
import ChatWindow from "../components/ChatWindow";

export default function ServerPage() {
  return (
    <div className="page-container">
      <Sidebar />
      <ChannelList />
      <ChatWindow />
    </div>
  );
}
