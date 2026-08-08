import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  isPlayer1WonFn,
  isPlayer2WonFn,
  isNoOneWonFn,
  getCornerClassName,
  getFontColor,
  getThisPlayerName,
  getOtherPlayerName,
} from "./utilFunctions";
import styles from "./board.module.css";
import ShareButton from "./component/shareButton";

function Board({ users, leaveGame, socket, gameId, createdGameId }) {
  const mySwal = withReactContent(Swal);

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
  });

  const isPlayer1 = createdGameId === gameId;

  const [isThisPlayerMove, setisThisPlayerMove] = useState(isPlayer1);

  const thisPlayer = getThisPlayerName(socket.id, users);
  const otherPlayer = getOtherPlayerName(socket.id, users);

  // useEffect for board.
  useEffect(() => {
    const [_isPlayer1Won, array1] = isPlayer1WonFn(board);
    const [_isPlayer2Won, array2] = isPlayer2WonFn(board);
    const _isNoOneWon = isNoOneWonFn(board);

    if (_isPlayer1Won) {
      setWinner((prevObj) => {
        return { ...prevObj, isPlayer1Won: true, player1Array: array1 };
      });
    } else if (_isPlayer2Won) {
      setWinner((prevObj) => {
        return { ...prevObj, isPlayer2Won: true, player2Array: array2 };
      });
    } else if (_isNoOneWon) {
      setWinner((prevObj) => {
        return { ...prevObj, isGameDraw: true };
      });
    } else {
      setisThisPlayerMove((prev) => !prev);
    }
  }, [board]);

  // useEffect for game over condition`
  useEffect(() => {
    if (winner.isPlayer1Won) {
      setTimeout(() => {
        mySwal
          .fire({
            title: isPlayer1
              ? `Good job ${thisPlayer.userName}!`
              : `${otherPlayer.userName} has won this game`,
            html: isPlayer1 ? "You have won the Game!" : "You have lose!",
            icon: isPlayer1 ? "success" : "error",

            showDenyButton: true,
            denyButtonText: "Leave This Game!",

            confirmButtonText: "Restart Game!",

            allowOutsideClick: false,
          })
          .then(handleModalResponse);
      }, 500);
    } else if (winner.isPlayer2Won) {
      setTimeout(() => {
        mySwal
          .fire({
            title: !isPlayer1
              ? `Good job ${thisPlayer.userName}!`
              : `${otherPlayer.userName} has won this game`,
            html: !isPlayer1 ? "You have won the Game!" : "You have lose!",
            icon: !isPlayer1 ? "success" : "error",

            showDenyButton: true,
            denyButtonText: "Leave This Game!",

            confirmButtonText: "Restart Game!",

            allowOutsideClick: false,
          })
          .then(handleModalResponse);
      }, 500);
    } else if (winner.isGameDraw) {
      setTimeout(() => {
        mySwal
          .fire({
            title: "Game Draw!",
            html: "No one won the Game!",
            icon: "error",

            showDenyButton: true,
            denyButtonText: "Leave This Game!",

            confirmButtonText: "Restart Game!",

            allowOutsideClick: false,
          })
          .then(handleModalResponse);
      }, 500);
    }
  }, [winner]);

  // useEffect on socket subscription
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
      mySwal?.close();
      leftGame(`${userName} has left game.`);
    });

    socket.on("userRestartedGame", ({ userName }) => {
      console.log(`${userName} has requested to play again!`);
      mySwal?.close();
      restartGame(false);
    });

    socket.on("userDisconnected", (userName) => {
      mySwal?.close();
      leftGame(`${userName} is disconnected from game.`);
    });
  }, [socket]);

  const handleModalResponse = (result) => {
    if (result.isConfirmed) {
      restartGame(true);
    } else if (result.isDenied) {
      leftGame("");
    } else if (result.isDismissed) {
      return;
    }
  };

  const restartGame = (sendRestartMessage = false) => {
    console.log("restarting game");

    if (sendRestartMessage) {
      socket.emit("RestartGame", {
        gameId: gameId,
        userName: thisPlayer.userName,
        userId: socket.id,
      });
    }

    setBoard((prevBoard) => {
      return [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
    });
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

    if (Object.keys(users).length !== 2) {
      console.log("waiting for players to join");
      return;
    }

    if (!isThisPlayerMove) {
      console.log("Not Your Move");
      return;
    }

    socket.emit("madeMove", {
      gameId: gameId,
      userName: thisPlayer.userName,
      userId: socket.id,
      index: [rowIndex, itemIndex],
      symbol: isPlayer1 ? "X" : "0",
    });

    setBoard((prevBoard) => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard));
      newBoard[rowIndex][itemIndex] = isPlayer1 ? "X" : "0";
      return newBoard;
    });
  };

  const getBackGroundColor = (tmp) => {
    const targetArray = winner.isPlayer1Won
      ? winner.player1Array
      : winner.player2Array;

    if (
      targetArray.some((each) => JSON.stringify(each) === JSON.stringify(tmp))
    )
      return styles.winnerBackgroundColor;
    else return "";
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        {Object.keys(users).length > 0 ? (
          <>
            <div
              className={`${styles.headerSection} ${
                isThisPlayerMove ? styles.active : styles.unactive
              }`}
            >
              {thisPlayer.userName}
            </div>
            <div
              className={`${styles.headerSection} ${
                isThisPlayerMove ? styles.unactive : styles.active
              }`}
            >
              {otherPlayer.userName}
            </div>
          </>
        ) : (
          <>
            <div className={styles.headerSection2}>
              <div> Waiting for players to join.. </div>
              <ShareButton gameId={gameId} fromBaseUrl={false} />
            </div>
          </>
        )}
      </div>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className={`${styles.item} ${getCornerClassName(
                  rowIndex,
                  itemIndex,
                )} ${getFontColor(item)} ${getBackGroundColor([
                  rowIndex,
                  itemIndex,
                ])}`}
                onClick={(e) => handleClick(rowIndex, itemIndex)}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
