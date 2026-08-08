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
      <header className={styles.heroHeader}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          Real-Time 1v1 Multiplayer
        </div>
        <h1 className={styles.title}>TicTac Arena</h1>
        <p className={styles.subtitle}>
          Create a room, share the unique link with your rival, and claim victory in real-time.
        </p>
      </header>

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

      <footer className={styles.footerNotes}>
        <div className={styles.featureTag}>⚡ Low Latency Sockets</div>
        <span>•</span>
        <div className={styles.featureTag}>🔒 Instant Link Sharing</div>
        <span>•</span>
        <div className={styles.featureTag}>🎮 Seamless 1v1 Matchmaking</div>
      </footer>
    </div>
  );
}

export default LandingPage;

