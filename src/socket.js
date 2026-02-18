import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE;

const socket = io(SOCKET_URL, {
  withCredentials: false,
});

export default socket;
