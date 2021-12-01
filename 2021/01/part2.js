const fs = require('fs')
const assert = require('assert')
const data = fs.readFileSync('./data.txt', 'utf8')
const numbers = data.split('\n').map(Number)

function countIncreases (list) {
  return list.reduce((sum, d, i) => {
    if (i > 0 && d > list[i - 1]) {
      return sum + 1
    } else {
      return sum
    }
  }, 0)
}

const TEST = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263]
assert.equal(countIncreases(TEST), 7)

function slidingWindow (list) {
  const result = []
  for (let i = 0; i <= list.length - 3; ++i) {
    result.push(list[i] + list[i + 1] + list[i + 2])
  }
  return result
}

assert.deepEqual(
  slidingWindow(TEST),
  [
    199 + 200 + 208,
    200 + 208 + 210,
    208 + 210 + 200,
    210 + 200 + 207,
    200 + 207 + 240,
    207 + 240 + 269,
    240 + 269 + 260,
    269 + 260 + 263
  ]
)
assert.equal(countIncreases(slidingWindow(TEST)), 5)

console.log('total increases', countIncreases(slidingWindow(numbers)))

