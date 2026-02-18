import React from "react";
import DMChatWindow from "../components/DMChatWindow";
import FriendsSidebar from "../components/FriendsSidebar";

export default function DMPage() {
  return (
    <div className="page-container">
      <FriendsSidebar />
      <DMChatWindow />
    </div>
  );
}
