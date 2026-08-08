import React, { useState } from "react";
import { TextField, Button, Box, Typography, InputAdornment } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import KeyIcon from "@mui/icons-material/Key";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const JoinGameForm = ({ joinExistingGame, gameIdFromUrl }) => {
  const [name, setName] = useState("");
  const [errorTextForName, setErrorTextForName] = useState("");

  const handleChange = (val) => {
    if (val.length > 0 && errorTextForName.length > 0) setErrorTextForName("");
    setName(val);
  };

  const handleSubmit = () => {
    if (name.trim().length <= 0) {
      setErrorTextForName("Please enter your player handle.");
      return;
    }
    if (name && gameIdFromUrl) {
      joinExistingGame(name, gameIdFromUrl);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}>
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#f8fafc" }}>
          You're Invited to a Match!
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
          Enter your name below to jump straight into the arena.
        </Typography>
      </Box>

      <TextField
        label="Your Player Handle"
        type="text"
        required
        fullWidth
        variant="outlined"
        placeholder="e.g. Challenger"
        error={errorTextForName.length > 0}
        helperText={errorTextForName}
        value={name}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineIcon sx={{ color: "#f355da" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            background: "rgba(15, 23, 42, 0.6)",
          },
        }}
        onChange={(e) => handleChange(e.target.value)}
      />

      <TextField
        label="Target Room Code"
        type="text"
        required
        fullWidth
        variant="outlined"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <KeyIcon sx={{ color: "#14b8a6" }} />
            </InputAdornment>
          ),
        }}
        value={gameIdFromUrl}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            background: "rgba(15, 23, 42, 0.8)",
            borderColor: "rgba(20, 184, 166, 0.3)",
          },
        }}
      />

      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleSubmit}
        endIcon={<PlayArrowIcon />}
        sx={{
          py: 1.5,
          fontSize: "1rem",
          background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
          color: "#0b0f19",
          fontWeight: 700,
          boxShadow: "0 0 20px rgba(20, 184, 166, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
            color: "#ffffff",
          },
        }}
      >
        Join Match Now
      </Button>
    </Box>
  );
};

export default JoinGameForm;

