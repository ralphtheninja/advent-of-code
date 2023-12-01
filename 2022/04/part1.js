const fs = require('fs')
const assert = require('assert')

function contains (one, two) {
  return one[0] <= two[0] && one[1] >= two[1]
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
  return pairs.reduce((total, { one, two }) => {
    return total + (contains(one, two) || contains(two, one) ? 1 : 0)
  }, 0)
}

assert.equal(contains([6, 6], [4, 6]), false)
assert.equal(contains([4, 6], [6, 6]), true)
assert.equal(contains([2, 8], [3, 7]), true)
assert.equal(contains([3, 7], [2, 8]), false)
assert.equal(contains([5, 7], [7, 9]), false)
assert.equal(contains([7, 9], [5, 7]), false)

// assert.equal(run('./test-data.txt'), 2)
console.log('total score', run('./data.txt'))
