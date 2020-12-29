const { deepStrictEqual } = require('assert')

const INPUT = [
  '######.#',
  '#.###.#.',
  '###.....',
  '#.####..',
  '##.#.###',
  '.######.',
  '###.####',
  '######.#'
]

const TEST_INPUT = [
  '.#.',
  '..#',
  '###'
]

function key (x, y, z) { return `${x},${y},${z}` }

function getNeighbors (x, y, z) {
  return [
    // Nine neighbors is the z layer below
    key(x - 1, y - 1, z - 1),
    key(x, y - 1, z - 1),
    key(x + 1, y - 1, z - 1),
    key(x - 1, y, z - 1),
    key(x, y, z - 1),
    key(x + 1, y, z - 1),
    key(x - 1, y + 1, z - 1),
    key(x, y + 1, z - 1),
    key(x + 1, y + 1, z - 1),

    // Eight neighbors is in the same z layer
    key(x - 1, y - 1, z),
    key(x, y - 1, z),
    key(x + 1, y - 1, z),
    key(x - 1, y, z),
    key(x + 1, y, z),
    key(x - 1, y + 1, z),
    key(x, y + 1, z),
    key(x + 1, y + 1, z),

    // Nine neighbors is the z layer above
    key(x - 1, y - 1, z + 1),
    key(x, y - 1, z + 1),
    key(x + 1, y - 1, z + 1),
    key(x - 1, y, z + 1),
    key(x, y, z + 1),
    key(x + 1, y, z + 1),
    key(x - 1, y + 1, z + 1),
    key(x, y + 1, z + 1),
    key(x + 1, y + 1, z + 1),
  ]
}

//deepStrictEqual(getNeighbors(0, 0, 0).length, 26)

function simulate (state0, maxCycles) {
  let state = new Set()
  const SIZE = 20

  state0.forEach((row, i) => {
    for (let j = 0; j < row.length; ++j) {
      if (row[j] === '#') {
        state.add(key(i, j, 0))
      }
    }
  })

  function nextState (prev) {
    let next = new Set()

    for (let x = -SIZE; x < SIZE; ++x) {
      for (let y = -SIZE; y < SIZE; ++y) {
        for (let z = -SIZE; z < SIZE; ++z) {
          const cellKey = key(x, y, z)
          const activeNeighbors = getNeighbors(x, y, z).filter(n => prev.has(n))
          if (prev.has(cellKey)) {
            // (x, y, z) is active
            if (activeNeighbors.length === 2 || activeNeighbors.length === 3) {
              next.add(cellKey)
            }
          } else {
            // (x, y, z) is inactive
            if (activeNeighbors.length === 3) {
              next.add(cellKey)
            }
          }
        }
      }
    }

    return next
  }

  for (let cycles = 0; cycles < maxCycles; ++cycles) {
    state = nextState(state)
  }

  return state.size
}

//deepStrictEqual(simulate(TEST_INPUT, 6), 112)
console.log(simulate(INPUT, 6))
