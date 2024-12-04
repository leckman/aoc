const DAY_NUM = 2;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;
const sampleData2 = sampleData1;

async function fetchData() {
  if (TESTING) {
    return PART_NUMBER === 1 ? sampleData1 : sampleData2;
  }
  return fetch(`https://adventofcode.com/2024/day/${DAY_NUM}/input`).then(
    (res) => res.text()
  );
}

async function getProcessedData() {
  const rawData = await fetchData();
  return rawData
    .trim()
    .split("\n")
    .map((level) => level.split(" ").map((i) => +i));
}

function isLevelSafe(level) {
  const decreasing = level[0] < level[1];
  for (let i = 0; i < level.length - 1; i++) {
    const current = level[i];
    const next = level[i + 1];
    if (current < next !== decreasing) {
      return false;
    }
    const diff = Math.abs(current - next);
    if (diff < 1) return false;
    if (diff > 3) return false;
  }
  return true;
}

async function part1() {
  PART_NUMBER = 1;
  const levels = await getProcessedData();
  let answer = levels.filter(isLevelSafe).length;
  console.log(`Part 1: ${answer}`);
}

function isLevelSafe2(level, alreadyFoundUnsafe = false) {
  const retryOrStop = (i) => {
    if (alreadyFoundUnsafe) {
      return false;
    } else {
      if (i > 0) {
        const withoutPrevious = [...level];
        withoutPrevious.splice(i - 1, 1);
        if (isLevelSafe2(withoutPrevious, true)) return true;
      }

      const withoutCurrent = [...level];
      const withoutNext = [...level];
      withoutCurrent.splice(i, 1);
      withoutNext.splice(i + 1, 1);

      return (
        isLevelSafe2(withoutCurrent, true) || isLevelSafe2(withoutNext, true)
      );
    }
  };
  const decreasing = level[0] < level[1];
  for (let i = 0; i < level.length - 1; i++) {
    const current = level[i];
    const next = level[i + 1];
    if (current < next !== decreasing) {
      return retryOrStop(i);
    }
    const diff = Math.abs(current - next);
    if (diff < 1 || diff > 3) {
      return retryOrStop(i);
    }
  }
  return true;
}

async function part2() {
  PART_NUMBER = 2;
  const levels = await getProcessedData();
  let answer = levels.filter((level) => isLevelSafe2(level)).length;
  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  await part1();
  await part2();
}
