const DAY_NUM = 5;

let TESTING = true;

const sampleData1 = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

async function fetchData() {
  if (TESTING) {
    return sampleData1;
  }
  return fetch(`https://adventofcode.com/2023/day/${DAY_NUM}/input`).then(
    (res) => res.text()
  );
}

async function getProcessedData() {
  const rawData = await fetchData();
  return rawData.trim().split("\n\n");
}

function parseMapLine(line) {
  const [destStart, sourceStart, rangeLen] = line
    .trim()
    .split(" ")
    .map((d) => +d);
  return {
    destStart,
    sourceStart,
    rangeLen,
  };
}

function parseMap(rawParagraph) {
  const [header, ...configs] = rawParagraph.trim().split("\n");
  return configs.map(parseMapLine);
}

function getDestinationValue(sourceNumber, mapLines) {
  for (let line of mapLines) {
    const diff = sourceNumber - line.sourceStart;
    if (diff >= 0 && diff < line.rangeLen) {
      return line.destStart + diff;
    }
  }
  return sourceNumber;
}

// Assumes maps are ordered
function evaluateSeedLocation(seedNum, maps) {
  if (TESTING) {
    console.log(`Beginning to proccess ${seedNum}`);
  }
  let currentVal = seedNum;
  maps.forEach((map) => {
    const dest = getDestinationValue(currentVal, map);
    if (TESTING) {
      console.log(`\t${currentVal} -> ${dest}`);
    }
    currentVal = dest;
  });
  return currentVal;
}

async function part1() {
  const [rawSeeds, ...rawMaps] = await getProcessedData();
  const maps = rawMaps.map(parseMap);
  const seeds = rawSeeds
    .split(" ")
    .slice(1)
    .map((d) => +d);
  const location = seeds.reduce(
    (acc, seed) => Math.min(acc, evaluateSeedLocation(seed, maps)),
    Infinity
  );
  console.log(`Part 1: ${location}`);
}

const getTimestamp = () => new Date().toLocaleTimeString();

async function part2() {
  const [rawSeeds, ...rawMaps] = await getProcessedData();
  const maps = rawMaps.map(parseMap);
  const seedConfig = rawSeeds
    .split(" ")
    .slice(1)
    .map((d) => +d);
  let minLocation = +Infinity;
  // This loop takes roughly 6 min to run
  for (let i = 0; i < seedConfig.length - 1; i += 2) {
    console.log(
      `[${getTimestamp()}] Beginning seed range of ${seedConfig[
        i + 1
      ].toLocaleString()} starting at ${seedConfig[i].toLocaleString()}`
    );
    for (let j = 0; j < seedConfig[i + 1]; j++) {
      const seed = seedConfig[i] + j;
      const location = evaluateSeedLocation(seed, maps);
      minLocation = Math.min(minLocation, location);
    }
  }
  console.log(`[${getTimestamp()}] Part 2: ${minLocation}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  part1();
  part2();
}
