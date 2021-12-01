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

assert.equal(countIncreases([199, 200, 208, 210, 200, 207, 240, 269, 260, 263]), 7)

console.log('total increases', countIncreases(numbers))
