const fs = require('fs')
const assert = require('assert')

function findCommonLetter (left, right) {
  const length = left.length
  for (let i = 0; i < length; ++i) {
    const c = left[i]
    if (right.includes(c)) return c
  }
  assert(false, 'should not happen')
}

function charToPriority (char) {
  const code = char.charCodeAt(0)
  return code >= 97 ? code - 97 + 1 : code - 65 + 27
}

function computePriority (sack) {
  const length = sack.length
  assert.equal(length % 2, 0)
  const left = sack.slice(0, length / 2)
  const right = sack.slice(length / 2)
  return charToPriority(findCommonLetter(left, right))
}

function run (file) {
  const sacks = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
  return sacks.map(computePriority).reduce((tot, val) => tot + val, 0)
}

assert.equal(charToPriority('a'), 1)
assert.equal(charToPriority('c'), 3)
assert.equal(charToPriority('z'), 26)
assert.equal(charToPriority('A'), 27)
assert.equal(charToPriority('C'), 29)
assert.equal(charToPriority('Z'), 52)

assert.equal(run('./test-data.txt'), 157)
console.log('total score', run('./data.txt'))
