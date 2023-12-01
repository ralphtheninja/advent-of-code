const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)
const { deepStrictEqual } = require('assert')

/**
 * Returns the bit value in an address for a particular position.
 * Even though the addresses that are coming from the text file are small,
 * we need to use BigInt() since the position will still vary from 0 to 35
 * since the bit mask is 36 bits long.
 */
function getBit (address, pos) {
  const shifted = BigInt(1) << BigInt(pos)
  return BigInt(address) & shifted ? 1 : 0
}

deepStrictEqual(getBit(0b101010, 0), 0)
deepStrictEqual(getBit(0b101010, 1), 1)
deepStrictEqual(getBit(0b101010, 2), 0)
deepStrictEqual(getBit(0b101010, 3), 1)
deepStrictEqual(getBit(0b101010, 4), 0)
deepStrictEqual(getBit(0b101010, 5), 1)
deepStrictEqual(getBit(0b101010, 28), 0)
deepStrictEqual(getBit(0b101010, 32), 0)
deepStrictEqual(getBit(0b101010, 35), 0)

function maskedAddress (address, mask) {
  const result = []
  for (let i = 0; i < mask.length; ++i) {
    const maskValue = mask[i]
    if (maskValue === '0') {
      const bit = getBit(address, mask.length - 1 - i)
      result.push(String(bit))
    } else if (maskValue === '1') {
      result.push('1')
    } else if (maskValue === 'X') {
      result.push('X')
    }
  }
  return result.join('')
}

deepStrictEqual(
  maskedAddress(0b101010, '000000000000000000000000000000X1001X'),
  '000000000000000000000000000000X1101X'
) // 42
deepStrictEqual(
  maskedAddress(0b11010, '00000000000000000000000000000000X0XX'),
  '00000000000000000000000000000001X0XX'
) // 26

function expandMaskedAddress (address) {
  let result = []

  // Find first non zero element from left in address
  let last = 0
  for (; last < address.length; ++last) {
    if (address[last] !== '0') break
  }

  function unshift (element) {
    return function (arr) {
      const copy = arr.slice()
      copy.unshift(element)
      return copy
    }
  }

  for (let i = address.length - 1; i >= last; --i) {
    const value = address[i]
    if (value === 'X') {
      if (result.length) {
        result = result.map(unshift('0')).concat(result.map(unshift('1')))
      } else {
        result = [['0'], ['1']]
      }
    } else {
      if (result.length) {
        result = result.map(unshift(value))
      } else {
        result.unshift([value])
      }
    }
  }
  return result.map(arr => Number('0b' + arr.join('')))
}

deepStrictEqual(
  expandMaskedAddress('0000000000000000000000000000000000X1'),
  [1, 3]
)
deepStrictEqual(
  expandMaskedAddress('000000000000000000000000000000X1101X'),
  [26, 27, 58, 59]
)
deepStrictEqual(
  expandMaskedAddress('00000000000000000000000000000001X0XX'),
  [16, 17, 18, 19, 24, 25, 26, 27]
)

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
        const address = maskedAddress(Number(match[1]), mask)
        const addresses = expandMaskedAddress(address)
        addresses.forEach(a => {
          mem[a] = Number(arg)
        })
      }
    }
  })
  return Object.values(mem).reduce((v, total) => v + total, 0)
}

// Test
deepStrictEqual(initialize([
  'mask = 000000000000000000000000000000X1001X',
  'mem[42] = 100',
  'mask = 00000000000000000000000000000000X0XX',
  'mem[26] = 1'
]), 208)

console.log(initialize(DATA))
