const sampleInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`;

const input = await fetch('https://adventofcode.com/2021/day/13/input').then(i => i.text());

function processInput(inputStr) {
  const [coords, foldStrs] = inputStr.split('\n\n');
  const folds = foldStrs.split('\n');
  folds.pop();
  return {
    dots: coords.split('\n'),
    folds: folds.map(f => {
      const [dir, unit] = f.replace('fold along ', '').split('=');
      return [dir, +unit];
    })
  }
}

function makeCoord(x,y) {
  return x + ',' + y;
}

function parseCoord(coordStr) {
  return coordStr.split(',').map(x => +x)
}

class Paper {
  dots = new Set();

  constructor(dotList) {
    this.dots = new Set([...dotList]);
  }

  fold([dir, unit]) {
    const dotList = [...this.dots];
    this.dots.clear();
    if (dir === 'x') {
      // Vertical fold
      dotList.forEach(dot => {
        const [x, y] = parseCoord(dot);
        if (x > unit) {
          const newX = unit - (x - unit);
          this.dots.add(makeCoord(newX, y))
        } else if (x === unit) {
          throw new Error(`Invalid fold instruction: ${dir}=${unit}, ${dot}`);
        } else {
          this.dots.add(dot);
        }
      });
    } else if (dir === 'y') {
      // Horizontal fold
      dotList.forEach(dot => {
        const [x, y] = parseCoord(dot);
        if (y > unit) {
          const newY = unit - (y - unit);
          this.dots.add(makeCoord(x, newY))
        } else if (y === unit) {
          throw new Error(`Invalid fold instruction: ${dir}=${unit}, ${dot}`);
        } else {
          this.dots.add(dot);
        }
      });
    } else {
      throw new Error('Invalid fold instruction')
    }
  }

  toString() {
    const matrix = [[]];
    this.dots.forEach(dot => {
      const [c, r] = parseCoord(dot);
      while (r >= matrix.length) {
        matrix.push([])
      }
      while (c >= matrix[r].length) {
        matrix[r].push('.')
      }
      matrix[r][c] = '#';
    });
    return matrix.map(row => '\t\t' + row.join('')).join('\n');
  }
}

function play(input, version = 1) {
  const { dots, folds } = processInput(input);
  const paper = new Paper(dots);
  paper.fold(folds.shift());
  if (version === 1) {
    return paper.dots.size;
  }
  folds.forEach((f) => paper.fold(f));
  console.log(paper.toString());
}

console.log("PART 1");
console.log('\tSample:', play(sampleInput));
console.log('\tReal:', play(input));

console.log("PART 2");
console.log('\tSample:');
play(sampleInput, 2);
console.log('\tRead:');
play(input, 2);
