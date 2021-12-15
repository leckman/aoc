const sampleInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`;

const input = await fetch('https://adventofcode.com/2021/day/14/input').then(i => i.text());

function processInput(inputStr) {
  const [template, instructionStr] = inputStr.split('\n\n');
  const instructions = instructionStr.split('\n');
  instructions.pop();
  const insertions = instructions.map(i => i.split(' -> ')).reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {})
  return { template, insertions }
}

// Part 1

function originalStep(template, insertions) {
  const newTemplate = [];

  for (let i = 0; i < template.length - 1; i++) {
    const startChar = template[i];
    const nextPair = template.slice(i, i+2);
    const insertionChar = insertions[nextPair] || '';
    newTemplate.push(startChar, insertionChar);
  }

  // Add last char back
  newTemplate.push(template[template.length - 1])

  return newTemplate.join('');
}

function countCharacters1(template) {
  return template.split('').reduce((acc, char) => {
    if (!acc[char]) acc[char] = 0;
    acc[char] += 1;
    return acc;
  }, {});
}

function minMaxDifference(characterCounts) {
  const counts = Object.entries(characterCounts);
  let min = counts[0];
  let max = counts[0];
  counts.forEach(([char, count]) => {
    if (count < min[1]) min = [char, count];
    if (count > max[1]) max = [char, count];
  });
  console.log({ min, max })
  return max[1] - min[1];
}

function part1(input) {
  const { template, insertions } = processInput(input);
  let currentTemplate = template;
  for (let i = 0; i < 10; i++) {
    currentTemplate = originalStep(currentTemplate, insertions);
  }
  return minMaxDifference(countCharacters1(currentTemplate))
}

// Part 2

function pairBasedStep(pairCounts, insertions) {
  const newPairCounts = {}
  Object.entries(pairCounts).forEach(([pair, count]) => {
    const newPairs = [];
    if (insertions[pair]) {
      const insertionChar = insertions[pair];
      const [start, end] = pair;
      newPairs.push(start + insertionChar, insertionChar + end)
    } else {
      newPairs.push(pair);
    }
    newPairs.forEach(n => {
      if (!newPairCounts[n]) newPairCounts[n] = 0;
      newPairCounts[n] += count;
    });
  });
  return newPairCounts;
}

function countCharacters2(pairCounts, initialStart, initialEnd) {
  const charCounts = {};
  // Because we have pairs, every character except initialStart and initialEnd is counted twice
  Object.entries(pairCounts).forEach(([pair, count]) => {
    const [start, end] = pair;
    if (!charCounts[start]) charCounts[start] = 0;
    if (!charCounts[end]) charCounts[end] = 0;
    charCounts[start] += count;
    charCounts[end] += count;
  });

  charCounts[initialStart] += 1;
  charCounts[initialEnd] += 1;

  Object.entries(charCounts).forEach(([char, count]) => {
    charCounts[char] = count / 2;
  });

  return charCounts;
}

function generatePairCountsFromString(template) {
  const pairCounts = {};
  for (let i = 0; i < template.length - 1; i++) {
    const pair = template.slice(i, i+2);
    if (pairCounts[pair]) {
      pairCounts[pair] += 1;
    } else {
      pairCounts[pair] = 1;
    }
  }
  return pairCounts;
}

function play(input, iterations) {
  const { template, insertions } = processInput(input);
  let pairCounts = generatePairCountsFromString(template)
  for (let i = 0; i < iterations; i++) {
    pairCounts = pairBasedStep(pairCounts, insertions);
  }
  const firstChar = template[0];
  const lastChar = template[template.length - 1]
  return minMaxDifference(countCharacters2(pairCounts, firstChar, lastChar))
}

console.log("PART 1");
console.log('\tSample:', play(sampleInput, 10));
console.log('\tReal:', play(input, 10));

console.log("PART 2");
console.log('\tSample:', play(sampleInput, 40));
console.log('\tReal:', play(input, 40));
