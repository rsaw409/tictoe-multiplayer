import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? "https://backend.portfolio.rsaw409.me"
    : "http://localhost:3001";

export const socket = io(URL, {
  path: "/tictoe",
});
