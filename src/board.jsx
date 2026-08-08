import { useEffect, useState, useRef } from "react";
import { Button, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import withReactContent from "sweetalert2-react-content";
import {
  isPlayer1WonFn,
  isPlayer2WonFn,
  isNoOneWonFn,
  getThisPlayerName,
  getOtherPlayerName,
} from "./utilFunctions";

import styles from "./board.module.css";
import ShareButton from "./component/shareButton";

function Board({ users, leaveGame, socket, gameId, createdGameId }) {

  const mySwalRef = useRef(null);

  useEffect(() => {
    const loadSwal = async () => {
      const Swal = (await import('sweetalert2')).default;
      mySwalRef.current = withReactContent(Swal);
    };

    loadSwal();

    return () => {
      mySwalRef.current?.close();
    };
  }, []);


  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const [winner, setWinner] = useState({
    isPlayer1Won: false,
    player1Array: [],
    isPlayer2Won: false,
    player2Array: [],
    isGameDraw: false,
  });

  const isPlayer1 = createdGameId === gameId;
  const [isThisPlayerMove, setisThisPlayerMove] = useState(isPlayer1);

  const thisPlayer = getThisPlayerName(socket.id, users);
  const otherPlayer = getOtherPlayerName(socket.id, users);
  const isMatchReady = Object.keys(users).length === 2;

  // useEffect for board evaluation
  useEffect(() => {
    const [_isPlayer1Won, array1] = isPlayer1WonFn(board);
    const [_isPlayer2Won, array2] = isPlayer2WonFn(board);
    const _isNoOneWon = isNoOneWonFn(board);

    if (_isPlayer1Won) {
      setWinner((prevObj) => ({
        ...prevObj,
        isPlayer1Won: true,
        player1Array: array1,
      }));
    } else if (_isPlayer2Won) {
      setWinner((prevObj) => ({
        ...prevObj,
        isPlayer2Won: true,
        player2Array: array2,
      }));
    } else if (_isNoOneWon) {
      setWinner((prevObj) => ({
        ...prevObj,
        isGameDraw: true,
      }));
    } else {
      setisThisPlayerMove((prev) => !prev);
    }
  }, [board]);

  // useEffect for game over modal condition
  useEffect(() => {
    const popupClass = { popup: "swal-dark-glass" };

    if (winner.isPlayer1Won) {
      setTimeout(() => {
        mySwalRef
          ?.current?.fire({
            title: isPlayer1
              ? `🏆 Victory, ${thisPlayer.userName}!`
              : `⚡ ${otherPlayer.userName} won the match`,
            html: isPlayer1
              ? "Flawless tactics! You dominate the arena."
              : "Defeat this round. Ready for a rematch?",
            icon: isPlayer1 ? "success" : "error",
            showDenyButton: true,
            denyButtonText: "Leave Arena",
            confirmButtonText: "Rematch!",
            allowOutsideClick: false,
            customClass: popupClass,
          })
          .then(handleModalResponse);
      }, 400);
    } else if (winner.isPlayer2Won) {
      setTimeout(() => {
        mySwalRef
          ?.current?.fire({
            title: !isPlayer1
              ? `🏆 Victory, ${thisPlayer.userName}!`
              : `⚡ ${otherPlayer.userName} won the match`,
            html: !isPlayer1
              ? "Flawless tactics! You dominate the arena."
              : "Defeat this round. Ready for a rematch?",
            icon: !isPlayer1 ? "success" : "error",
            showDenyButton: true,
            denyButtonText: "Leave Arena",
            confirmButtonText: "Rematch!",
            allowOutsideClick: false,
            customClass: popupClass,
          })
          .then(handleModalResponse);
      }, 400);
    } else if (winner.isGameDraw) {
      setTimeout(() => {
        mySwalRef
          ?.current?.fire({
            title: "🤝 Draw Match!",
            html: "Grid full! Both players fought to a total stalemate.",
            icon: "info",
            showDenyButton: true,
            denyButtonText: "Leave Arena",
            confirmButtonText: "Rematch!",
            allowOutsideClick: false,
            customClass: popupClass,
          })
          .then(handleModalResponse);
      }, 400);
    }
  }, [winner]);

  // useEffect for socket events
  useEffect(() => {
    socket.on("receivedFromServer", (data) => {
      const { index, symbol } = data;
      setBoard((prevBoard) => {
        const newBoard = JSON.parse(JSON.stringify(prevBoard));
        newBoard[index[0]][index[1]] = symbol;
        return newBoard;
      });
    });

    socket.on("userLeftGame", ({ userName }) => {
      mySwalRef?.current?.close();
      leftGame(`${userName} has left the match.`);
    });

    socket.on("userRestartedGame", ({ userName }) => {
      console.log(`${userName} has requested a rematch!`);
      mySwalRef?.current?.close();
      restartGame(false);
    });

    socket.on("userDisconnected", (userName) => {
      mySwalRef?.current?.close();
      leftGame(`${userName} disconnected from match.`);
    });
  }, [socket]);

  const handleModalResponse = (result) => {
    if (result.isConfirmed) {
      restartGame(true);
    } else if (result.isDenied) {
      leftGame("");
    }
  };

  const restartGame = (sendRestartMessage = false) => {
    if (sendRestartMessage) {
      socket.emit("RestartGame", {
        gameId: gameId,
        userName: thisPlayer.userName,
        userId: socket.id,
      });
    }

    setBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setWinner({
      isPlayer1Won: false,
      player1Array: [],
      isPlayer2Won: false,
      player2Array: [],
      isGameDraw: false,
    });
  };

  const leftGame = (reason) => {
    leaveGame(gameId, thisPlayer.userName, reason);
  };

  const handleClick = (rowIndex, itemIndex) => {
    if (board[rowIndex][itemIndex] !== "") return;
    if (winner.isPlayer1Won || winner.isPlayer2Won || winner.isGameDraw) return;
    if (!isMatchReady) return;
    if (!isThisPlayerMove) return;

    const symbolToUse = isPlayer1 ? "X" : "0";

    socket.emit("madeMove", {
      gameId: gameId,
      userName: thisPlayer.userName,
      userId: socket.id,
      index: [rowIndex, itemIndex],
      symbol: symbolToUse,
    });

    setBoard((prevBoard) => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      newBoard[rowIndex][itemIndex] = symbolToUse;
      return newBoard;
    });
  };

  const isWinningCell = (rowIndex, itemIndex) => {
    const targetArray = winner.isPlayer1Won
      ? winner.player1Array
      : winner.player2Array;

    return targetArray.some(
      (coord) => coord[0] === rowIndex && coord[1] === itemIndex
    );
  };

  const renderSymbol = (symbol) => {
    if (symbol === "X") {
      return (
        <svg className={styles.svgIcon} viewBox="0 0 100 100">
          <line x1="20" y1="20" x2="80" y2="80" className={styles.pathX} />
          <line x1="80" y1="20" x2="20" y2="80" className={styles.pathX} />
        </svg>
      );
    }
    if (symbol === "0") {
      return (
        <svg className={styles.svgIcon} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="32" fill="none" className={styles.pathO} />
        </svg>
      );
    }
    return null;
  };

  const player1Name = isPlayer1 ? thisPlayer.userName : otherPlayer.userName;
  const player2Name = !isPlayer1 ? thisPlayer.userName : otherPlayer.userName;

  const isPlayer1Turn = isPlayer1 ? isThisPlayerMove : !isThisPlayerMove;
  const isPlayer2Turn = !isPlayer1 ? isThisPlayerMove : !isThisPlayerMove;

  return (
    <div className={styles.wrapper}>
      {/* Top Header */}
      <div className={styles.topBar}>
        <div className={styles.brandLink} onClick={() => leftGame("")}>
          <ArrowBackIcon fontSize="small" />
          <span>TicTac Arena</span>
        </div>

        <div className={styles.roomBadge}>
          Room: <span className={styles.roomCodeText}>{gameId || "Lobby"}</span>
        </div>
      </div>

      {/* Matchup Banner / Waiting Banner */}
      {isMatchReady ? (
        <div className={styles.matchupContainer}>
          <div
            className={`${styles.playerCard} ${isPlayer1Turn ? styles.playerCardActiveX : ""
              }`}
          >
            <div className={styles.avatarBadgeX}>X</div>
            <div className={styles.playerName}>{player1Name}</div>
            <div
              className={`${styles.turnLabel} ${isPlayer1Turn ? styles.turnLabelActiveX : styles.turnLabelInactive
                }`}
            >
              {isPlayer1Turn ? "Active Turn" : "Waiting"}
            </div>
          </div>

          <div
            className={`${styles.playerCard} ${isPlayer2Turn ? styles.playerCardActiveO : ""
              }`}
          >
            <div className={styles.avatarBadgeO}>O</div>
            <div className={styles.playerName}>{player2Name}</div>
            <div
              className={`${styles.turnLabel} ${isPlayer2Turn ? styles.turnLabelActiveO : styles.turnLabelInactive
                }`}
            >
              {isPlayer2Turn ? "Active Turn" : "Waiting"}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.waitingCard}>
          <div className={styles.waitingPulse}></div>
          <div className={styles.waitingText}>Waiting for Opponent to Join...</div>
          <div className={styles.waitingSubtext}>
            Send this room link to your opponent to launch the match.
          </div>
          <ShareButton gameId={gameId} fromBaseUrl={false} />
        </div>
      )}

      {/* Grid Board */}
      <div className={styles.boardWrapper}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((item, itemIndex) => {
              const winning = isWinningCell(rowIndex, itemIndex);
              const disabled = !isMatchReady || !isThisPlayerMove || item !== "";

              return (
                <div
                  key={itemIndex}
                  className={`${styles.cell} ${winning ? styles.cellWinner : ""
                    } ${disabled ? styles.cellDisabled : ""}`}
                  onClick={() => handleClick(rowIndex, itemIndex)}
                >
                  {renderSymbol(item)}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className={styles.footerControls}>
        <Tooltip title="Reset Grid & Restart Match" arrow>
          <Button
            variant="outlined"
            size="medium"
            onClick={() => restartGame(true)}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              color: "#f8fafc",
              borderRadius: "12px",
              "&:hover": {
                borderColor: "#14b8a6",
                color: "#14b8a6",
                background: "rgba(20, 184, 166, 0.08)",
              },
            }}
          >
            Restart Match
          </Button>
        </Tooltip>

        <Tooltip title="Leave Game Room" arrow>
          <Button
            variant="outlined"
            size="medium"
            onClick={() => leftGame("")}
            startIcon={<ExitToAppIcon />}
            color="error"
            sx={{
              borderColor: "rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              borderRadius: "12px",
              "&:hover": {
                borderColor: "#ef4444",
                background: "rgba(239, 68, 68, 0.15)",
              },
            }}
          >
            Leave Match
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Board;

