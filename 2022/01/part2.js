const fs = require('fs')
const assert = require('assert')

function sumVector (vec) {
  return vec.reduce((tot, value) => tot + value, 0)
}

function processFile (file) {
  const data = fs.readFileSync(file, 'utf8')
  const elves = data.split('\n\n').map(s => s.trim().split('\n').map(Number))
  const elvesCalories = elves.map(sumVector).sort((lhs, rhs) => {
    if (lhs > rhs) return -1
    else if (lhs < rhs) return 1
    else return 0
  })
  return sumVector(elvesCalories.slice(0, 3))
}

// assert.equal(processFile ('./test-data.txt'), 45000)
console.log('total calories', processFile('./data.txt'))
