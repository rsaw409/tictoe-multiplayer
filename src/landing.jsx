import styles from "./landing.module.css";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import CreateGameForm from "./component/createGameForm";
import JoinGameForm from "./component/joinGameForm";

function LandingPage({ socket, setRoomId, setCreatedGameId }) {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [gameIdFromUrl, setGameIdFromUrl] = useState("");

  useEffect(() => {
    const gameIdFromUrl = searchParams.get("gameId");
    if (gameIdFromUrl?.length) {
      setGameIdFromUrl(gameIdFromUrl);
    }
  }, []);

  const joinExistingGame = (name, gameId) => {
    if (!(name && gameId)) return;

    socket.emit("joinGame", {
      gameId: gameId,
      userName: name,
    });

    setRoomId(gameId);

    console.log("redirecting to", `/${gameId}`);
    navigate(`/${gameId}`);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {gameIdFromUrl.length ? (
          <div className={styles.item}>
            <JoinGameForm
              joinExistingGame={joinExistingGame}
              gameIdFromUrl={gameIdFromUrl}
            />
          </div>
        ) : (
          <div className={styles.item}>
            <CreateGameForm
              joinExistingGame={joinExistingGame}
              setCreatedGameId={setCreatedGameId}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
