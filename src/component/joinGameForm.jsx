import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const JoinGameForm = ({ joinExistingGame, gameIdFromUrl }) => {
  const [name, setName] = useState("");
  const [errorTextForName, setErrorTextForName] = useState("");

  const handleChange = (name) => {
    if (name.length > 0 && errorTextForName.length > 0) setErrorTextForName("");
    setName(name);
  };

  const handleSubmit = () => {
    if (name.length <= 0) {
      setErrorTextForName("Please Give Your Name.");
    }
    if (name && gameIdFromUrl) {
      joinExistingGame(name, gameIdFromUrl);
    }
  };

  return (
    <>
      <TextField
        label="Name"
        type="text"
        required
        fullWidth
        variant="standard"
        margin="normal"
        error={errorTextForName.length === 0 ? false : true}
        helperText={errorTextForName}
        InputProps={{
          disableUnderline: name?.trim()?.length ? true : false,
        }}
        onChange={(e) => handleChange(e.target.value)}
      />

      <TextField
        label="Game Id"
        type="text"
        required
        fullWidth
        variant="standard"
        margin="normal"
        InputProps={{
          readOnly: true,
          disableUnderline: true,
        }}
        value={gameIdFromUrl}
      />
      <br />
      <Button variant="contained" onClick={handleSubmit}>
        Join Game
      </Button>
    </>
  );
};

export default JoinGameForm;
