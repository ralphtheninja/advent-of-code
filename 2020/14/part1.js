const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)
const { deepStrictEqual } = require('assert')

function setBit (value, pos, setBit) {
  value = BigInt(value)
  const shifted = BigInt(1) << BigInt(pos)
  if (setBit) {
    return value | shifted
  } else {
    return value & ~shifted
  }
}

function maskedValue (value, mask) {
  let newValue = value
  for (let i = mask.length - 1; i >= 0; --i) {
    const bit = mask[i]
    if (bit !== 'X') {
      newValue = setBit(newValue, mask.length - 1 - i, Number(bit))
    }
  }
  return newValue
}

function initialize (program) {
  const mem = {}
  let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  const memRegex = /mem\[(\d+)\]/i
  program.forEach(row => {
    const [cmd, arg] = row.split(' = ')
    if (cmd === 'mask') {
      mask = arg
    } else if (cmd.startsWith('mem[')) {
      const match = cmd.match(memRegex)
      if (match) {
        mem[match[1]] = maskedValue(BigInt(arg), mask)
      }
    }
  })
  return Object.values(mem).reduce((v, total) => v + total, 0n)
}

// Test
deepStrictEqual(setBit(0b1011, 0, 0), BigInt(0b1010))
deepStrictEqual(setBit(0b1011, 0, 1), BigInt(0b1011))
deepStrictEqual(setBit(0b1011, 1, 0), BigInt(0b1001))
deepStrictEqual(setBit(0b1011, 1, 1), BigInt(0b1011))
deepStrictEqual(setBit(0b1011, 2, 1), BigInt(0b1111))
deepStrictEqual(setBit(0b1011, 3, 1), BigInt(0b1011))
deepStrictEqual(setBit(0b1011, 4, 1), BigInt(0b11011))
deepStrictEqual(setBit(0b1001, 6, 1), BigInt(0b1001001))
deepStrictEqual(setBit(0b1001, 6, 0), BigInt(0b1001))
deepStrictEqual(setBit(0, 6, 1), 64n)
deepStrictEqual(maskedValue(11, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'), 73n)
deepStrictEqual(maskedValue(101, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'), 101n)
deepStrictEqual(maskedValue(0, 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'), 64n)
deepStrictEqual(initialize([
  'mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X',
  'mem[8] = 11',
  'mem[7] = 101',
  'mem[8] = 0'
]), 165n)

deepStrictEqual(
  maskedValue(880, '10X01101XX1101101011100X0001X1X10111'),
  37906776439n
)

console.log(initialize(DATA))

// Obviously the first tests succeeded but the real data failed at first
// The pit to avoid falling into here is that we need big ints, since flipping
// bit 31 produce a negative number.
