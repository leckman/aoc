const sampleInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`;

const sample2 =`19999
19111
11191
`;

const input = await fetch('https://adventofcode.com/2021/day/15/input').then(i => i.text());

function processInput(inputStr) {
  const lines = inputStr.split('\n');
  lines.pop();
  return lines.map(processLine);
}

function processLine(line) {
  return line.split('').map(x => +x);
}

function getNeighbors(coord, chitonRiskMap) {
  const [r, c] = coord;
  const neighbors = [];

  if (r > 0) { // Up
    neighbors.push([r-1, c]);
  }

  if (r < chitonRiskMap.length - 1) { // Down
    neighbors.push([r + 1, c]);
  }

  if (c > 0) { // Left
    neighbors.push([r, c - 1])
  }

  if (c < chitonRiskMap[0].length - 1) { // Right
    neighbors.push([r, c + 1])
  }

  return neighbors;
}

function makeCoord(r, c) {
  return r + ',' + c;
}

function sortAndDedupeNodes(queue, dist) {
  const nodes = [...new Set(queue)];
  // Descending sort so we grab the closest to the source next
  nodes.sort((cA, cB) => dist[makeCoord(...cB)] - dist[makeCoord(...cA)])
  return nodes;
}

function dijkstra(chitonRiskMap) {
  const distFromSource = { 
    '0,0': 0
  };
  const visited = new Set();
  const target = makeCoord(chitonRiskMap.length - 1, chitonRiskMap[0].length - 1);

  let nodes = [[0,0]];
  while (nodes.length) {
    const node = nodes.pop();
    const currentCoord = makeCoord(...node);
    if (currentCoord === target) return distFromSource[target];
    if (visited.has(currentCoord)) continue;
    visited.add(currentCoord);
    const neighbors = getNeighbors(node, chitonRiskMap);
    neighbors.forEach(neighbor => {
      const [r, c] = neighbor;
      const nCoord = makeCoord(r, c);
      if (!visited.has(nCoord)) {
        const dist = distFromSource[currentCoord] + chitonRiskMap[r][c];
        if (!distFromSource[nCoord] || distFromSource[nCoord] > dist) {
          // Found new lowest dist
          distFromSource[nCoord] = dist;
        }
        nodes.push(neighbor);
      }
    });
    nodes = sortAndDedupeNodes(nodes, distFromSource)
  }

  console.log("Error: didn't find early return")
  return distFromSource[target]
}

// Part 1

function part1(input, verbose = false) {
  const chitonRiskMap = processInput(input);
  if (verbose) console.log(chitonRiskMap);
  return dijkstra(chitonRiskMap, verbose)
}

console.log("PART 1")
console.log("\tSample Input:", part1(sampleInput))
console.log("\tSample Input 2:", part1(sample2))
console.log("\tReal Input:", part1(input))

// Part 2

function incrementValue(val, i) {
  return val + i > 9 ? val + i - 9 : val + i;
}

function extendLineRight(line) {
  const outputLine = [];
  for (let i = 0; i < 5; i++) {
    line.forEach(char => outputLine.push(incrementValue(char, i)));
  }
  return outputLine;
}

function extendBlock(grid) {
  const outputGrid = [];
  const lines = grid.map(extendLineRight);
  for (let i = 0; i < 5; i++) {
    lines.forEach(line => {
      const incremented = line.map(char => incrementValue(char, i));
      outputGrid.push(incremented)
    });
  }
  return outputGrid;
}

function part2(input, verbose = false) {
  const miniChitonRiskMap = processInput(input);
  const chitonRiskMap = extendBlock(miniChitonRiskMap);
  if (verbose) {
    console.log(chitonRiskMap.map(line => line.join('')).join('\n'))
  }
  return dijkstra(chitonRiskMap, verbose)
}

console.log("PART 2");
console.log('\tSample Input:', part2(sampleInput, true));
console.log('\tReal Input:', part2(input));
