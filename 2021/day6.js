const sampleInput = `3,4,3,1,2`;

const CYCLE = 6;
const INCUBATION = 2;

// Input is list of fish represented by timestamp, like [3, 4, 3, 1, 2]
// Used this for part 1 before refactoring in part 2
function originalLanternfishStateTransition(fish) {
  let extras = 0;
  const newFish = fish.map(i => {
    if (i === 0) {
      extras++;
      return CYCLE_LENGTH;
    }
    return i - 1;
  });
  for (let i = 0; i < extras; i++) {
    newFish.push(CYCLE + INCUBATION);
  }
  return newFish;
}

const emptyFishLifecycleArray = () => {
  const fishAtTimestamp = [];
  for (let i = 0; i <= (CYCLE + INCUBATION); i++) {
    fishAtTimestamp.push(0);
  }
  return fishAtTimestamp;
}

function convertInputToLifecycleGroup(input) {
  const fish = input.split(',').map(i => +i);
  const fishAtTimestamp = emptyFishLifecycleArray();
  fish.forEach(f => fishAtTimestamp[f] = fishAtTimestamp[f] + 1);
  return fishAtTimestamp;
}

// Input is an array 0 - CYCLE_LENGTH + INCUBATION, where each cell represents the number of fish at that lifecycle timestamp.
function lanternfishStateTransition(fishAtTimestamp) {
  const newFish = emptyFishLifecycleArray();

  const spawningFish = fishAtTimestamp[0];
  newFish[CYCLE] = spawningFish;
  newFish[CYCLE + INCUBATION] = spawningFish;

  for (let i = 1; i < newFish.length; i++) {
    const numFishAtLifecycle = fishAtTimestamp[i];
    newFish[i - 1] = newFish[i - 1] + numFishAtLifecycle;
  }

  return newFish;
}

function play(input, steps) {
  let fish = convertInputToLifecycleGroup(input);
  for (let i = 0; i < steps; i++) {
    fish = lanternfishStateTransition(fish);
  }
  return fish.reduce((acc, a) => acc + a);
}

console.log('Part 1, Sample Input:', play(sampleInput, 80));
console.log('Part 2, Sample Input:', play(sampleInput, 256));
