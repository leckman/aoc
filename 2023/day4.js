const DAY_NUM = 4;
let TESTING = true;

const sampleData1 = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

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

function processCardFromLine(line, id) {
  const [winning, have] = line
    .split(":")[1]
    .split("|")
    .map((part) => part.trim().split(" "));
  const matches = winning.filter((i) => have.indexOf(i) > -1).length;
  return { id: id + 1, matches };
}

async function part1() {
  const data = await getProcessedData();
  let answer = 0;
  data.forEach((line, i) => {
    const { matches } = processCardFromLine(line, i);
    const score = matches > 0 ? 2 ** (matches - 1) : 0;
    answer += score;
  });
  console.log(`Part 1: ${answer}`);
}

function numExpandedCards(card, cardsById, cardScoreById) {
  const memoizedScore = cardScoreById[card.id];
  if (memoizedScore) {
    if (TESTING) {
      console.log(`Memoized score ${memoizedScore} for card ${card.id}`);
    }
    return memoizedScore;
  }
  if (TESTING) {
    console.log(`BEGINNING CARD ${card.id}`);
  }
  let numCards = 1; // For this card
  for (let i = 0; i < card.matches; i++) {
    numCards += numExpandedCards(
      cardsById[card.id + i + 1],
      cardsById,
      cardScoreById
    );
  }
  cardScoreById[card.id] = numCards;
  if (TESTING) {
    console.log(`END CARD ${card.id}, score of ${numCards}`);
  }
  return numCards;
}

async function part2() {
  const data = await getProcessedData();
  let answer = 0;

  const cards = data.map(processCardFromLine);
  const cardsById = {};
  cards.forEach((card) => (cardsById[card.id] = card));
  const cardScoresById = {};

  cards.forEach((card) => {
    answer += numExpandedCards(card, cardsById, cardScoresById);
  });
  console.log(`Part 2: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  part1();
  part2();
}
