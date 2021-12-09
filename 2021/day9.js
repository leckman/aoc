const sampleInput = `2199943210
3987894921
9856789892
8767896789
9899965678
`;

const input = await fetch('https://adventofcode.com/2021/day/9/input').then(i => i.text());

function processInput(inputStr) {
  const rowStrs = inputStr.split('\n');
  rowStrs.pop(); // remove trailing newline
  return rowStrs.map(row => row.split('').map(i => + i))
}

function getCoord(r,c) {
  return r + ',' + c;
}

function findLowPoints(heightmap) {
  const skipCoords = new Set();
  const lowPointsCoords = [];
  const lowPoints = [];
  for (let r = 0; r < heightmap.length; r++) {
    for (let c = 0; c < heightmap[0].length; c++) {
      if (skipCoords.has(getCoord(r, c))) continue;
      const height = heightmap[r][c];

      if (r > 0) {
        const up = heightmap[r-1][c];
        if (height < up) {
          // Up can't be a low point since height is lower
          skipCoords.add(getCoord(r-1, c))
        } else {
          // Height is not a potential low point
          continue;
        }
      }

      if (r < heightmap.length - 1) {
        const down = heightmap[r+1][c];
        if (height < down) {
          skipCoords.add(getCoord(r+1, c))
        } else {
          continue;
        }
      }

      if (c > 0) {
        const left = heightmap[r][c-1];
        if (height < left) {
          skipCoords.add(getCoord(r, c-1))
        } else {
          continue;
        }
      }

      if (c < heightmap[0].length - 1) {
        const right = heightmap[r][c+1];
        if (height < right) {
          skipCoords.add(getCoord(r, c+1))
        } else {
          continue;
        }
      }

      lowPoints.push(height);
      lowPointsCoords.push([r,c])
    }
  }
  return { lowPoints, lowPointsCoords };
}

function getNon9NeighbhoorCoords(heightmap, coord) {
  const [r, c] = coord;
  const neighbors = [];
  if (r > 0) {
    const up = heightmap[r-1][c];
    if (up !== 9) {
      neighbors.push([r-1, c])
    }
  }

  if (r < heightmap.length - 1) {
    const down = heightmap[r+1][c];
    if (down !== 9) {
      neighbors.push([r+1, c])
    }
  }

  if (c > 0) {
    const left = heightmap[r][c-1];
    if (left !== 9) {
      neighbors.push([r, c-1])
    }
  }

  if (c < heightmap[0].length - 1) {
    const right = heightmap[r][c+1];
    if (right !== 9) {
      neighbors.push([r, c+1])
    }
  }
  return neighbors;
}

function findBasin(heightmap, lowPointCoord) {
  const toVisit = [lowPointCoord];
  const basinCoords = new Set([getCoord(...lowPointCoord)]);
  // For each coord in the queue:
  // - pop coord
  // - look at up, down, left, right
  // - if new eligible neighbors, add to basin coords and queue
  // - return num basinCoords when queue is empty
  while (toVisit.length) {
    const coord = toVisit.pop();
    const neighbors = getNon9NeighbhoorCoords(heightmap, coord);
    neighbors.forEach(c => {
      const cStr = getCoord(...c);
      if (!basinCoords.has(cStr)) {
        basinCoords.add(cStr);
        toVisit.push(c);
      }
    });
  }
  return basinCoords.size;
}

function play1(input) {
  const heightmap = processInput(input);
  const { lowPoints } = findLowPoints(heightmap);
  return lowPoints.reduce((acc, a) => acc + a +  1, 0);
}

function play2(input) {
  const heightmap = processInput(input);
  const { lowPointsCoords } = findLowPoints(heightmap);
  const biggestBasins = [0, 0, 0];
  lowPointsCoords.forEach(c => {
    const basinSize = findBasin(heightmap, c);
    const lower = biggestBasins.findIndex(b => b < basinSize);
    if (lower > -1) {
      biggestBasins[lower] = basinSize;
      biggestBasins.sort((a,b) => a - b);
    }
  })
  return biggestBasins.reduce((acc, a) => acc * a);
}


console.log('Sample:')
console.log('\tPart 1:', play1(sampleInput))
console.log('\tPart 2:', play2(sampleInput))

console.log('Real:')
console.log('\tPart 1:', play1(input))
console.log('\tPart 2:', play2(input))
