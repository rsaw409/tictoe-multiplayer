import { TextField, Button, InputAdornment } from "@mui/material";
import short from "short-uuid";
import ShareButton from "./shareButton";
import { useState, useEffect } from "react";

const CreateGameForm = ({ joinExistingGame, setCreatedGameId }) => {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState(null);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setCreatedGameId(gameId);
  }, [gameId]);

  const handleChange = (name) => {
    if (name.length > 0 && errorText.length > 0) setErrorText("");
    setName(name);
  };

  const handleClick = () => {
    if (name.trim().length <= 0) {
      setErrorText("Please Give Your Name.");
    } else {
      setGameId(short().generate());
    }
  };

  return (
    <>
      <TextField
        error={errorText.length === 0 ? false : true}
        helperText={errorText}
        InputProps={{
          readOnly: gameId ? true : false,
          disableUnderline: name?.trim()?.length ? true : false,
        }}
        required
        fullWidth
        type="text"
        onChange={(e) => handleChange(e.target.value)}
        label="Name"
        variant="standard"
        margin="normal"
      />

      {gameId && (
        <TextField
          InputProps={{
            readOnly: true,
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <ShareButton gameId={gameId} fromBaseUrl={true} />
              </InputAdornment>
            ),
          }}
          fullWidth
          label="Game Id"
          helperText="Share This GameId With Other Player."
          defaultValue={gameId}
          variant="standard"
          margin="normal"
        />
      )}

      <br />

      {!gameId ? (
        <Button variant="contained" onClick={handleClick}>
          Create New Game
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={() => joinExistingGame(name, gameId)}
        >
          Join Game
        </Button>
      )}
    </>
  );
};

export default CreateGameForm;
