import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { socket } from "./socket.js";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";

import Board from "./board";
import Landing from "./landing";

function App() {
  const [gameId, setGameId] = useState(null);
  const [createdGameId, setCreatedGameId] = useState(null);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const [snackBarMessage, setSnackBarMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarMessage("");
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  useEffect(() => {
    socket.on("users", (data) => {
      console.log("users", data);
      setUsers(data);
    });
  }, [socket]);

  const leftGame = (gameId, userName, reason) => {
    console.log("reason", reason);
    if (reason.length > 0) {
      setSnackBarMessage(reason);
    }

    socket.emit("LeftGame", {
      gameId: gameId,
      userName: userName,
      userId: socket.id,
    });
    setUsers([]);
    setGameId("");
    setCreatedGameId("");
    navigate("/");
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Landing
              socket={socket}
              setRoomId={setGameId}
              setCreatedGameId={setCreatedGameId}
            />
          }
        />
        <Route
          path="/:gameId"
          element={
            <Board
              users={users}
              leaveGame={leftGame}
              socket={socket}
              gameId={gameId}
              createdGameId={createdGameId}
            />
          }
        />
      </Routes>
      <Snackbar
        open={snackBarMessage.length > 0}
        autoHideDuration={3000}
        message={snackBarMessage}
        onClose={handleClose}
        action={action}
      />
    </div>
  );
}

export default App;
