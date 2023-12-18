const fs = require('fs')

const TILES = {
  NS: '|',
  WE: '-',
  NE: 'L',
  NW: 'J',
  SW: '7',
  SE: 'F',
  GROUND: '.'
}

const CONNECTS_NORTH = [TILES.NS, TILES.NW, TILES.NE]
const CONNECTS_SOUTH = [TILES.NS, TILES.SW, TILES.SE]
const CONNECTS_WEST = [TILES.WE, TILES.NW, TILES.SW]
const CONNECTS_EAST = [TILES.WE, TILES.NE, TILES.SE]

const hasPipe = tile => tile !== TILES.GROUND

function parse (file) {
  const data = fs.readFileSync(file, 'utf8').split('\n')

  let start = null
  const grid = data.map((line, y) => {
    const row = []
    for (let x = 0; x < line.length; ++x) {
      const tile = line[x]
      if (!start && tile === 'S') {
        start = [x, y]
      }
      row.push(tile)
    }
    return row
  })

  const noRows = data.length
  const noCols = data[0].length

  const self = {
    grid,
    start,
    noRows,
    noCols
  }

  self.getNeighbors = ([x, y]) => {
    const result = []
    if (x > 0) result.push({ w: [x - 1, y] })
    if (x < noCols - 1) result.push({ e: [x + 1, y] })
    if (y > 0) result.push({ n: [x, y - 1] })
    if (y < noRows - 1) result.push({ s: [x, y + 1] })
    return result
  }

  self.getCell = ([x, y]) => {
    return grid[y][x]
  }

  const sNeighbors = self.getNeighbors(start)
  const n = sNeighbors.find(i => Array.isArray(i.n))?.n
  const nCell = n && self.getCell(n)
  const s = sNeighbors.find(i => Array.isArray(i.s))?.s
  const sCell = s && self.getCell(s)
  const e = sNeighbors.find(i => Array.isArray(i.e))?.e
  const eCell = e && self.getCell(e)
  const w = sNeighbors.find(i => Array.isArray(i.w))?.w
  const wCell = w && self.getCell(w)

  let SPIPE = ''
  if (n && CONNECTS_SOUTH.includes(nCell) &&
      s && CONNECTS_NORTH.includes(sCell)) {
    SPIPE = TILES.NS
  } else if (w && CONNECTS_EAST.includes(wCell) &&
             e && CONNECTS_WEST.includes(eCell)) {
    SPIPE = TILES.WE
  } else if (n && CONNECTS_SOUTH.includes(nCell) &&
             e && CONNECTS_WEST.includes(eCell)) {
    SPIPE = TILES.NE
  } else if (n && CONNECTS_SOUTH.includes(nCell) &&
             w && CONNECTS_EAST.includes(wCell)) {
    SPIPE = TILES.NW
  } else if (s && CONNECTS_NORTH.includes(sCell) &&
             w && CONNECTS_EAST.includes(wCell)) {
    SPIPE = TILES.SW
  } else if (s && CONNECTS_NORTH.includes(sCell) &&
             e && CONNECTS_WEST.includes(eCell)) {
    SPIPE = TILES.SE
  } else {
    throw new Error('should not happen')
  }

  /**
   * Recurstion is not an option with the real map. Must iterate.
   */
  self.findLoop = () => {
    const visited = []
    const toVisit = [self.start]

    do {
      const node = toVisit.shift()
      if (!visited.find(el => el[0] === node[0] && el[1] === node[1])) {
        visited.push(node)
        const cell = self.getCell(node)
        const neighbors = self.getNeighbors(node)
        let first, second
        switch (cell) {
          case TILES.NS:
            first = neighbors.find(i => Array.isArray(i.n))?.n
            second = neighbors.find(i => Array.isArray(i.s))?.s
            break
          case TILES.WE:
            first = neighbors.find(i => Array.isArray(i.w))?.w
            second = neighbors.find(i => Array.isArray(i.e))?.e
            break
          case TILES.NE:
            first = neighbors.find(i => Array.isArray(i.n))?.n
            second = neighbors.find(i => Array.isArray(i.e))?.e
            break
          case TILES.NW:
            first = neighbors.find(i => Array.isArray(i.n))?.n
            second = neighbors.find(i => Array.isArray(i.w))?.w
            break
          case TILES.SW:
            first = neighbors.find(i => Array.isArray(i.s))?.s
            second = neighbors.find(i => Array.isArray(i.w))?.w
            break
          case TILES.SE:
            first = neighbors.find(i => Array.isArray(i.s))?.s
            second = neighbors.find(i => Array.isArray(i.e))?.e
            break
        }
        if (first && second) {
          toVisit.push(first)
          toVisit.push(second)
        } else {
          throw new Error('should not happen, must have two paths from the cell')
        }
      }
    } while (toVisit.length > 0)

    return visited.length / 2
  }

  grid[start[1]][start[0]] = SPIPE

  return self
}

const assert = require('assert')

assert.equal(hasPipe(TILES.NS), true)
assert.equal(hasPipe(TILES.WE), true)
assert.equal(hasPipe(TILES.NE), true)
assert.equal(hasPipe(TILES.NW), true)
assert.equal(hasPipe(TILES.SW), true)
assert.equal(hasPipe(TILES.SE), true)
assert.equal(hasPipe('S'), true)

// const self = parse('./input.test')
const self = parse('./input')

assert.equal(self.getNeighbors([0, 0]).length, 2)
assert.equal(self.getNeighbors([0, self.noRows - 1]).length, 2)
assert.equal(self.getNeighbors([self.noCols - 1, 0]).length, 2)
assert.equal(self.getNeighbors([self.noCols - 1, self.noRows - 1]).length, 2)
assert.equal(self.getNeighbors([1, 0]).length, 3)
assert.equal(self.getNeighbors([0, 1]).length, 3)
assert.equal(self.getNeighbors([1, self.noRows - 1]).length, 3)
assert.equal(self.getNeighbors([Math.floor(self.noCols / 2), Math.floor(self.noRows / 2)]).length, 4)

console.log('distance', self.findLoop())
