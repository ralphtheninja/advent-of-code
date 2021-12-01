const { deepStrictEqual } = require('assert')
const fs = require('fs')

function readFile (file) {
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(parseRow)
}

function parseRow (row) {
  const result = []
  let i = 0;
  while (i < row.length) {
    const char = row[i]
    if (char === 'e' || char === 'w') {
      result.push(char)
      i++
    } else if (char === 'n' || char === 's') {
      result.push(char + row[i + 1])
      i += 2
    } else {
      throw new Error('should not happen')
    }
  }
  return result
}

deepStrictEqual(
  parseRow('wewnesesweswsenwnwnwsww'),
  ['w', 'e', 'w', 'ne', 'se', 'sw', 'e', 'sw', 'se', 'nw', 'nw', 'nw', 'sw', 'w']
)

function countBlacks (rows) {
  const SQRT = Math.sqrt(3)/2
  const EPS = 5e-6
  const tiles = []

  rows.forEach(row => {
    const tile = { x: 0, y: 0 }
    row.forEach(move => {
      if (move === 'e') {
        tile.x++
      } else if (move === 'w') {
        tile.x--
      } else if (move === 'nw') {
        tile.x -= 1/2
        tile.y += SQRT
      } else if (move === 'ne') {
        tile.x += 1/2
        tile.y += SQRT
      } else if (move === 'sw') {
        tile.x -= 1/2
        tile.y -= SQRT
      } else if (move === 'se') {
        tile.x += 1/2
        tile.y -= SQRT
      } else {
        throw new Error('should not happen')
      }
    })
    const search = tiles.find(t => {
      return (Math.abs(t.x - tile.x) < EPS &&
              Math.abs(t.y - tile.y) < EPS)
    })
    if (search) {
      search.color = search.color === 'black' ? 'white' : 'black'
    } else {
      tile.color = 'black'
      tiles.push(tile)
    }
  })

  return tiles.reduce((tot, tile) => {
    return tile.color === 'black' ? tot + 1 : tot
  }, 0)
}

//const TEST_DATA = readFile('./test-data.txt')
//deepStrictEqual(countBlacks(TEST_DATA), 10)

const DATA = readFile('./data.txt')
console.log('result:', countBlacks(DATA))
