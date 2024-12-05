const DAY_NUM = 5;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData1 = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;
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
  const [rawRules, rawPages] = rawData.trim().split("\n\n");
  const mustBeBefore = {};
  rawRules
    .trim()
    .split("\n")
    .forEach((line) => {
      const [first, second] = line.split("|");
      if (!mustBeBefore[first]) {
        mustBeBefore[first] = new Set();
      }
      mustBeBefore[first].add(second);
    });
  const pages = rawPages
    .trim()
    .split("\n")
    .map((line) => line.split(","));
  return { mustBeBefore, pages };
}

function isPageSorted(mustBeBefore, page) {
  const alreadySeen = new Set();

  return page.every((item) => {
    alreadySeen.add(item);
    const rulesForItem = mustBeBefore[item];
    if (!rulesForItem) return true;
    return !alreadySeen.intersection(rulesForItem).size;
  });
}

async function part1() {
  PART_NUMBER = 1;
  const { mustBeBefore, pages } = await getProcessedData();
  let answer = 0;

  pages.forEach((page) => {
    const sorted = isPageSorted(mustBeBefore, page);
    if (!sorted) return;

    const middleIndex = (page.length - 1) / 2;
    answer += +page.at(middleIndex);
  });

  console.log(`Part 1: ${answer}`);
}

function sortPage(mustBeBefore, page) {
  page.sort((a, b) => {
    if (mustBeBefore[a]?.has(b)) return -1;
    if (mustBeBefore[b]?.has(a)) return 1;
    return 0;
  });
}

async function part2() {
  PART_NUMBER = 2;
  const { mustBeBefore, pages } = await getProcessedData();
  let answer = 0;

  pages.forEach((page) => {
    const sorted = isPageSorted(mustBeBefore, page);
    if (sorted) return;

    sortPage(mustBeBefore, page);
    const middleIndex = (page.length - 1) / 2;
    answer += +page.at(middleIndex);
  });

  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  await part1();
  await part2();
}
