const { deepStrictEqual } = require('assert')
const fs = require('fs')
const SQRT = Math.sqrt(3)/2
const EPS = 5e-6

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

const isEven = i => i % 2 === 0

/**
 * Creates a hexagonal grid with size * size rows and
 * columns with all tiles set to white color.
 */
function createGrid (size) {
  const grid = {}
  for (let row = -size/2; row <= size/2-1; ++row) {
    for (let col = -size/2; col <= size/2-1; ++col) {
      const tile = {
        x: col + (isEven(row) ? 0 : 0.5),
        y: row * SQRT,
        color: 'white'
      }
      grid[`${col},${row}`] = tile
    }
  }
  return grid
}

/**
 * Finds all tiles that should be flipped initially
 */
function getInitialFlips (rows) {
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
    tiles.push(tile)
  })

  return tiles
}

function startFlipping (data, size) {
  const grid = createGrid(size)

  function coordinateToKey (tile) {
    return Object.keys(grid).find(key => {
      const value = grid[key]
      return (Math.abs(value.x - tile.x) < EPS &&
              Math.abs(value.y - tile.y) < EPS)
    })
  }

  function flipTile (key) {
    const tile = grid[key]
    if (!tile) {
      throw new Error('could not find tile ' + JSON.stringify(key))
    }
    tile.color = tile.color === 'white' ? 'black' : 'white'
  }

  function countBlacks () {
    return Object.values(grid).reduce((tot, tile) => {
      return tile.color === 'black' ? tot + 1 : tot
    }, 0)
  }

  let flips = getInitialFlips(data)
  flips.forEach(tile => {
    const key = coordinateToKey(tile, grid)
    if (key) {
      flipTile(key, grid)
    } else {
      throw new Error('tile out of bounds?')
    }
  })

  function getNeighborKeys (key) {
    const [col, row] = key.split(',').map(Number)
    if (isEven(row)) {
      return [
        `${col - 1},${row}`,     // w
        `${col + 1},${row}`,     // e
        `${col},${row + 1}`,     // ne
        `${col},${row - 1}`,     // se
        `${col - 1},${row + 1}`, // nw
        `${col - 1},${row - 1}`  // sw
      ]
    } else {
      return [
        `${col - 1},${row}`,     // w
        `${col + 1},${row}`,     // e
        `${col + 1},${row + 1}`, // ne
        `${col + 1},${row - 1}`, // se
        `${col},${row + 1}`,     // nw
        `${col},${row - 1}`      // sw
      ]
    }
  }

  function getTile (key) {
    return grid[key]
  }

  function findNextFlipSet () {
    const flipToWhite = []
    const flipToBlack = []
    Object.keys(grid).forEach(key => {
      const tile = getTile(key)
      const neighborKeys = getNeighborKeys(key)
      const neighbors = neighborKeys.map(getTile).filter(Boolean)
      const numberOfBlackNeighbors = neighbors.filter(tile => tile.color === 'black').length
      if (tile.color === 'black') {
        if (numberOfBlackNeighbors === 0 ||
            numberOfBlackNeighbors > 2) {
          flipToWhite.push(key)
        }
      } else if (tile.color === 'white') {
        if (numberOfBlackNeighbors === 2) {
          flipToBlack.push(key)
        }
      }
    })
    return flipToWhite.concat(flipToBlack)
  }

  for (let days = 1; days <= 100; ++days) {
    flips = findNextFlipSet()
    flips.forEach(key => flipTile(key, grid))
    if (days <= 10 || days % 10 === 0) {
      console.log(`${countBlacks(grid)} black after day ${days}`)
    }
  }

  return countBlacks(grid)
}

console.log(startFlipping(readFile('./data.txt'), 300))

