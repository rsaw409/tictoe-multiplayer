import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { socket } from "./socket.js";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Board from "./board";
import Landing from "./landing";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#14b8a6",
      contrastText: "#0b0f19",
    },
    secondary: {
      main: "#f355da",
    },
    background: {
      default: "#0b0f19",
      paper: "rgba(17, 24, 39, 0.8)",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: "'Outfit', sans-serif" },
    h2: { fontFamily: "'Outfit', sans-serif" },
    h3: { fontFamily: "'Outfit', sans-serif" },
    h4: { fontFamily: "'Outfit', sans-serif" },
    h5: { fontFamily: "'Outfit', sans-serif" },
    h6: { fontFamily: "'Outfit', sans-serif" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 0 20px rgba(20, 184, 166, 0.4)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            color: "#f8fafc",
          },
        },
      },
    },
  },
});

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
    if (reason && reason.length > 0) {
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
          autoHideDuration={3500}
          message={snackBarMessage}
          onClose={handleClose}
          action={action}
          ContentProps={{
            sx: {
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "12px",
              backdropFilter: "blur(12px)",
              color: "#f8fafc",
              fontWeight: 500,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;

