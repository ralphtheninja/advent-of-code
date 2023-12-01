const fs = require('fs')
const assert = require('assert')

function disjunct (one, two) {
  return one[1] < two[0] || two[1] < one[0]
}

function overlaps (one, two) {
  return !disjunct(one, two)
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
  const pairs = data.map(pair => {
    const [one, two] = pair.split(',')
    return {
      one: one.split('-').map(Number),
      two: two.split('-').map(Number)
    }
  })
  return pairs.reduce((total, pair) => {
    return total + (overlaps(pair.one, pair.two) ? 1 : 0)
  }, 0)
}

assert.equal(overlaps([2, 3], [4, 5]), false)
assert.equal(overlaps([2, 4], [6, 8]), false)
assert.equal(overlaps([5, 7], [7, 9]), true)
assert.equal(overlaps([2, 8], [3, 7]), true)
assert.equal(overlaps([4, 6], [6, 6]), true)
assert.equal(overlaps([2, 6], [4, 8]), true)

// assert.equal(run('./test-data.txt'), 4)
console.log('total score', run('./data.txt'))
