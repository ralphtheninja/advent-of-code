const fs = require('fs')
// const assert = require('assert')

function readFile (file) {
  return fs.readFileSync(file, 'utf8').split(',').map(Number)
}

function calculateCost (positions, from) {
  let cost = 0
  for (const to of positions) {
    cost += Math.abs(from - to)
  }
  return cost
}

function findMin (costs) {
  return costs.reduce((min, el) => {
    return el < min ? el : min
  }, Infinity)
}

/*
function test () {
  const positions = readFile('./test-data.txt')
  const costs = positions.map(from => calculateCost(positions, from))
  assert.equal(findMin(costs), 37)
}
test()
*/

const positions = readFile('./data.txt')
const costs = positions.map(from => calculateCost(positions, from))
console.log('min cost is', findMin(costs))
