const DAY_NUM = 3;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 =
  "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
const sampleData2 =
  "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";

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
  return rawData.trim();
}

const MUL_REGEX = /mul\((?<op1>\d+),(?<op2>\d+)\)/gm;

async function part1() {
  PART_NUMBER = 1;
  const data = await getProcessedData();

  let answer = 0;

  data.matchAll(MUL_REGEX).forEach((match) => {
    answer += match.groups.op1 * match.groups.op2;
  });

  console.log(`Part 1: ${answer}`);
}

const DO_REGEX = /do\(\)/gm;
const DONT_REGEX = /don't\(\)/gm;

async function part2() {
  PART_NUMBER = 2;
  const data = await getProcessedData();

  const instructions = [];

  data.matchAll(DO_REGEX).forEach((match) => {
    instructions.push({
      index: match.index,
      type: "CONTROL",
      value: true,
    });
  });

  data.matchAll(DONT_REGEX).forEach((match) => {
    instructions.push({
      index: match.index,
      type: "CONTROL",
      value: false,
    });
  });

  data.matchAll(MUL_REGEX).forEach((match) => {
    instructions.push({
      index: match.index,
      type: "SUM",
      value: match.groups.op1 * match.groups.op2,
    });
  });

  instructions.sort((a, b) => a.index - b.index);

  let answer = 0;
  let control = true;

  instructions.forEach(({ type, value }) => {
    if (type === "CONTROL") {
      control = value;
    } else if (control) {
      answer += value;
    }
  });

  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  await part1();
  await part2();
}
