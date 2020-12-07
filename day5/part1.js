const fs = require('fs')
const passes = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)
const assert = require('assert')

function getLowerHalf (range) {
  const [from, to] = range
  const N = to - from + 1
  return [from, from + (N / 2 - 1)]
}

function getUpperHalf (range) {
  const [from, to] = range
  const N = to - from + 1
  return [to - (N / 2 - 1), to]
}

function getRow (pass) {
  const data = pass.slice(0, 7).split('')
  let range = [0, 127]
  data.forEach(char => {
    if (char === 'F') {
      range = getLowerHalf(range)
    } else if (char === 'B') {
      range = getUpperHalf(range)
    }
  })
  assert.strictEqual(range[0], range[1])
  return range[0]
}

function getColumn (pass) {
  const data = pass.slice(-3).split('')
  let range = [0, 7]
  data.forEach(char => {
    if (char === 'L') {
      range = getLowerHalf(range)
    } else if (char === 'R') {
      range = getUpperHalf(range)
    }
  })
  assert.strictEqual(range[0], range[1])
  return range[0]
}

function getSeatId (pass) {
  return getRow(pass) * 8 + getColumn(pass)
}

// Tests

assert.deepStrictEqual(getLowerHalf([0, 127]), [0, 63])  // F
assert.deepStrictEqual(getUpperHalf([0, 63]), [32, 63])  // B
assert.deepStrictEqual(getLowerHalf([32, 63]), [32, 47]) // F
assert.deepStrictEqual(getUpperHalf([32, 47]), [40, 47]) // B
assert.deepStrictEqual(getUpperHalf([40, 47]), [44, 47]) // B
assert.deepStrictEqual(getLowerHalf([44, 47]), [44, 45]) // F
assert.deepStrictEqual(getLowerHalf([44, 45]), [44, 44]) // F

assert.deepStrictEqual(getUpperHalf([0, 127]), [64, 127])

assert.equal(getRow('FBFBBFFRLR'), 44)
assert.equal(getRow('BFFFBBFRRR'), 70)
assert.equal(getRow('FFFBBBFRRR'), 14)
assert.equal(getRow('BBFFBBFRLL'), 102)

assert.equal(getColumn('BFFFBBFRRR'), 7)
assert.equal(getColumn('FFFBBBFRRR'), 7)
assert.equal(getColumn('BBFFBBFRLL'), 4)

assert.equal(getSeatId('BFFFBBFRRR'), 567)
assert.equal(getSeatId('FFFBBBFRRR'), 119)
assert.equal(getSeatId('BBFFBBFRLL'), 820)

console.log('number of boarding passes', passes.length)

let maxSeatId = passes.map(getSeatId).reduce((item, max) => {
  if (item > max) return item
  else return max
}, 0)
console.log('max seat id', maxSeatId)

