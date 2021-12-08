const sampleInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`;

const input = await fetch('https://adventofcode.com/2021/day/8/input').then(i => i.text());

// Helpers for array management

function without(arr, ...values) {
  return arr.filter(v => !values.includes(v))
}

function union(a1, a2) {
  return a1.filter(v => a2.includes(v))
}

// Input processing

function getSignals(inputStr) {
  const [nums, _] = inputStr.split(' | ');
  return nums.split(' ').map(s => s.split(''))
}

function getOutputs(inputStr, signalMap) {
  const [_, outputs] = inputStr.split(' | ');
  const groupedOutputs = outputs.split(' ').map(s => s.split(''));
  return groupedOutputs.map(o => {
    const newOutput = o.map(i => signalMap[i]);
    newOutput.sort();
    const signal = newOutput.join('');
    return numbersBySignal[signal]
  });
}

const numbersBySignal = {
  'abcefg': 0,
  'cf': 1,
  'acdeg': 2,
  'acdfg': 3,
  'bcdf': 4,
  'abdfg': 5,
  'abdefg': 6,
  'acf': 7,
  'abcdefg': 8,
  'abcdfg': 9,
}

function mapWiresToSignals(signals) {
  const wires = {}
  // First, find the 2-bit signal, eg '[a,b]'
  const cf = signals.find(s => s.length === 2);
  // Then, find the 3-bit signal. This tells us the wire for 'a'
  const acf = signals.find(s => s.length === 3)
  const a = without(acf, ...cf)[0];
  // Then, find the 4-bit signal. This tells us the wires for b and d.
  const bcdf = signals.find(s => s.length === 4);
  const bd = without(bcdf, ...cf);

  // 5 - bit signals
  const [five1, five2, five3] = signals.filter(s => s.length === 5);
  const adg = union(union(five1, five2), five3);
  const dg = without(adg, a);
  const g = without(dg, ...bd)[0];
  const d = without(dg, g)[0];
  const b = without(bd, d)[0];

  const fivesWithoutKnowns = [five1, five2, five3].map(s => without(s, a, b, d, g));
  const f = fivesWithoutKnowns.find(s => s.length === 1)[0];
  const c = without(cf, f)[0];
  const e = fivesWithoutKnowns.map(s => without(s, a, b, c, d, f, g)).find(s => s.length === 1)[0];

  const signalsToWires = {a, b, c, d, e, f, g};
  const wiresToSignals = {};
  Object.entries(signalsToWires).forEach(([k, v]) => wiresToSignals[v] = k);
  return wiresToSignals;
}

const targetNumbers = [1, 4, 7, 8];
function numTargetNumbersInLine(line) {
  const s = getSignals(line);
  const signalMap = mapWiresToSignals(s);
  const o = getOutputs(line, signalMap);
  return o.filter(i => targetNumbers.includes(i)).length;
}

function fourDigitOutputValue(line) {
  const s = getSignals(line);
  const signalMap = mapWiresToSignals(s);
  const o = getOutputs(line, signalMap);
  // Translate [5, 4, 3, 2] to 5432
  return +(o.join(''));
}

function play(input, version = 1) {
  const outputFn = version === 1 ? numTargetNumbersInLine : fourDigitOutputValue;
  const lines = input.split('\n');
  lines.pop(); // remove trailing newline
  return lines.reduce((acc, l) => acc + outputFn(l), 0)
}

console.log('Sample:')
console.log('\tPart 1:', play(sampleInput))
console.log('\tPart 2:', play(sampleInput, 2))

console.log('Real:')
console.log('\tPart 1:', play(input))
console.log('\tPart 2:', play(input, 2))
