const DAY_NUM = 6;

let TESTING = true;

const sampleData1 = `Time:      7  15   30
Distance:  9  40  200`;

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
  return rawData.trim().split("\n");
}

function getRaces(lines) {
  const [times, dist] = lines.map((l) =>
    l
      .split(":")[1]
      .trim()
      .split(/\s+/)
      .map((d) => +d)
  );
  const races = [];
  for (let i = 0; i < times.length; i++) {
    races.push({
      time: times[i],
      distanceRecord: dist[i],
    });
  }
  return races;
}

function getNumWinningOptions({ time, distanceRecord }) {
  let numWinningOptions = 0;
  // Can never win holding it 0 or time ms
  for (let i = 1; i < time; i++) {
    const speed = i;
    const remainingTime = time - i;
    const distance = speed * remainingTime;
    if (distance > distanceRecord) {
      numWinningOptions++;
    }
  }
  return numWinningOptions;
}

async function part1() {
  const data = await getProcessedData();
  const races = getRaces(data);

  let answer = 1;
  races.forEach((race) => {
    answer *= getNumWinningOptions(race);
  });

  console.log(`Part 1: ${answer}`);
}

async function part2() {
  const data = await getProcessedData();
  const [time, distanceRecord] = data.map(
    (d) => +d.split(":")[1].replace(/\s/g, "")
  );
  const answer = getNumWinningOptions({ time, distanceRecord });
  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  part1();
  part2();
}
