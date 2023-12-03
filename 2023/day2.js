const DAY_NUM = 2;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;
const sampleData2 = sampleData1;

async function fetchData() {
  if (TESTING) {
    return PART_NUMBER === 1 ? sampleData1 : sampleData2;
  }
  return fetch(`https://adventofcode.com/2023/day/${DAY_NUM}/input`).then(
    (res) => res.text()
  );
}

async function getProcessedData() {
  const rawData = await fetchData();
  return rawData.trim().split("\n");
}

const regexes = {
  red: /(?<color>\d+) red/,
  blue: /(?<color>\d+) blue/,
  green: /(?<color>\d+) green/,
};

function parseGameLine(line) {
  const maxSeen = {
    red: 0,
    green: 0,
    blue: 0,
  };
  const trials = line.split(";");
  trials.forEach((trial) => {
    Object.entries(regexes).forEach(([k, v]) => {
      const match = +(trial.match(v)?.groups.color || 0);
      if (match > maxSeen[k]) {
        maxSeen[k] = match;
      }
    });
  });
  if (TESTING) {
    console.log(line, maxSeen);
  }
  maxSeen.power = maxSeen.red * maxSeen.blue * maxSeen.green;
  return maxSeen;
}

function isPossibleGame({ red, green, blue }) {
  return red <= 12 && green <= 13 && blue <= 14;
}

async function part1() {
  PART_NUMBER = 1;
  let possibleIndexSum = 0;
  const data = await getProcessedData();
  data.forEach((line, index) => {
    if (isPossibleGame(parseGameLine(line))) {
      const gameNumber = index + 1;
      possibleIndexSum += gameNumber;
    }
  });
  console.log(`Part 1: ${possibleIndexSum}`);
}

async function part2() {
  PART_NUMBER = 2;
  const data = await getProcessedData();
  let powerSum = 0;
  data.forEach((line) => {
    const { power } = parseGameLine(line);
    powerSum += power;
  });
  console.log(`Part 2: ${powerSum}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  part1();
  part2();
}
