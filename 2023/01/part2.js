const fs = require('fs')

const NUMBERS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
]

/**
 * Get the next number from a string and return the tail
 */
function getNext (line) {
  if (!line) { return { value: undefined, rest: '' } }

  // Check if the first character is a number
  const c = line[0]
  if (!isNaN(Number(c))) {
    return { value: Number(c), rest: line.substring(1) }
  }

  // First check if the string starts with one of the numbers in letters
  for (let i = 0; i < NUMBERS.length; ++i) {
    const N = NUMBERS[i]
    if (line.startsWith(N)) {
      return { value: i + 1, rest: line.substring(1) }
    }
  }

  // Otherwise we recurse down
  return getNext(line.substring(1))
}

function lineToNumber (line) {
  let first, last
  while (true) {
    const { value, rest } = getNext(line)
    if (value) {
      if (!first) {
        first = value
      }
      last = value
    }
    if (rest) {
      line = rest
    } else {
      break
    }
  }

  return 10 * first + last
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const digits = lines.map(lineToNumber)
  return digits.reduce((tot, el) => tot + el, 0)
}

/**
 * Test
 */
const assert = require('assert')
assert.deepEqual(getNext('two1nine'), { value: 2, rest: 'wo1nine' })
assert.deepEqual(getNext('1nine'), { value: 1, rest: 'nine' })
assert.deepEqual(getNext('nine'), { value: 9, rest: 'ine' })
assert.deepEqual(getNext('2threexyz'), { value: 2, rest: 'threexyz' })
assert.deepEqual(getNext('threexyz'), { value: 3, rest: 'hreexyz' })
assert.deepEqual(getNext('xyz'), { value: undefined, rest: '' })
assert.equal(lineToNumber('eightwothree'), 83)
assert.equal(lineToNumber('two1nine'), 29)
assert.equal(lineToNumber('abcone2threexyz'), 13)
assert.equal(lineToNumber('xtwone3four'), 24)
assert.equal(lineToNumber('4nineeightseven2'), 42)
assert.equal(lineToNumber('zoneight234'), 14)
assert.equal(lineToNumber('7pqrstsixteen'), 76)
// Special case where two and one become twone
assert.equal(lineToNumber('5five686lvmlgk4twonefmr'), 51)
// Special case where one and eight become oneight
assert.equal(lineToNumber('2fivedxlntgmgjtwooneightt'), 28)
assert.equal(run('./test-data2.txt'), 281)

/**
 * Challenge
 */
console.log('result', run('./data.txt'))
