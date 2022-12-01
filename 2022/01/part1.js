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
  return elvesCalories[0]
}

// assert.equal(processFile ('./test-data.txt'), 24000)
console.log('total calories', processFile('./data.txt'))
