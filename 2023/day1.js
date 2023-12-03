const sampleData = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const sampleData2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

const numMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

async function fetchDataAsLines(dayNumber, testData) {
  const resp = await fetch(
    `https://adventofcode.com/2023/day/${dayNumber}/input`
  );
  const data = testData || (await resp.text());
  return data.trim().split("\n");
}

async function part1(testRun = true) {
  const lines = await fetchDataAsLines(1, testRun && sampleData);
  let calibrationSum = 0;
  lines.forEach((line) => {
    const matches = [...line.matchAll(/\d/g)];
    const first = +matches[0][0];
    const last = +matches.slice(-1)[0];
    const calibrationValue = first * 10 + last;
    if (testing) {
      console.log({ line, calibrationValue });
    }
    calibrationSum += calibrationValue;
  });
  console.log(`Part 1: Calibration sum is ${calibrationSum}`);
}

function findCalibrationValue(line, testing) {
  const foundMatches = [];
  for (let match of line.matchAll(/\d/g)) {
    foundMatches.push({ index: match.index, value: +match[0] });
  }
  Object.entries(numMap).forEach(([k, v]) => {
    const indices = [line.indexOf(k), line.lastIndexOf(k)];
    indices.forEach((i) => {
      if (i > -1) {
        foundMatches.push({ index: i, value: v });
      }
    });
  });
  foundMatches.sort((a, b) => a.index - b.index);
  const first = foundMatches[0].value;
  const last = foundMatches.slice(-1)[0].value;
  if (testing) {
    console.log({ line, first, last, foundMatches });
  }
  return first * 10 + last;
}

async function part2(testRun = true) {
  const lines = await fetchDataAsLines(1, testRun && sampleData2);
  let calibrationSum2 = 0;
  lines.forEach(
    (line) => (calibrationSum2 += findCalibrationValue(line, testRun))
  );
  console.log(`Part 2: Calibration sum is ${calibrationSum2}`);
}
