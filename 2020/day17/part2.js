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

function key (x, y, z, w) { return `${x},${y},${z},${w}` }

/**
 * Number of cubes including (x, y, z, w) are 3*3*3*3 - 1 = 80
 */
function getNeighbors (x, y, z, w) {
  return [
    key(x - 1, y - 1, z - 1, w - 1),
    key(x, y - 1, z - 1, w - 1),
    key(x + 1, y - 1, z - 1, w - 1),

    key(x - 1, y, z - 1, w - 1),
    key(x, y, z - 1, w - 1),
    key(x + 1, y, z - 1, w - 1),

    key(x - 1, y + 1, z - 1, w - 1),
    key(x, y + 1, z - 1, w - 1),
    key(x + 1, y + 1, z - 1, w - 1),


    key(x - 1, y - 1, z, w - 1),
    key(x, y - 1, z, w - 1),
    key(x + 1, y - 1, z, w - 1),

    key(x - 1, y, z, w - 1),
    key(x, y, z, w - 1),
    key(x + 1, y, z, w - 1),

    key(x - 1, y + 1, z, w - 1),
    key(x, y + 1, z, w - 1),
    key(x + 1, y + 1, z, w - 1),


    key(x - 1, y - 1, z + 1, w - 1),
    key(x, y - 1, z + 1, w - 1),
    key(x + 1, y - 1, z + 1, w - 1),

    key(x - 1, y, z + 1, w - 1),
    key(x, y, z + 1, w - 1),
    key(x + 1, y, z + 1, w - 1),

    key(x - 1, y + 1, z + 1, w - 1),
    key(x, y + 1, z + 1, w - 1),
    key(x + 1, y + 1, z + 1, w - 1),





    key(x - 1, y - 1, z - 1, w),
    key(x, y - 1, z - 1, w),
    key(x + 1, y - 1, z - 1, w),

    key(x - 1, y, z - 1, w),
    key(x, y, z - 1, w),
    key(x + 1, y, z - 1, w),

    key(x - 1, y + 1, z - 1, w),
    key(x, y + 1, z - 1, w),
    key(x + 1, y + 1, z - 1, w),


    key(x - 1, y - 1, z, w),
    key(x, y - 1, z, w),
    key(x + 1, y - 1, z, w),

    key(x - 1, y, z, w),
    // key(x, y, z, w),
    key(x + 1, y, z, w),

    key(x - 1, y + 1, z, w),
    key(x, y + 1, z, w),
    key(x + 1, y + 1, z, w),


    key(x - 1, y - 1, z + 1, w),
    key(x, y - 1, z + 1, w),
    key(x + 1, y - 1, z + 1, w),

    key(x - 1, y, z + 1, w),
    key(x, y, z + 1, w),
    key(x + 1, y, z + 1, w),

    key(x - 1, y + 1, z + 1, w),
    key(x, y + 1, z + 1, w),
    key(x + 1, y + 1, z + 1, w),





    key(x - 1, y - 1, z - 1, w + 1),
    key(x, y - 1, z - 1, w + 1),
    key(x + 1, y - 1, z - 1, w + 1),

    key(x - 1, y, z - 1, w + 1),
    key(x, y, z - 1, w + 1),
    key(x + 1, y, z - 1, w + 1),

    key(x - 1, y + 1, z - 1, w + 1),
    key(x, y + 1, z - 1, w + 1),
    key(x + 1, y + 1, z - 1, w + 1),


    key(x - 1, y - 1, z, w + 1),
    key(x, y - 1, z, w + 1),
    key(x + 1, y - 1, z, w + 1),

    key(x - 1, y, z, w + 1),
    key(x, y, z, w + 1),
    key(x + 1, y, z, w + 1),

    key(x - 1, y + 1, z, w + 1),
    key(x, y + 1, z, w + 1),
    key(x + 1, y + 1, z, w + 1),


    key(x - 1, y - 1, z + 1, w + 1),
    key(x, y - 1, z + 1, w + 1),
    key(x + 1, y - 1, z + 1, w + 1),

    key(x - 1, y, z + 1, w + 1),
    key(x, y, z + 1, w + 1),
    key(x + 1, y, z + 1, w + 1),

    key(x - 1, y + 1, z + 1, w + 1),
    key(x, y + 1, z + 1, w + 1),
    key(x + 1, y + 1, z + 1, w + 1),
  ]
}

deepStrictEqual(getNeighbors(0, 0, 0, 0).length, 80)

function simulate (state0, maxCycles) {
  let state = new Set()
  const SIZE = 20

  state0.forEach((row, i) => {
    for (let j = 0; j < row.length; ++j) {
      if (row[j] === '#') {
        state.add(key(i, j, 0, 0))
      }
    }
  })

  function nextState (prev) {
    let next = new Set()

    for (let x = -SIZE; x < SIZE; ++x) {
      for (let y = -SIZE; y < SIZE; ++y) {
        for (let z = -SIZE; z < SIZE; ++z) {
          for (let w = -SIZE; w < SIZE; ++w) {
            const cellKey = key(x, y, z, w)
            const activeNeighbors = getNeighbors(x, y, z, w).filter(n => prev.has(n))
            if (prev.has(cellKey)) {
              // (x, y, z, w) is active
              if (activeNeighbors.length === 2 || activeNeighbors.length === 3) {
                next.add(cellKey)
              }
            } else {
              // (x, y, z, w) is inactive
              if (activeNeighbors.length === 3) {
                next.add(cellKey)
              }
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

//deepStrictEqual(simulate(TEST_INPUT, 6), 848)
console.time()
console.log(simulate(INPUT, 6))
console.timeEnd()
