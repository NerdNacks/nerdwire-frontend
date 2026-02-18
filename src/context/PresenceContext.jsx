import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket";
import React from "react";

const PresenceContext = createContext(null);

export function PresenceProvider({ children }) {
  const [onlineUsers, setOnlineUsers] = useState({}); // { userId: true/false }

  useEffect(() => {
    const handleUpdate = ({ userId, online }) => {
      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: online,
      }));
    };

    socket.on("presence:update", handleUpdate);

    return () => {
      socket.off("presence:update", handleUpdate);
    };
  }, []);

  const value = {
    onlineUsers,
    isOnline: (userId) => !!onlineUsers[userId],
  };

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence() {
  return useContext(PresenceContext);
}
