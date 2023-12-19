const fs = require('fs')
const ZERO = '0'

/**
 * Converts a number to a binary string with padding, e.g.
 * 0 -> '000'
 * 1 -> '001'
 * num: number to convert
 * length: length of binary string so we can determine padding
 */
function binaryString (num, length) {
  const numString = num.toString(2)
  const padding = ZERO.repeat(length - numString.length)
  return `${padding}${numString}`
}

function arrayEquals (left, right) {
  assert(Array.isArray(left))
  assert(Array.isArray(right))
  if (left.length !== right.length) return false
  for (let i = 0; i < left.length; ++i) {
    if (left[i] !== right[i]) return false
  }
  return true
}

function countMatches (pattern, compare) {
  const patternArray = pattern.split('')
  const questionMarks = pattern.split('').map((c, i) => {
    return { c, i }
  }).filter(el => el.c === '?').map(el => el.i)

  /**
   * We generate binary strings for all combinations of '.' and '#'
   * where '0' represents '.' and '1' represents '#'
   */
  const testStrings = []
  const questionCount = questionMarks.length
  const max = 2 ** questionCount
  for (let i = 0; i < max; ++i) {
    const str = binaryString(i, questionCount)
    const copy = patternArray.slice()
    for (let j = 0; j < questionCount; ++j) {
      const c = Number(str[j])
      const replacePos = questionMarks[j]
      const replaceWith = c ? '#' : '.'
      copy[replacePos] = replaceWith
    }
    testStrings.push(copy.join(''))
  }

  return testStrings.map(ts => {
    const test = ts.split('.').filter(Boolean).map(s => s.length)
    return arrayEquals(test, compare)
  }).filter(Boolean).length
}

function compute (file) {
  const data = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(row => {
    const [pattern, compare] = row.split(' ')
    return { pattern, compare: compare.split(',').map(Number) }
  })

  return data.map(el => countMatches(el.pattern, el.compare)).reduce((tot, el) => tot + el, 0)
}

const assert = require('assert')

assert.equal(countMatches('???.###', [1, 1, 3]), 1)
assert.equal(countMatches('.??..??...?##.', [1, 1, 3]), 4)
assert.equal(countMatches('?#?#?#?#?#?#?#?', [1, 3, 1, 6]), 1)
assert.equal(countMatches('????.#...#...', [4, 1, 1]), 1)
assert.equal(countMatches('????.######..#####.', [1, 6, 5]), 4)
assert.equal(countMatches('?###????????', [3, 2, 1]), 10)
assert.equal(compute('./input.test'), 21)

console.log('result', compute('./input'))
