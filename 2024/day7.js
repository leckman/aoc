const DAY_NUM = 7;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;
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
    .map((line) => {
      const [expectedResult, numString] = line.split(": ");
      const nums = numString.split(" ").map((i) => +i);
      return { expectedResult: +expectedResult, nums };
    });
}

const FN_NAMES = {
  ADD: "ADD",
  MUL: "MUL",
  CONCAT: "CONCAT",
};

const FNS = {
  [FN_NAMES.ADD]: (a, b) => a + b,
  [FN_NAMES.MUL]: (a, b) => a * b,
  [FN_NAMES.CONCAT]: (a, b) => +`${a}${b}`,
};

function evaluateEquation(nums, operandList) {
  let result = 0;
  operandList.unshift(FN_NAMES.ADD); // Identity
  for (let i = 0; i < nums.length; i++) {
    result = FNS[operandList[i]](result, nums[i]);
  }
  return result;
}

const DIGIT_TO_FN_NAME = {
  0: FN_NAMES.MUL,
  1: FN_NAMES.ADD,
  2: FN_NAMES.CONCAT,
};

function expectedResultIsPossible(expectedResult, nums, base = 2) {
  const operands = nums.length - 1;
  const numPermutations = base ** operands;
  for (let i = 0; i < numPermutations; i++) {
    const binaryRep = i.toString(base).padStart(operands, "0");
    const operandKey = binaryRep.split("").map((val) => DIGIT_TO_FN_NAME[val]);
    const result = evaluateEquation(nums, operandKey);
    if (expectedResult === result) {
      return true;
    }
  }
  return false;
}

async function part1() {
  PART_NUMBER = 1;
  const data = await getProcessedData();
  let answer = 0;

  data.forEach(({ expectedResult, nums }) => {
    if (expectedResultIsPossible(expectedResult, nums)) {
      answer += expectedResult;
    }
  });

  console.log(`Part 1: ${answer}`);
}

async function part2() {
  PART_NUMBER = 2;
  const data = await getProcessedData();
  let answer = 0;

  data.forEach(({ expectedResult, nums }, i) => {
    if (expectedResultIsPossible(expectedResult, nums, 3)) {
      answer += expectedResult;
    }
  });
  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  await part1();
  await part2();
}
