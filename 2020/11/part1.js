const fs = require('fs')
const { deepStrictEqual } = require('assert')
const DATA = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)

const TEST = [
  [
    'L.LL.LL.LL',
    'LLLLLLL.LL',
    'L.L.L..L..',
    'LLLL.LL.LL',
    'L.LL.LL.LL',
    'L.LLLLL.LL',
    '..L.L.....',
    'LLLLLLLLLL',
    'L.LLLLLL.L',
    'L.LLLLL.LL'
  ],
  [
    '#.##.##.##',
    '#######.##',
    '#.#.#..#..',
    '####.##.##',
    '#.##.##.##',
    '#.#####.##',
    '..#.#.....',
    '##########',
    '#.######.#',
    '#.#####.##'
  ],
  [
    '#.LL.L#.##',
    '#LLLLLL.L#',
    'L.L.L..L..',
    '#LLL.LL.L#',
    '#.LL.LL.LL',
    '#.LLLL#.##',
    '..L.L.....',
    '#LLLLLLLL#',
    '#.LLLLLL.L',
    '#.#LLLL.##'
  ],
  [
    '#.##.L#.##',
    '#L###LL.L#',
    'L.#.#..#..',
    '#L##.##.L#',
    '#.##.LL.LL',
    '#.###L#.##',
    '..#.#.....',
    '#L######L#',
    '#.LL###L.L',
    '#.#L###.##'
  ],
  [
    '#.#L.L#.##',
    '#LLL#LL.L#',
    'L.L.L..#..',
    '#LLL.##.L#',
    '#.LL.LL.LL',
    '#.LL#L#.##',
    '..L.L.....',
    '#L#LLLL#L#',
    '#.LLLLLL.L',
    '#.#L#L#.##'
  ],
  [
    '#.#L.L#.##',
    '#LLL#LL.L#',
    'L.#.L..#..',
    '#L##.##.L#',
    '#.#L.LL.LL',
    '#.#L#L#.##',
    '..L.L.....',
    '#L#L##L#L#',
    '#.LLLLLL.L',
    '#.#L#L#.##'
  ]
]

function isEmptySeat (cell) {
  return cell === 'L'
}

function isOccupiedSeat (cell) {
  return cell === '#'
}

function isSpace (cell) {
  return cell === '.'
}

function mapState (state, fn) {
  const rowCount = state.length
  const colCount = state[0].length
  for (let row = 0; row < rowCount; ++row) {
    for (let col = 0; col < colCount; ++col) {
      fn(state[row][col], row, col)
    }
  }
}

function setState (state, row, col, char) {
  const rowString = state[row]
  let newString = ''
  for (let j = 0; j < rowString.length; ++j) {
    if (j === col) {
      newString += char
    } else {
      newString += rowString[j]
    }
  }
  state.splice(row, 1, newString)
}

// Tests for cells.

mapState(TEST[0], cell => {
  deepStrictEqual(isSpace(cell) || isEmptySeat(cell), true)
  deepStrictEqual(isOccupiedSeat(cell), false)
})
mapState(TEST[1], cell => {
  deepStrictEqual(isOccupiedSeat(cell) || isSpace(cell), true)
  deepStrictEqual(isEmptySeat(cell), false)
})

function stateEqual (lhs, rhs) {
  // Safeguard. Should not happen.
  if (lhs.length !== rhs.length) return false
  for (let row = 0; row < lhs.length; row++) {
    if (lhs[row] !== rhs[row]) return false
  }
  return true
}

// Tests for stateEqual()
TEST.forEach(test => deepStrictEqual(stateEqual(test, test), true))

function getNeighbours (state, row, col) {
  const rowCount = state.length
  const colCount = state[0].length

  const result = []

  // up/north
  if (row > 0) {
    result.push(state[row - 1][col])
  }
  // ne
  if (col < colCount - 1 && row > 0) {
    result.push(state[row - 1][col + 1])
  }
  // right/east
  if (col < colCount - 1) {
    result.push(state[row][col + 1])
  }
  // se
  if (col < colCount - 1 && row < rowCount - 1) {
    result.push(state[row + 1][col + 1])
  }
  // down/south
  if (row < rowCount - 1) {
    result.push(state[row + 1][col])
  }
  // sw
  if (col > 0 && row < rowCount - 1) {
    result.push(state[row + 1][col - 1])
  }
  // left/west
  if (col > 0) {
    result.push(state[row][col - 1])
  }
  // nw
  if (col > 0 && row > 0) {
    result.push(state[row - 1][col - 1])
  }

  return result
}

// Tests for neighbours
deepStrictEqual(getNeighbours(TEST[0], 0, 0), ['.', 'L', 'L'])
deepStrictEqual(getNeighbours(TEST[0], 0, 3), ['.', 'L', 'L', 'L', 'L'])
deepStrictEqual(getNeighbours(TEST[0], 0, 9), ['L', 'L', 'L'])
deepStrictEqual(getNeighbours(TEST[0], 4, 9), ['L', 'L', 'L', 'L', 'L'])
deepStrictEqual(getNeighbours(TEST[0], 9, 9), ['L', 'L', '.'])
deepStrictEqual(getNeighbours(TEST[0], 9, 4), ['L', 'L', 'L', 'L', 'L'])
deepStrictEqual(getNeighbours(TEST[0], 9, 0), ['L', '.', '.'])
deepStrictEqual(getNeighbours(TEST[0], 4, 0), ['L', 'L', '.', '.', 'L'])
deepStrictEqual(getNeighbours(TEST[0], 4, 4), ['.', 'L', 'L', 'L', 'L', 'L', 'L', 'L'])

deepStrictEqual(getNeighbours(TEST[1], 0, 0), ['.', '#', '#'])
deepStrictEqual(getNeighbours(TEST[1], 4, 4), ['.', '#', '#', '#', '#', '#', '#', '#'])

function countOccupied (state) {
  let occupiedCount = 0
  mapState(state, (cell) => {
    if (isOccupiedSeat(cell)) ++occupiedCount
  })
  return occupiedCount
}

deepStrictEqual(countOccupied(TEST[5]), 37)

function getNextState (state) {
  const newState = state.slice()

  mapState(state, (cell, row, col) => {
    const neighbours = getNeighbours(state, row, col)
    if (isEmptySeat(cell)) {
      if (!neighbours.some(isOccupiedSeat)) {
        setState(newState, row, col, '#')
      }
    } else if (isOccupiedSeat(cell)) {
      const occupied = neighbours.filter(isOccupiedSeat)
      if (occupied.length >= 4) {
        setState(newState, row, col, 'L')
      }
    }
  })

  return newState
}

// Tests for getNextState()
for (let test = 0; test < TEST.length - 1; test++) {
  deepStrictEqual(getNextState(TEST[test]), TEST[test + 1])
}

let iterations = 0
let currentState = DATA
let nextState

do {
  nextState = getNextState(currentState)
  if (!stateEqual(nextState, currentState)) {
    iterations++
    currentState = nextState
  } else {
    break
  }
} while (true)

const occupiedCount = countOccupied(nextState)

console.log('Done. Iterated', iterations, 'times')
console.log('Number of occupied seats', occupiedCount)
