const fs = require('fs')
// const assert = require('assert')

function readFile (file) {
  return fs.readFileSync(file, 'utf8').split(',').map(s => s.trim()).map(Number).filter(Boolean)
}

function iterate (_state) {
  const countZeros = _state.reduce((sum, el) => el === 0 ? sum + 1 : sum, 0)
  const state = _state.map(fish => {
    if (fish > 0) {
      return fish - 1
    } else {
      return 6
    }
  })
  for (let i = 0; i < countZeros; ++i) {
    state.push(8)
  }
  return state
}

/*
function test () {
  // Day 0
  let state = readFile('./test-data.txt')

  // Day 1
  state = iterate(state)
  assert.deepEqual(state, [2, 3, 2, 0, 1])

  // Day 2
  state = iterate(state)
  assert.deepEqual(state, [1, 2, 1, 6, 0, 8])

  // Day 3
  state = iterate(state)
  assert.deepEqual(state, [0, 1, 0, 5, 6, 7, 8])

  // Day 4
  state = iterate(state)
  assert.deepEqual(state, [6, 0, 6, 4, 5, 6, 7, 8, 8])

  // Day 5
  state = iterate(state)
  assert.deepEqual(state, [5, 6, 5, 3, 4, 5, 6, 7, 7, 8])

  // Day 6
  state = iterate(state)
  assert.deepEqual(state, [4, 5, 4, 2, 3, 4, 5, 6, 6, 7])

  // Day 7
  state = iterate(state)
  assert.deepEqual(state, [3, 4, 3, 1, 2, 3, 4, 5, 5, 6])

  // Day 8
  state = iterate(state)
  assert.deepEqual(state, [2, 3, 2, 0, 1, 2, 3, 4, 4, 5])

  // Day 9
  state = iterate(state)
  assert.deepEqual(state, [1, 2, 1, 6, 0, 1, 2, 3, 3, 4, 8])

  // Day 10
  state = iterate(state)
  assert.deepEqual(state, [0, 1, 0, 5, 6, 0, 1, 2, 2, 3, 7, 8])

  // Day 11
  state = iterate(state)
  assert.deepEqual(state, [6, 0, 6, 4, 5, 6, 0, 1, 1, 2, 6, 7, 8, 8, 8])

  // Day 12
  state = iterate(state)
  assert.deepEqual(state, [5, 6, 5, 3, 4, 5, 6, 0, 0, 1, 5, 6, 7, 7, 7, 8, 8])

  // Day 13
  state = iterate(state)
  assert.deepEqual(state, [4, 5, 4, 2, 3, 4, 5, 6, 6, 0, 4, 5, 6, 6, 6, 7, 7, 8, 8])

  // Day 14
  state = iterate(state)
  assert.deepEqual(state, [3, 4, 3, 1, 2, 3, 4, 5, 5, 6, 3, 4, 5, 5, 5, 6, 6, 7, 7, 8])

  // Day 15
  state = iterate(state)
  assert.deepEqual(state, [2, 3, 2, 0, 1, 2, 3, 4, 4, 5, 2, 3, 4, 4, 4, 5, 5, 6, 6, 7])

  // Day 16
  state = iterate(state)
  assert.deepEqual(state, [1, 2, 1, 6, 0, 1, 2, 3, 3, 4, 1, 2, 3, 3, 3, 4, 4, 5, 5, 6, 8])

  // Day 17
  state = iterate(state)
  assert.deepEqual(state, [0, 1, 0, 5, 6, 0, 1, 2, 2, 3, 0, 1, 2, 2, 2, 3, 3, 4, 4, 5, 7, 8])

  // Day 18
  state = iterate(state)
  assert.deepEqual(state, [6, 0, 6, 4, 5, 6, 0, 1, 1, 2, 6, 0, 1, 1, 1, 2, 2, 3, 3, 4, 6, 7, 8, 8, 8, 8])
  assert.equal(state.length, 26)

  // Iterate to Day 80
  for (let i = 19; i <= 80; ++i) {
    state = iterate(state)
  }
  assert.equal(state.length, 5934)
}
test()
*/

let state = readFile('./data.txt')
for (let i = 0; i < 80; ++i) {
  state = iterate(state)
}
console.log('Number of lanternfish', state.length)
