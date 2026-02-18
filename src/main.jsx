import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/global.css";

import { PresenceProvider } from "./context/PresenceContext";
import socket from "./socket";

const userId = localStorage.getItem("userId");
if (userId) {
  socket.emit("presence:online", { userId });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PresenceProvider>
      <App />
    </PresenceProvider>
  </React.StrictMode>
);
