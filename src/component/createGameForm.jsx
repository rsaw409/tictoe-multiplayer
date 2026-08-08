import { TextField, Button, InputAdornment, Box, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import KeyIcon from "@mui/icons-material/Key";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import short from "short-uuid";
import ShareButton from "./shareButton";
import { useState, useEffect } from "react";

const CreateGameForm = ({ joinExistingGame, setCreatedGameId }) => {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState(null);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (gameId) {
      setCreatedGameId(gameId);
    }
  }, [gameId, setCreatedGameId]);

  const handleChange = (val) => {
    if (val.length > 0 && errorText.length > 0) setErrorText("");
    setName(val);
  };

  const handleClick = () => {
    if (name.trim().length <= 0) {
      setErrorText("Please enter your player name.");
    } else {
      setGameId(short().generate());
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}>
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#f8fafc" }}>
          {gameId ? "Game Created!" : "Host a Match"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
          {gameId
            ? "Share your room link or game ID with your rival to begin."
            : "Enter your handle to generate a private game room."}
        </Typography>
      </Box>

      <TextField
        error={errorText.length > 0}
        helperText={errorText}
        InputProps={{
          readOnly: !!gameId,
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineIcon sx={{ color: "#14b8a6" }} />
            </InputAdornment>
          ),
        }}
        required
        fullWidth
        type="text"
        value={name}
        onChange={(e) => handleChange(e.target.value)}
        label="Player Handle"
        variant="outlined"
        placeholder="e.g. Maverick"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            background: "rgba(15, 23, 42, 0.6)",
          },
        }}
      />

      {gameId && (
        <TextField
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <KeyIcon sx={{ color: "#f355da" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <ShareButton gameId={gameId} fromBaseUrl={true} />
              </InputAdornment>
            ),
          }}
          fullWidth
          label="Room Code"
          helperText="Copy link or share code directly."
          value={gameId}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              background: "rgba(15, 23, 42, 0.8)",
              borderColor: "rgba(243, 85, 218, 0.3)",
            },
          }}
        />
      )}

      {!gameId ? (
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleClick}
          startIcon={<SportsEsportsIcon />}
          sx={{
            py: 1.5,
            fontSize: "1rem",
            background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
            color: "#0b0f19",
            fontWeight: 700,
            "&:hover": {
              background: "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
              color: "#ffffff",
            },
          }}
        >
          Generate Game Room
        </Button>
      ) : (
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => joinExistingGame(name, gameId)}
          endIcon={<PlayArrowIcon />}
          sx={{
            py: 1.5,
            fontSize: "1rem",
            background: "linear-gradient(135deg, #f355da 0%, #e040fb 100%)",
            color: "#ffffff",
            fontWeight: 700,
            boxShadow: "0 0 20px rgba(243, 85, 218, 0.4)",
            "&:hover": {
              background: "linear-gradient(135deg, #d93bc1 0%, #c526df 100%)",
            },
          }}
        >
          Enter Game Lobby
        </Button>
      )}
    </Box>
  );
};

export default CreateGameForm;

