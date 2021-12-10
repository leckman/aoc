const sampleInput = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`;

const input = await fetch('https://adventofcode.com/2021/day/10/input').then(i => i.text());

function processInput(inputStr) {
  const lines = inputStr.split('\n');
  lines.pop(); // remove trailing newline
  return lines.map(l => l.split(''));
}

const closeToOpen = {
  '>': '<',
  ']': '[',
  ')': '(',
  '}': '{'
}

const charToPoints = {
  '>': 25137,
  ']': 57,
  ')': 3,
  '}': 1197,
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4,
}

const getIncompleteScore = (active) => {
  active.reverse();
  let total = 0;
  active.forEach(char => {
    total *= 5;
    total += charToPoints[char];
  });
  return total;
}

const opens = ['<', '(', '[', '{'];
const processLine = (line, mode) => {
  const active = [];
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (opens.includes(char)) {
      active.push(char)
    } else {
      const match = active.pop();
      if (match !== closeToOpen[char]) {
        return mode === 'corruption' ? charToPoints[char] : 0;
      }
    }
  }
  return mode === 'incomplete' ? getIncompleteScore(active) : 0;
}

function play1(input) {
  const lines = processInput(input);
  const corruptionPoints = lines.map(l => processLine(l, 'corruption'));
  const syntaxErrorScore = corruptionPoints.reduce((acc, a) => acc + a);
  return syntaxErrorScore;
}

function play2(input) {
  const lines = processInput(input);
  const incompletePoints = lines.map(
      l => processLine(l, 'incomplete')
    ).filter(s => s !== 0);
  incompletePoints.sort((a, b) => a - b);
  const middleIndex = (incompletePoints.length - 1) / 2;
  return incompletePoints[middleIndex];
}


console.log('Sample:')
console.log('\tPart 1:', play1(sampleInput))
console.log('\tPart 2:', play2(sampleInput))

console.log('Real:')
console.log('\tPart 1:', play1(input))
console.log('\tPart 2:', play2(input))
