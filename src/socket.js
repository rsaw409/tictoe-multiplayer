import { io } from "socket.io-client";

const URL = import.meta.env.DEV
  ? "http://localhost:3001"
  : "https://backend.portfolio.rsaw409.me";

export const socket = io(URL, {
  path: "/tictoe",
});
