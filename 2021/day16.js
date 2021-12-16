const input = await fetch('https://adventofcode.com/2021/day/16/input').then(i => i.text());

function processInput(inputStr) {
  const lines = inputStr.split('\n');
  return hexStringToBinary(lines[0]);
}

function hexBitToBinary(char) {
  const hexToBitLength = 4;
  const bin = parseInt(char, 16).toString(2);
  const leadingZeros = '0'.repeat(hexToBitLength - bin.length);
  return leadingZeros + bin;
}

function hexStringToBinary(string) {
  // We can't just do this beause the numbers are too big and we loose precision
  // const bin = parseInt(string, 16).toString(2);
  // const additionalZeros = '0'.repeat((string.length * 4) - bin.length);
  // return additionalZeros + bin;
  return string.split('').map(hexBitToBinary).join('');
}

function getPacketVersionAndType(string) {
  const version = parseInt(string.slice(0, 3), 2);
  const type = parseInt(string.slice(3, 6), 2);
  return { version, type };
}

const GROUP_LENGTH = 5;
const NUM_HEADER_CHARS = 6;
const LENGTH_TYPE_CHAR = 7;

function findLiteralNumber(packet) {
  const bitGroups = [];
  // We know the first 6 bits of the backet are the version and type
  let start = NUM_HEADER_CHARS;
  while (start < packet.length) {
    const bitGroup = packet.slice(start, start + GROUP_LENGTH);
    bitGroups.push(bitGroup.slice(1));
    if (bitGroup[0] === '0') break;
    start += GROUP_LENGTH;
  }

  const endOfPacket = NUM_HEADER_CHARS + (bitGroups.length * GROUP_LENGTH);
  const value = parseInt(bitGroups.join(''), 2);
  return { value, endOfPacket };
}

function doOperation(type, subPackets) {
  if (type === 0) { // Sum
    return subPackets.reduce((acc, p) => acc + p.value, 0);
  } else if (type === 1) { // Product
    return subPackets.reduce((acc, p) => acc * p.value, 1);
  } else if (type === 2) { // Min
    let min = subPackets[0].value;
    subPackets.forEach(({value}) => {
      if (value < min) min = value;
    })
    return min;
  } else if (type === 3) { // Max
    let max = subPackets[0].value;
    subPackets.forEach(({value}) => {
      if (value > max) max = value;
    })
    return max;
  } else if (type === 5) { // Greater than
    return subPackets[0].value > subPackets[1].value ? 1 : 0;
  } else if (type === 6) { // Less than
    return subPackets[0].value < subPackets[1].value ? 1 : 0;
  } else if (type === 7) { // Equals
    return subPackets[0].value === subPackets[1].value ? 1 : 0;
  }
}

function parsePacket(packet, verbose, logChar = '') {
  const { version, type } = getPacketVersionAndType(packet);

  if (verbose) console.log(logChar + `NEW PACKET - Version: ${version}, Type: ${type}`);

  if (type === 4) {
    const val = findLiteralNumber(packet)
    if (verbose) console.log( logChar + 'Literal Number: ' + val.value)
    return {...val, vTotal: version};
  } else {
    if (verbose) console.log(logChar + 'Operator')
    const lengthTypeId = packet[LENGTH_TYPE_CHAR - 1];
    const subPackets = [];
    let subPacketStart = LENGTH_TYPE_CHAR;
    if (lengthTypeId === '0') {
      // Next 15 bits represent total length in bits of subpackets
      subPacketStart += 15;
      const fifteenBits = packet.slice(LENGTH_TYPE_CHAR, subPacketStart);
      const stopIndex = subPacketStart + parseInt(fifteenBits, 2);
      if (verbose) console.log(logChar + "Length type 0, Stop at: " + stopIndex);
      while (subPacketStart < stopIndex) {
        const newPacket = parsePacket(packet.slice(subPacketStart), verbose, logChar + '\t');
        subPackets.push(newPacket);
        subPacketStart += newPacket.endOfPacket;
      }
    } else {
      // Next 11 bits represent num subpackets
      subPacketStart += 11;
      const elevenBits = packet.slice(LENGTH_TYPE_CHAR, subPacketStart);
      const numSubpackets = parseInt(elevenBits, 2);
      if (verbose) console.log(logChar + "Length type 1, Num Subpackets: " + numSubpackets);
      for (let i = 0; i < numSubpackets; i++) {
        const newPacket = parsePacket(packet.slice(subPacketStart), verbose, logChar + '\t');
        subPackets.push(newPacket);
        subPacketStart += newPacket.endOfPacket;
      }
    }
    const value = doOperation(type, subPackets);
    const subPacketVersionsSum = subPackets.reduce((acc, a) => acc + a.vTotal, 0);
    return { value, endOfPacket: subPacketStart, vTotal: version + subPacketVersionsSum }
  }
}

// Part 1

function part1(input, verbose = false) {
  if (verbose) console.log(input);
  const binString = processInput(input);
  if (verbose) console.log(binString);
  return parsePacket(binString, verbose).vTotal;
}

console.log("PART 1")
console.log("\tSample Input:", part1("D2FE28\n"))
console.log("\tSample Input 2:", part1("38006F45291200\n"))
console.log("\tSample Input 3:", part1("EE00D40C823060\n"))
console.log("\tSample Input 4", part1("8A004A801A8002F478\n", true))
console.log("\tSample Input 5", part1("620080001611562C8802118E34\n"))
console.log("\tSample Input 6", part1("C0015000016115A2E0802F182340\n"))
console.log("\tSample Input 7", part1("A0016C880162017C3686B18A3D4780\n"))
console.log("\tReal Input:", part1(input))

// Part 2


function part2(input, verbose = false) {
  if (verbose) console.log(input);
  const binString = processInput(input);
  if (verbose) console.log(binString);
  return parsePacket(binString, verbose).value;
}

console.log("PART 2")
console.log("\tSample Input:", part2("D2FE28\n"))
console.log("\tSample Input 2:", part2("C200B40A82\n"))
console.log("\tSample Input 3:", part2("04005AC33890\n"))
console.log("\tSample Input 4", part2("880086C3E88112\n"))
console.log("\tSample Input 5", part2("CE00C43D881120\n"))
console.log("\tSample Input 6", part2("D8005AC2A8F0\n"))
console.log("\tSample Input 7", part2("F600BC2D8F\n"))
console.log("\tSample Input 8", part2("9C005AC2F8F0\n"))
console.log("\tSample Input 9", part2("9C0141080250320F1802104A08\n", true))
console.log("\tReal Input:", part2(input))
