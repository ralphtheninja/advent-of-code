const fs = require('fs')
const assert = require('assert')

function readFile (file) {
  return fs.readFileSync(file, 'utf8').split(',').map(Number)
}

function stepsCost (steps) {
  if (steps === 1 || steps === 0) {
    return steps
  } else {
    return steps + stepsCost(steps - 1)
  }
}

function calculateCost (positions, from) {
  let totalCost = 0
  for (let to of positions) {
    totalCost += stepsCost(Math.abs(from - to))
  }
  return totalCost
}

function findMin (array) {
  return array.reduce((min, el) => el < min ? el : min, Infinity)
}

function findMax (array) {
  return array.reduce((max, el) => el > max ? el : max, -Infinity)
}

function findMinCost (positions) {
  const costs = []
  const min = findMin(positions)
  const max = findMax(positions)
  for (let from = min; from <= max; ++from) {
    costs.push(calculateCost(positions, from))
  }
  return findMin(costs)
}

function test () {
  assert.equal(stepsCost(0), 0)
  assert.equal(stepsCost(1), 1)
  assert.equal(stepsCost(2), 3)
  assert.equal(stepsCost(3), 6)
  assert.equal(stepsCost(16 - 5), 66)
  assert.equal(stepsCost(Math.abs(1 - 5)), 10)
  assert.equal(stepsCost(Math.abs(2 - 5)), 6)
  assert.equal(stepsCost(Math.abs(0 - 5)), 15)
  assert.equal(stepsCost(Math.abs(4 - 5)), 1)
  assert.equal(stepsCost(Math.abs(7 - 5)), 3)
  assert.equal(stepsCost(Math.abs(14 - 5)), 45)

  const positions = readFile('./test-data.txt')
  assert.equal(findMin(positions), 0)
  assert.equal(findMax(positions), 16)

  assert.equal(findMinCost(positions), 168)
}

// test()
console.log('min cost is', findMinCost(readFile('./data.txt')))
