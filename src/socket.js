import { io } from "socket.io-client";

// Force production backend URL
const SOCKET_URL = "https://nerdwire-backend.onrender.com";

const socket = io(SOCKET_URL, {
  withCredentials: false,
});

export default socket;
