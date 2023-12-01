const fs = require('fs')
// const assert = require('assert')

function readFile (file) {
  const timers = fs.readFileSync(file, 'utf8').split(',').map(s => s.trim()).map(Number)
  const result = {}
  timers.forEach(timer => {
    if (result[timer] === undefined) {
      result[timer] = 1
    } else {
      result[timer]++
    }
  })
  return result
}

function iterate (state) {
  const countZeros = state['0'] || 0
  // console.log('number of zeros', countZeros)
  const result = {}
  Object.keys(state).map(Number).sort().forEach(key => {
    const value = state[key]
    // console.log('processing key', key, value)
    if (key === 0) {
      result['6'] = value
    } else if (key === 7) {
      result['6'] = result['6'] === undefined ? value : result['6'] + value
    } else if (key > 0) {
      result[key - 1] = value
    }
  })
  if (countZeros > 0) result['8'] = countZeros
  return result
}

/*
function test () {
  // Day 0
  let state = readFile('./test-data.txt')
  // console.log('initial state', state)

  // Day 1
  state = iterate(state)
  assert.deepEqual(state, {
    0: 1,
    1: 1,
    2: 2,
    3: 1
  })

  // Day 2
  state = iterate(state)
  assert.deepEqual(state, {
    0: 1,
    1: 2,
    2: 1,
    6: 1,
    8: 1
  })

  // Day 3
  state = iterate(state)
  assert.deepEqual(state, {
    0: 2,
    1: 1,
    5: 1,
    6: 1,
    7: 1,
    8: 1
  })

  // Day 4
  state = iterate(state)
  assert.deepEqual(state, {
    0: 1,
    4: 1,
    5: 1,
    6: 3,
    7: 1,
    8: 2
  })

  // Day 5
  state = iterate(state)
  assert.deepEqual(state, {
    3: 1,
    4: 1,
    5: 3,
    6: 2,
    7: 2,
    8: 1
  })

  // Day 6
  state = iterate(state)
  assert.deepEqual(state, {
    2: 1,
    3: 1,
    4: 3,
    5: 2,
    6: 2,
    7: 1
  })

  // Day 7
  state = iterate(state)
  assert.deepEqual(state, {
    1: 1,
    2: 1,
    3: 3,
    4: 2,
    5: 2,
    6: 1
  })

  // Day 8
  state = iterate(state)
  assert.deepEqual(state, {
    0: 1,
    1: 1,
    2: 3,
    3: 2,
    4: 2,
    5: 1
  })

  // Day 9
  state = iterate(state)
  assert.deepEqual(state, {
    0: 1,
    1: 3,
    2: 2,
    3: 2,
    4: 1,
    6: 1,
    8: 1
  })

  // Day 10
  state = iterate(state)
  assert.deepEqual(state, {
    0: 3,
    1: 2,
    2: 2,
    3: 1,
    5: 1,
    6: 1,
    7: 1,
    8: 1
  })

  // Day 11
  state = iterate(state)
  assert.deepEqual(state, {
    0: 2,
    1: 2,
    2: 1,
    4: 1,
    5: 1,
    6: 4,
    7: 1,
    8: 3
  })

  // Day 12
  state = iterate(state)
  assert.deepEqual(state, {
    0: 2,
    1: 1,
    3: 1,
    4: 1,
    5: 4,
    6: 3,
    7: 3,
    8: 2
  })

  // Day 13
  state = iterate(state)
  assert.deepEqual(state, {
    0: 1,
    2: 1,
    3: 1,
    4: 4,
    5: 3,
    6: 5,
    7: 2,
    8: 2
  })

  // Day 14
  state = iterate(state)
  assert.deepEqual(state, {
    1: 1,
    2: 1,
    3: 4,
    4: 3,
    5: 5,
    6: 3,
    7: 2,
    8: 1
  })

  // Day 15
  state = iterate(state)
  assert.deepEqual(state, {
    0: 1,
    1: 1,
    2: 4,
    3: 3,
    4: 5,
    5: 3,
    6: 2,
    7: 1
  })

  // Day 16
  state = iterate(state)
  assert.deepEqual(state, {
    0: 1,
    1: 4,
    2: 3,
    3: 5,
    4: 3,
    5: 2,
    6: 2,
    8: 1
  })

  // Day 17
  state = iterate(state)
  assert.deepEqual(state, {
    0: 4,
    1: 3,
    2: 5,
    3: 3,
    4: 2,
    5: 2,
    6: 1,
    7: 1,
    8: 1
  })

  // Day 18
  state = iterate(state)
  // assert.deepEqual(state, [6,0,6,4,5,6,0,1,1,2,6,0,1,1,1,2,2,3,3,4,6,7,8,8,8,8])
  assert.deepEqual(state, {
    0: 3,
    1: 5,
    2: 3,
    3: 2,
    4: 2,
    5: 1,
    6: 5,
    7: 1,
    8: 4
  })
  assert.equal(Object.values(state).reduce((sum, el) => sum + el, 0), 26)

  // Iterate to Day 80
  for (let i = 19; i <= 80; ++i) {
    state = iterate(state)
  }
  assert.equal(Object.values(state).reduce((sum, el) => sum + el, 0), 5934)
}
test()
*/

let state = readFile('./data.txt')
for (let i = 0; i < 256; ++i) {
  state = iterate(state)
}
const count = Object.values(state).reduce((sum, el) => sum + el, 0)
console.log('Number of lanternfish', count)
