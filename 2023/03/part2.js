const fs = require('fs')

const isNumber = (c) => !isNaN(Number(c))
const isDot = (c) => c === '.'
const isSymbol = (c) => !isNumber(c) && !isDot(c)

function adjacentCoords ({ row, col }, maxRow, maxCol) {
  const coords = []

  // upper border
  if (row > 0) {
    for (let j = col.start - 1; j <= col.end + 1; ++j) {
      if (j >= 0 && j <= maxCol) {
        coords.push(`${row - 1},${j}`)
      }
    }
  }

  // lower border
  if (row < maxRow) {
    for (let j = col.start - 1; j <= col.end + 1; ++j) {
      if (j >= 0 && j <= maxCol) {
        coords.push(`${row + 1},${j}`)
      }
    }
  }

  // left
  if (col.start > 0) {
    coords.push(`${row},${col.start - 1}`)
  }

  // right
  if (col.end < maxCol) {
    coords.push(`${row},${col.end + 1}`)
  }

  return coords
}

function parseSchematic (lines) {
  const numbers = []
  const symbols = {}

  const maxRow = lines.length - 1
  const maxCol = lines[0].length - 1

  function parseLine (line, i) {
    let j = 0
    let numberState = null
    do {
      const c = line[j]
      if (isNumber(c)) {
        if (!numberState) {
          numberState = { number: c, row: i, col: { start: j } }
        } else {
          numberState.number += c
        }
        if (j === maxCol) {
          // this catches numbers at the end of a line
          numberState.col.end = j
          numbers.push(numberState)
          numberState = null
        }
      } else {
        if (numberState) {
          numberState.col.end = j - 1
          numbers.push(numberState)
          numberState = null
        }
        if (isSymbol(c)) {
          symbols[`${i},${j}`] = c
        }
      }
      j++
    } while (j <= maxCol)
  }

  lines.forEach(parseLine)

  return { numbers, symbols, maxRow, maxCol }
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)

  const {
    numbers,
    symbols,
    maxRow,
    maxCol
  } = parseSchematic(lines)

  const starCoords = Object.keys(symbols).map(key => {
    return symbols[key] === '*' ? key : null
  }).filter(Boolean)

  const starHits = starCoords.reduce((tot, coord) => {
    return { ...tot, [coord]: [] }
  }, {})

  numbers.map(n => {
    return { ...n, border: adjacentCoords(n, maxRow, maxCol) }
  }).filter(n => {
    for (const coord of n.border) {
      for (const starCoord of starCoords) {
        if (coord === starCoord) {
          starHits[starCoord].push(Number(n.number))
          return true
        }
      }
    }
    return false
  })

  const gearPairs = Object.keys(starHits).map(key => {
    const value = starHits[key]
    return value.length === 2 ? value : null
  }).filter(Boolean)

  return gearPairs.map(arr => arr[0] * arr[1]).reduce((tot, i) => tot + i, 0)
}

const assert = require('assert')
assert.equal(run('./test-data.txt'), 467835)

console.log('result', run('./data.txt'))
