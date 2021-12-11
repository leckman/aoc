const sampleInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`;

const input = await fetch('https://adventofcode.com/2021/day/11/input').then(i => i.text());

function processInput(inputStr) {
  const lines = inputStr.split('\n');
  lines.pop(); // remove trailing newline
  return lines.map(l => l.split('').map(x => +x));
}

const FLASH = 'f';

function neighborCoords(coord, bound = 9) {
  const [r, c] = coord;
  const left = c > 0 ? [r, c-1] : null;
  const right = c < bound ? [r, c+1] : null;
  const top = r > 0 ? [r-1, c] : null;
  const bottom = r < bound ? [r+1, c] : null;
  const topLeft = top && left && [r-1, c-1];
  const topRight = top && right && [r-1, c+1];
  const bottomLeft = bottom && left && [r+1, c-1];
  const bottomRight = bottom && right && [r+1, c+1];
  return [
    left,
    right,
    top,
    bottom,
    topRight,
    topLeft,
    bottomLeft,
    bottomRight
  ].filter(neighbor => neighbor !== null);
}

function step(octopusGrid) {
  // First, add 1 to everything. Make note of the indices of new 9s.
  const flashes = [];
  const toResolve = [];
  for (let r = 0; r < octopusGrid.length; r++) {
    for (let c = 0; c < octopusGrid[0].length; c++) {
      octopusGrid[r][c] += 1;
      if (octopusGrid[r][c] > 9) {
        octopusGrid[r][c] = FLASH;
        flashes.push([r,c]);
        toResolve.push([r,c]);
      }
    }
  }

  // Then loop over the to-resolves and update their neighbors
  while (toResolve.length) {
    const neighbors = neighborCoords(toResolve.pop());
    neighbors.forEach(([r,c]) => {
      const energy = octopusGrid[r][c];
      if (energy === FLASH) {
        // ignore, we've already flashed
      } else if (energy >= 9) {
        // If we were at an 9, the current flash would push us over
        octopusGrid[r][c] = FLASH;
        flashes.push([r,c]);
        toResolve.push([r,c]);
      } else {
        octopusGrid[r][c] += 1;
      }
    })
  }

  // Finally, clean up the flashes
  flashes.forEach(([r,c]) => {
    octopusGrid[r][c] = 0;
  });
  return flashes.length;
}

function printOctopusGrid(grid) {
  const str = grid.map(row => '\t' + row.join('')).join('\n');
  console.log(str);
}

function play1(input, verbose = false) {
  const octopusGrid = processInput(input);
  let total = 0;
  for (let i = 0; i < 100; i++) {
    const numFlashes = step(octopusGrid);
    total += numFlashes;
    if (verbose) {
      console.log(`STEP ${i}: (${numFlashes} flashes / ${total} total) -`)
      printOctopusGrid(octopusGrid);
    }
  }
  return total;
}

function play2(input) {
  let i = 0;
  const octopusGrid = processInput(input);
  while (true) {
    i++;
    const numFlashes = step(octopusGrid);
    if (numFlashes === 100) { // All flashed
      break;
    }
  }
  return i;
}


console.log('Sample:')
console.log('\tPart 1:', play1(sampleInput))
console.log('\tPart 2:', play2(sampleInput))

console.log('Real:')
console.log('\tPart 1:', play1(input))
console.log('\tPart 2:', play2(input))
