const sampleInput = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`;

class VentMap {
  ventPoints = {};
  diagonalsAllowed = false;

  constructor(diagonalsAllowed = false) {
    this.diagonalsAllowed = diagonalsAllowed;
  }

  addCoord(x, y) {
    const coordStr = `${x},${y}`;
    this.ventPoints[coordStr] = (this.ventPoints[coordStr] || 0) + 1;
  }

  addLine(line) {
    const [startCoord, endCoord] = line.split(' -> ');
    const [x1, y1] = startCoord.split(',').map(x => +x);
    const [x2, y2] = endCoord.split(',').map(x => +x);

    if (x1 === x2) {
      const startY = y1 < y2 ? y1 : y2;
      const endY = y1 < y2 ? y2 : y1;
      for (let y = startY; y <= endY; y++) {
        this.addCoord(x1, y);
      }
    } else if (y1 === y2) {
      const startX = x1 < x2 ? x1 : x2;
      const endX = x1 < x2 ? x2 : x1;
      for (let x = startX; x <= endX; x++) {
        this.addCoord(x, y1);
      }
    } else if (this.diagonalsAllowed) {
      const steps = Math.abs(x1 - x2);
      const addX = x1 < x2 ? 1 : -1;
      const addY = y1 < y2 ? 1 : -1;
      for (let s = 0; s <= steps; s++) {
        this.addCoord(x1 + (addX * s), y1 + (addY * s));
      }
    }
  }

  get numOverlapPoints() {
    return Object.values(this.ventPoints).filter(num => num > 1).length;
  }
}

function part1(input) {
  const lines = input.split('\n');
  lines.pop(); // remove trailing newline

  const ventMap = new VentMap();
  lines.forEach((line) => ventMap.addLine(line));
  return ventMap.numOverlapPoints
}

function part2(input) {
  const lines = input.split('\n');
  lines.pop(); // remove trailing newline

  const ventMap = new VentMap(true);
  lines.forEach((line) => ventMap.addLine(line));
  return ventMap.numOverlapPoints
}

console.log('Part 1, Sample Input:', part1(sampleInput));
console.log('Part 2, Sample Input:', part2(sampleInput));
