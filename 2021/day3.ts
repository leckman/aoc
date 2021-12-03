const lines = [
  '00100',
  '11110',
  '10110',
  '10111',
  '10101',
  '01111',
  '00111',
  '11100',
  '10000',
  '11001',
  '00010',
  '01010',
];

function gamma(lines: string[]) {
  let parsedLines = lines.map(l => parseInt(l, 2));
  const numbits = lines[0].length;
  let gamma = '';
  
  for (let i = numbits; i > 0; i--) {
    let bound = 2**(i-1);
    let counter = 0;
    parsedLines = parsedLines.map(l => {
        if (l >= bound) { counter += 1; return l - bound; }
        return l;
    });
    gamma += (counter > (lines.length / 2) ? '1' : '0');
  }
  return gamma;
}

const gammaStr = gamma(lines);
const epsilonStr = gammaStr.replace(/./g,x=>x^1);
const part1Ans = parseInt(gammaStr, 2) * parseInt(epsilonStr, 2);

// Part 2

function filterDown(lines: string[], invert: boolean = false) {
  let parsedLines = lines.map(l => ({ original: l, n: parseInt(l, 2) }));
  const numbits = lines[0].length;

  for (let i = numbits; i > 0; i--) {
    if (parsedLines.length === 1) break;
    const bound = 2**(i-1);
    const ones = [];
    const zeros = [];
    parsedLines.forEach(l => {
      if (l.n >= bound) {
        ones.push({ ...l, n: l.n-bound });
      } else {
        zeros.push(l);
      }
    });
    if (zeros.length > ones.length) {
      parsedLines = invert ? ones : zeros;
    } else {
      parsedLines = invert ? zeros : ones;
    }
  }

  return parseInt(parsedLines[0].original, 2)
}

const part2Ans = filterDown(lines) * filterDown(lines, true);
