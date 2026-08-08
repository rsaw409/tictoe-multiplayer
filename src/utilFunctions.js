export const getCornerClassName = (rowIndex, itemIndex) => {
  return "";
};

export const getFontColor = (item) => {
  return "";
};

export function getPossibleWin() {
  const possibleWin = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  return possibleWin;
}

export function isSameValue(array1, array2) {
  return JSON.stringify(array1) === JSON.stringify(array2);
}

export function isPlayer1WonFn(board) {
  const res = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "X") res.push([i, j]);
    }
  }

  if (res.length <= 2) return [false, []];

  const possibleWins = getPossibleWin();

  for (let eachPossibleWin of possibleWins) {
    if (
      eachPossibleWin.every((item) =>
        res.some((item2) => isSameValue(item, item2))
      )
    )
      return [true, eachPossibleWin];
  }

  return [false, []];
}

export function isPlayer2WonFn(board) {
  const res = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "0") res.push([i, j]);
    }
  }

  if (res.length <= 2) return [false, []];

  const possibleWins = getPossibleWin();

  for (let eachPossibleWin of possibleWins) {
    if (
      eachPossibleWin.every((item) =>
        res.some((item2) => isSameValue(item, item2))
      )
    )
      return [true, eachPossibleWin];
  }

  return [false, []];
}

export function isNoOneWonFn(board) {
  const res = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "0" || board[i][j] === "X") res.push([i, j]);
    }
  }

  return res.length === 9;
}

export const getThisPlayerName = (userId, users) => {
  if (users && typeof users === "object") {
    for (let uid of Object.keys(users)) {
      if (uid === userId) return { userId: userId, userName: users[uid] };
    }
  }
  return { userId: userId || "", userName: "You" };
};

export const getOtherPlayerName = (userId, users) => {
  if (users && typeof users === "object") {
    for (let uid of Object.keys(users)) {
      if (uid !== userId) return { userId: uid, userName: users[uid] };
    }
  }
  return { userId: "", userName: "Waiting..." };
};
