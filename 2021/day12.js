const sampleInput = `start-A
start-b
A-c
A-b
b-d
A-end
b-end
`;

const sampleInput2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`;

const sampleInput3 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`;

const input = await fetch('https://adventofcode.com/2021/day/12/input').then(i => i.text());

function processInput(inputStr) {
  const lines = inputStr.split('\n');
  lines.pop(); // remove trailing newline
  return lines.map(l => l.split('-'));
}

class Cave {
  id = '';
  type = '';
  neighbors = [];

  constructor(id) {
    this.id = id;
    this.type = id === id.toLowerCase() ? 'small' : 'large';
  }

  link(cave) {
    this.neighbors.push(cave);
  }

  toString() {
    const header = `ID: ${this.id} (${this.type})`;
    const neighbors = this.neighbors.map(n => `\t -> ${n.id}`);
    return [header, ...neighbors].join('\n');
  }
}

class CaveSystem {
  caves = {};

  constructor(inputStr) {
    const cavePairs = processInput(inputStr);
    cavePairs.forEach(([id1, id2]) => {
      if (!this.caves[id1]) this.caves[id1] = new Cave(id1);
      if (!this.caves[id2]) this.caves[id2] = new Cave(id2);
      const cave1 = this.caves[id1];
      const cave2 = this.caves[id2];
      cave1.link(cave2);
      cave2.link(cave1);
    })
  }

  findPaths(skipDoubles = true, startNode = this.caves['start'], visited = [], path = []) {
    const finishedPaths = [];
    const currentVisited = new Set([...visited]);
    const currentPath = [...path, startNode.id];
    if (startNode.type === 'small') currentVisited.add(startNode.id)
    startNode.neighbors.forEach(n => {
      if (n.id === 'end') {
        const joinedPath = [...currentPath, 'end'].join('->');
        finishedPaths.push(joinedPath);
      } else if (!currentVisited.has(n.id)) {
        finishedPaths.push(...this.findPaths(skipDoubles, n, currentVisited, currentPath))
      } else if (!skipDoubles && n.id !== 'start') {
        // Haven't yet used our double-visit, allow this once
        finishedPaths.push(...this.findPaths(true, n, currentVisited, currentPath))
      }
    })
    return finishedPaths;
  }

  toString() {
    return Object.values(this.caves).map(c => c.toString()).join('\n')
  }
}

function play(input, { version = 1, verbose = false }) {
  const caveSystem = new CaveSystem(input);
  const paths = caveSystem.findPaths(version === 1);
  if (verbose) {
    paths.sort(); // to match sample output
    console.log(paths.map(p => '\t\t' + p).join('\n'));
  }
  return paths.length;
}

console.log("PART 1")
console.log('\tSample 1:', play(sampleInput, { verbose: true }))
console.log('\tSample 2:', play(sampleInput2, { verbose: true }))
console.log('\tSample 3:', play(sampleInput3, {}))
console.log('\tReal:', play(input, {}))

console.log("PART 2")
console.log('\tSample 1:', play(sampleInput, { version: 2, verbose: true }))
console.log('\tSample 2:', play(sampleInput2, { version: 2, verbose: true }))
console.log('\tSample 3:', play(sampleInput3, { version: 2 }))
console.log('\tReal:', play(input, { version: 2 }))
