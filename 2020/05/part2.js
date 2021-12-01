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

const seatIds = passes.map(getSeatId).sort((a, b) => {
  if (a < b) return -1
  else if (a > b) return 1
  else return 0
})
seatIds.forEach(id => console.log(id))

console.log('number of passes', seatIds.length)
console.log('number of seats', 128 * 8)

for (let i = 0; i < seatIds.length - 1; ++i) {
  const a = seatIds[i]
  const b = seatIds[i + 1]
  if (b - a > 1) {
    console.log('found discrepancy at', i, a, b)
  }
}

