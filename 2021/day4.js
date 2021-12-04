const input = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`;

const BOARD_SIZE = 5;

class BingoBoard {

  occupied = [];
  indexMap = {};

  constructor(inputStr) {
    const rows = inputStr.split('\n', BOARD_SIZE).map(row => row.trim().split(/\s+/).map(i => parseInt(i, 10)));

    for (let r = 0; r < BOARD_SIZE; r++) {
      this.occupied.push([]);
      for (let c = 0; c < BOARD_SIZE; c++) {
        this.indexMap[rows[r][c]] = { r, c };
      }
    }
  }

  callNumberAndCheckWinner(callNum) {
    if (!this.indexMap[callNum]) return false;
  
    const { r, c } = this.indexMap[callNum];
    this.occupied[r][c] = true;

    let rowWin = true;
    for (let c2 = 0; c2 < BOARD_SIZE; c2++) {
      if (!this.occupied[r][c2]) {
        rowWin = false;
        break;
      }
    }

    let columnWin = true;
    for (let r2 = 0; r2 < BOARD_SIZE; r2++) {
      if (!this.occupied[r2][c]) {
        columnWin = false;
        break;
      }
    }

    return rowWin || columnWin;
  }

  scoreBoard() {
    const uncalledNumbers = Object.entries(this.indexMap).filter(([kStr, v]) => !this.occupied[v.r][v.c]);
    return uncalledNumbers.reduce((acc, [kStr]) => acc + (+kStr), 0);
  }
}

function play1(input) {
  const [callNumberStr, ...puzzles] = input.split('\n\n');
  const callNumbers = callNumberStr.split(',').map(i => parseInt(i, 10));
  const boards = puzzles.map(p => new BingoBoard(p));

  for (let i = 0; i < callNumbers.length; i++) {
    const callNum = callNumbers[i];
    for (let b = 0; b < boards.length; b++) {
      const winner = boards[b].callNumberAndCheckWinner(callNum);
      if (winner) {
        return callNum * boards[b].scoreBoard();
      }
    }
  }
}

function play2(input) {
  const [callNumberStr, ...puzzles] = input.split('\n\n');
  const callNumbers = callNumberStr.split(',').map(i => parseInt(i, 10));
  let boards = puzzles.map(p => new BingoBoard(p));

  let validBoards = boards.length;
  for (let i = 0; i < callNumbers.length; i++) {
    const callNum = callNumbers[i];
    for (let b = 0; b < boards.length; b++) {
      const winner = boards[b].callNumberAndCheckWinner(callNum);
      if (winner && validBoards === 1) {
        return callNum * boards[b].scoreBoard();
      } else if (winner) {
        validBoards--;
        boards[b] = null;
      }
    }
    boards = boards.filter(b => b !== null);
  }
}

console.log("Part 1 Answer:", play1(input));
console.log("Part 2 Answer:", play2(input));
