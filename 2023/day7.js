const DAY_NUM = 7;

let TESTING = true;
let PART_NUMBER = 1;

const sampleData = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

async function fetchData() {
  if (TESTING) {
    return sampleData;
  }
  return fetch(`https://adventofcode.com/2023/day/${DAY_NUM}/input`).then(
    (res) => res.text()
  );
}

const cardValue = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};

function getCardValue(card) {
  if (card === "J") {
    return PART_NUMBER === 1 ? 11 : 1;
  }
  return cardValue[card];
}

const HandTypes = {
  FiveOfAKind: 7,
  FourOfAKind: 6,
  FullHouse: 5,
  ThreeOfAKind: 4,
  TwoPair: 3,
  OnePair: 2,
  HighCard: 1,
};

function getType(cards) {
  const countByLabel = {};
  cards.forEach((label) => {
    if (!countByLabel[label]) {
      countByLabel[label] = 0;
    }
    countByLabel[label] += 1;
  });
  if (PART_NUMBER === 2 && countByLabel["J"]) {
    const numJokers = countByLabel["J"];
    if (numJokers === 5) {
      return HandTypes.FiveOfAKind;
    }
    delete countByLabel["J"];
    const highestCountLabel = Object.entries(countByLabel).reduce(
      (prev, next) => (next[1] > prev[1] ? next : prev)
    )[0];
    if (TESTING) {
      console.log(
        `Highest count label is ${highestCountLabel}, adding ${numJokers} jokers`
      );
    }
    countByLabel[highestCountLabel[0]] += numJokers;
  }
  const numLabels = Object.keys(countByLabel).length;
  if (numLabels === 1) {
    return HandTypes.FiveOfAKind;
  } else if (numLabels === 5) {
    return HandTypes.HighCard;
  } else if (numLabels === 4) {
    return HandTypes.OnePair;
  } else if (numLabels === 3) {
    return Math.max(...Object.values(countByLabel)) === 3
      ? HandTypes.ThreeOfAKind
      : HandTypes.TwoPair;
  } else if (numLabels === 2) {
    return Math.max(...Object.values(countByLabel)) === 4
      ? HandTypes.FourOfAKind
      : HandTypes.FullHouse;
  }
  console.log(cards, countByLabel);
  throw new Error(`Unexpected number of labels ${numLabels}`);
}

function compareHands(handA, handB) {
  if (handA.type !== handB.type) {
    return handA.type - handB.type;
  }
  for (let i = 0; i < 5; i++) {
    const cardScoreA = getCardValue(handA.cards[i]);
    const cardScoreB = getCardValue(handB.cards[i]);
    if (cardScoreA !== cardScoreB) {
      return cardScoreA - cardScoreB;
    }
  }
  return 0;
}

function getHand(line) {
  const rawValues = line.split(" ");
  const cards = rawValues[0].split("");
  const bid = +rawValues[1];
  const type = getType(cards);
  if (TESTING) {
    console.log(`Hand ${rawValues[0]} is type ${type}`);
  }
  return { cards, bid, type };
}

async function getProcessedData() {
  const rawData = await fetchData();
  return rawData.trim().split("\n");
}

async function part(partNumber) {
  PART_NUMBER = partNumber;
  const data = await getProcessedData();
  const orderedHands = data.map(getHand).sort(compareHands);
  if (TESTING) {
    console.log({ orderedHands });
  }

  let answer = 0;
  orderedHands.forEach((hand, i) => {
    const score = (i + 1) * hand.bid;
    answer += score;
  });

  console.log(`Part ${partNumber}: ${answer}`);
}

async function puzzle(env = "testing") {
  TESTING = env === "testing";
  await part(1);
  await part(2);
}
