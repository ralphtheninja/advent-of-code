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
    '#.LL.LL.L#',
    '#LLLLLL.LL',
    'L.L.L..L..',
    'LLLL.LL.LL',
    'L.LL.LL.LL',
    'L.LLLLL.LL',
    '..L.L.....',
    'LLLLLLLLL#',
    '#.LLLLLL.L',
    '#.LLLLL.L#'
  ],
  [
    '#.L#.##.L#',
    '#L#####.LL',
    'L.#.#..#..',
    '##L#.##.##',
    '#.##.#L.##',
    '#.#####.#L',
    '..#.#.....',
    'LLL####LL#',
    '#.L#####.L',
    '#.L####.L#'
  ],
  [
    '#.L#.L#.L#',
    '#LLLLLL.LL',
    'L.L.L..#..',
    '##LL.LL.L#',
    'L.LL.LL.L#',
    '#.LLLLL.LL',
    '..L.L.....',
    'LLLLLLLLL#',
    '#.LLLLL#.L',
    '#.L#LL#.L#'
  ],
  [
    '#.L#.L#.L#',
    '#LLLLLL.LL',
    'L.L.L..#..',
    '##L#.#L.L#',
    'L.L#.#L.L#',
    '#.L####.LL',
    '..#.#.....',
    'LLL###LLL#',
    '#.LLLLL#.L',
    '#.L#LL#.L#'
  ],
  [
    '#.L#.L#.L#',
    '#LLLLLL.LL',
    'L.L.L..#..',
    '##L#.#L.L#',
    'L.L#.LL.L#',
    '#.LLLL#.LL',
    '..#.L.....',
    'LLL###LLL#',
    '#.LLLLL#.L',
    '#.L#LL#.L#'
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

function getVisibleSeats (state, row, col) {
  const rowCount = state.length
  const colCount = state[0].length

  const seats = []

  // n
  {
    for (let d = 1; row - d >= 0; ++d) {
      if (isSpace(state[row - d][col])) {
        continue
      } else {
        seats.push(state[row - d][col])
        break
      }
    }
  }

  // ne
  {
    for (let d = 1; row - d >= 0 && col + d < colCount; ++d) {
      if (isSpace(state[row - d][col + d])) {
        continue
      } else {
        seats.push(state[row - d][col + d])
        break
      }
    }
  }

  // e
  {
    for (let d = 1; col + d < colCount; ++d) {
      if (isSpace(state[row][col + d])) {
        continue
      } else {
        seats.push(state[row][col + d])
        break
      }
    }
  }

  // se
  {
    for (let d = 1; row + d < rowCount && col + d < colCount; ++d) {
      if (isSpace(state[row + d][col + d])) {
        continue
      } else {
        seats.push(state[row + d][col + d])
        break
      }
    }
  }

  // s
  {
    for (let d = 1; row + d < rowCount; ++d) {
      if (isSpace(state[row + d][col])) {
        continue
      } else {
        seats.push(state[row + d][col])
        break
      }
    }
  }

  // sw
  {
    for (let d = 1; row + d < rowCount && col - d >= 0; ++d) {
      if (isSpace(state[row + d][col - d])) {
        continue
      } else {
        seats.push(state[row + d][col - d])
        break
      }
    }
  }

  // w
  {
    for (let d = 1; col - d >= 0; ++d) {
      if (isSpace(state[row][col - d])) {
        continue
      } else {
        seats.push(state[row][col - d])
        break
      }
    }
  }

  // nw
  {
    for (let d = 1; row - d >= 0 && col - d >= 0; ++d) {
      if (isSpace(state[row - d][col - d])) {
        continue
      } else {
        seats.push(state[row - d][col - d])
        break
      }
    }
  }

  return seats
}

// Tests for neighbours
deepStrictEqual(getVisibleSeats(TEST[0], 0, 0), ['L','L','L'])
deepStrictEqual(getVisibleSeats(TEST[0], 5, 6), ['L','L','L','L','L','L','L','L'])
deepStrictEqual(getVisibleSeats(TEST[0], 0, 3), ['L', 'L','L','L','L'])
deepStrictEqual(getVisibleSeats(TEST[0], 0, 9), ['L','L','L'])
deepStrictEqual(getVisibleSeats(TEST[0], 4, 3), ['L','L','L','L','L','L','L','L'])
deepStrictEqual(getVisibleSeats(TEST[0], 9, 9), ['L','L','L'])
deepStrictEqual(getVisibleSeats(TEST[0], 9, 4), ['L','L','L','L','L'])
deepStrictEqual(getVisibleSeats(TEST[0], 9, 0), ['L','L','L'])
deepStrictEqual(getVisibleSeats(TEST[0], 4, 0), ['L','L','L','L','L'])

deepStrictEqual(getVisibleSeats(TEST[1], 0, 0), ['#','#','#'])
deepStrictEqual(getVisibleSeats(TEST[1], 4, 3), ['#','#','#','#','#','#','#','#'])

deepStrictEqual(getVisibleSeats(TEST[6], 4, 3), ['#','L','L','L','L','L','L','L'])

function countOccupied (state) {
  let occupiedCount = 0
  mapState(state, (cell) => {
    if (isOccupiedSeat(cell)) ++occupiedCount
  })
  return occupiedCount
}

deepStrictEqual(countOccupied(TEST[6]), 26)

function getNextState (state) {
  const newState = state.slice()

  mapState(state, (cell, row, col) => {
    const visibleSeats = getVisibleSeats(state, row, col)
    if (isEmptySeat(cell)) {
      if (!visibleSeats.some(isOccupiedSeat)) {
        setState(newState, row, col, '#')
      }
    } else if (isOccupiedSeat(cell)) {
      const occupied = visibleSeats.filter(isOccupiedSeat)
      if (occupied.length >= 5) {
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
