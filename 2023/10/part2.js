const fs = require('fs')
const assert = require('assert')

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
   *
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

    return visited
  }

  grid[start[1]][start[0]] = SPIPE

  const loop = self.findLoop()
  loop.sort((l, r) => {
    if (l[0] < r[0]) return -1
    else if (l[0] > r[0]) return 1
    else {
      if (l[1] < r[1]) return -1
      else if (l[1] > r[1]) return 1
      else return 0
    }
  })
  self.loop = loop

  self.pipeInLoop = (x, y) => {
    return self.loop.find(p => p[0] === x && p[1] === y)
  }

  const noLoopTiles = []
  for (let y = 0; y < grid.length; ++y) {
    for (let x = 0; x < grid[y].length; ++x) {
      const cell = self.getCell([x, y])
      if (cell === '.' || !self.pipeInLoop(x, y)) {
        noLoopTiles.push([x, y])
      }
    }
  }
  self.noLoopTiles = noLoopTiles

  return self
}

/**
 * We can quickly remove all dot rooms on the border. Impossible for them
 * to be inside the loop.
 */
function dotOnBorder (self, x, y) {
  if (x === 0) {
    return true
  } else if (x === self.noCols - 1) {
    return true
  } else if (y === 0) {
    return true
  } else if (y === self.noRows - 1) {
    return true
  } else {
    return false
  }
}

function getEndPassNS (cell) {
  if (cell === TILES.NE) {
    return TILES.SW
  } else if (cell === TILES.SW) {
    return TILES.NE
  } else if (cell === TILES.SE) {
    return TILES.NW
  } else if (cell === TILES.NW) {
    return TILES.SE
  } else {
    throw new Error('getEndPassNS NYI for cell ' + cell)
  }
}

function getEndNoPassNS (cell) {
  if (cell === TILES.NE) {
    return TILES.SE
  } else if (cell === TILES.SW) {
    return TILES.NW
  } else if (cell === TILES.SE) {
    return TILES.NE
  } else if (cell === TILES.NW) {
    return TILES.SW
  } else {
    throw new Error('getEndNoPassNS NYI for cell ' + cell)
  }
}

function getEndPassWE (cell) {
  if (cell === TILES.NW) {
    return TILES.SE
  } else if (cell === TILES.SE) {
    return TILES.NW
  } else if (cell === TILES.NE) {
    return TILES.SW
  } else if (cell === TILES.SW) {
    return TILES.NE
  } else {
    throw new Error('getEndPassWE NYI for cell ' + cell)
  }
}

function getEndNoPassWE (cell) {
  if (cell === TILES.NW) {
    return TILES.NE
  } else if (cell === TILES.SE) {
    return TILES.SW
  } else if (cell === TILES.NE) {
    return TILES.NW
  } else if (cell === TILES.SW) {
    return TILES.SE
  } else {
    throw new Error('getEndNoPassWE NYI for cell ' + cell)
  }
}

/**
 * Checks whether a dot coordinate is enclosed or not
 */
function isEnclosed (self, x, y) {
  if (dotOnBorder(self, x, y)) {
    return false
  }

  let nPassed = 0
  let n = y - 1
  while (n >= 0) {
    const cell = self.getCell([x, n])
    if (cell === '.' || !self.pipeInLoop(x, n)) {
      n--
      continue
    }
    if (cell === TILES.WE) {
      nPassed++
      n--
    } else {
      const start = cell
      assert(start === TILES.NE || start === TILES.NW)
      const endPass = getEndPassNS(start)
      const endNoPass = getEndNoPassNS(start)
      n--

      do {
        const next = self.getCell([x, n])
        n--
        if (next === endPass) {
          nPassed++
          break
        } else if (next === endNoPass) {
          break
        } else {
          assert(next === TILES.NS)
        }
      } while (n >= 0)
    }
  }

  let sPassed = 0
  let s = y + 1
  while (s <= self.noRows - 1) {
    const cell = self.getCell([x, s])
    if (cell === '.' || !self.pipeInLoop(x, s)) {
      s++
      continue
    }
    if (cell === TILES.WE) {
      sPassed++
      s++
    } else {
      const start = cell
      assert(start === TILES.SE || start === TILES.SW)
      const endPass = getEndPassNS(start)
      const endNoPass = getEndNoPassNS(start)
      s++

      do {
        const next = self.getCell([x, s])
        s++
        if (next === endPass) {
          sPassed++
          break
        } else if (next === endNoPass) {
          break
        } else {
          assert(next === TILES.NS)
        }
      } while (s <= self.noRows - 1)
    }
  }

  let wPassed = 0
  let w = x - 1
  while (w >= 0) {
    const cell = self.getCell([w, y])
    if (cell === '.' || !self.pipeInLoop(w, y)) {
      w--
      continue
    }
    if (cell === TILES.NS) {
      wPassed++
      w--
    } else {
      const start = cell
      assert(start === TILES.NW || start === TILES.SW)
      const endPass = getEndPassWE(start)
      const endNoPass = getEndNoPassWE(start)
      w--

      do {
        const next = self.getCell([w, y])
        w--
        if (next === endPass) {
          wPassed++
          break
        } else if (next === endNoPass) {
          break
        } else {
          assert(next === TILES.WE)
        }
      } while (w >= 0)
    }
  }

  let ePassed = 0
  let e = x + 1
  while (e <= self.noCols - 1) {
    const cell = self.getCell([e, y])
    if (cell === '.' || !self.pipeInLoop(e, y)) {
      e++
      continue
    }
    if (cell === TILES.NS) {
      ePassed++
      e++
    } else {
      const start = cell
      assert(start === TILES.SE || start === TILES.NE)
      const endPass = getEndPassWE(start)
      const endNoPass = getEndNoPassWE(start)
      e++

      do {
        const next = self.getCell([e, y])
        e++
        if (next === endPass) {
          ePassed++
          break
        } else if (next === endNoPass) {
          break
        } else {
          assert(next === TILES.WE)
        }
      } while (e <= self.noCols - 1)
    }
  }

  return nPassed % 2 && sPassed % 2 && ePassed % 2 && wPassed % 2
}

// const self = parse('./input.test2')
// const self = parse('./input.test3')
const self = parse('./input')
let totalEnclosed = 0

for (const [x, y] of self.noLoopTiles) {
  if (isEnclosed(self, x, y)) {
    totalEnclosed++
  }
}

console.log('total dots enclosed', totalEnclosed)
