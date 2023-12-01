const { deepStrictEqual } = require('assert')
const fs = require('fs')

function readFile (fileName) {
  return fs.readFileSync(fileName, 'utf8').split('\n\n').filter(Boolean).map(text => {
    const temp = text.split(':')
    const id = Number(temp[0].split(' ')[1])
    const tile = temp[1].split('\n').filter(Boolean)
    return { id, tile }
  })
}

const DATA = readFile('./data1.txt')
// const TEST_DATA = readFile('./test-data.txt')

function rot90 (cell) {
  const rotated = []
  for (let i = 0; i < cell.length; ++i) {
    let str = ''
    for (let j = cell.length - 1; j >= 0; --j) {
      str += cell[j][i]
    }
    rotated.push(str)
  }
  return rotated
}

function rot180 (cell) {
  const result = []
  for (let i = cell.length - 1; i >= 0; --i) {
    let str = ''
    for (let j = cell[i].length - 1; j >= 0; --j) {
      str += cell[i][j]
    }
    result.push(str)
  }
  return result
}

function rot270 (cell) {
  const result = []
  for (let j = cell.length - 1; j >= 0; --j) {
    let str = ''
    for (let i = 0; i < cell[j].length; ++i) {
      str += cell[i][j]
    }
    result.push(str)
  }
  return result
}

function flip (cell) {
  const result = []
  for (let i = 0; i < cell.length; ++i) {
    let str = ''
    for (let j = cell[i].length - 1; j >= 0; --j) {
      str += cell[i][j]
    }
    result.push(str)
  }
  return result
}

function borderUp (cell) {
  return cell[0]
}

function borderDown (cell) {
  return cell[cell.length - 1]
}

function borderLeft (cell) {
  let str = ''
  for (let i = 0; i < cell.length; ++i) {
    str += cell[i][0]
  }
  return str
}

function borderRight (cell) {
  let str = ''
  const rowLength = cell[0].length
  for (let i = 0; i < cell.length; ++i) {
    str += cell[i][rowLength - 1]
  }
  return str
}

function fitsRight (from, to) {
  return borderRight(from) === borderLeft(to)
}

function fitsDown (from, to) {
  return borderDown(from) === borderUp(to)
}

function fitsLeft (from, to) {
  return borderLeft(from) === borderRight(to)
}

function fitsUp (from, to) {
  return borderUp(from) === borderDown(to)
}

const PERMUTATIONS = [
  (A) => A,
  (A) => rot90(A),
  (A) => rot180(A),
  (A) => rot270(A),
  (A) => flip(A),
  (A) => rot90(flip(A)),
  (A) => rot180(flip(A)),
  (A) => rot270(flip(A))
]

const TEST_TILES = [
  [
    '.#..#####.',
    '..###.##.#',
    '##.##.#..#',
    '....#.#...',
    '#..##.###.',
    '##.#.##.#.',
    '..#.#...##',
    '.#####..##',
    '..####....',
    '#..#..#.##'
  ],
  [
    '......#..#',
    '#....#....',
    '##.#..#..#',
    '.##.##....',
    '..####..##',
    '.##.#.##..',
    '#.###...##',
    '#..#.#.##.',
    '.#####..#.',
    '####....#.'
  ],
  [
    '#.#.##...#',
    '.###.#....',
    '###.#.#...',
    '.#..#..##.',
    '#.####.##.',
    '.##.######',
    '#.##.##...',
    '.##..#.#.#',
    '....###...',
    '...#..###.'
  ]
]
const TEST_TILES_NO_BORDER = [
  [
    '.###.##.',
    '#.##.#..',
    '...#.#..',
    '..##.###',
    '#.#.##.#',
    '.#.#...#',
    '#####..#',
    '.####...'
  ],
  [
    '....#...',
    '#.#..#..',
    '##.##...',
    '.####..#',
    '##.#.##.',
    '.###...#',
    '..#.#.##',
    '#####..#'
  ],
  [
    '###.#...',
    '##.#.#..',
    '#..#..##',
    '.####.##',
    '##.#####',
    '.##.##..',
    '##..#.#.',
    '...###..'
  ]
]

const JOINED_TEST_TILES = [
  '.###.##.....#...###.#...',
  '#.##.#..#.#..#..##.#.#..',
  '...#.#..##.##...#..#..##',
  '..##.###.####..#.####.##',
  '#.#.##.###.#.##.##.#####',
  '.#.#...#.###...#.##.##..',
  '#####..#..#.#.####..#.#.',
  '.####...#####..#...###..'
]

function removeTileBorders (tile) {
  return tile.slice(1, tile.length - 1).map(row => {
    return row.substr(1, row.length - 2)
  })
}

TEST_TILES.forEach((tile, i) => {
  deepStrictEqual(removeTileBorders(tile), TEST_TILES_NO_BORDER[i])
})

function joinRowOfTiles (row) {
  const result = []
  const tileHeight = row[0].length
  for (let i = 0; i < tileHeight; ++i) {
    result.push(
      row.map(tile => {
        return tile[i]
      }).reduce((tot, str) => {
        return tot + str
      }, '')
    )
  }
  return result
}

deepStrictEqual(joinRowOfTiles(TEST_TILES_NO_BORDER), JOINED_TEST_TILES)

const TEST_MAJOR_ROWS = [
  [
    '#..###....##.#...##.##.#',
    '#...#.....#..##...###.##',
    '#....##..#.#########..##',
    '#.#####..#.#...##..#....',
    '#.#..##.########..#..##.',
    '..##.#..#..#.#######.###',
    '.###.###.#######..#####.',
    '#.###...#.##...#.######.'
  ],
  [
    '#.###.#..####...##..#...',
    '.#.##...#.##.#.#.###...#',
    '#...#...###..####....##.',
    '..##.##.###.....#.##..#.',
    '....#.##.#.#####....#...',
    '..#.##...###..#.#####..#',
    '##...#..#....#..#...####',
    '#.####.#.#....##.#..#.#.'
  ],
  [
    '.###.##.....#...###.#...',
    '#.##.#..#.#..#..##.#.#..',
    '...#.#..##.##...#..#..##',
    '..##.###.####..#.####.##',
    '#.#.##.###.#.##.##.#####',
    '.#.#...#.###...#.##.##..',
    '#####..#..#.#.####..#.#.',
    '.####...#####..#...###..'
  ]
]
const TEST_JOINED_MAJOR_ROWS = [
  '#..###....##.#...##.##.#',
  '#...#.....#..##...###.##',
  '#....##..#.#########..##',
  '#.#####..#.#...##..#....',
  '#.#..##.########..#..##.',
  '..##.#..#..#.#######.###',
  '.###.###.#######..#####.',
  '#.###...#.##...#.######.',
  '#.###.#..####...##..#...',
  '.#.##...#.##.#.#.###...#',
  '#...#...###..####....##.',
  '..##.##.###.....#.##..#.',
  '....#.##.#.#####....#...',
  '..#.##...###..#.#####..#',
  '##...#..#....#..#...####',
  '#.####.#.#....##.#..#.#.',
  '.###.##.....#...###.#...',
  '#.##.#..#.#..#..##.#.#..',
  '...#.#..##.##...#..#..##',
  '..##.###.####..#.####.##',
  '#.#.##.###.#.##.##.#####',
  '.#.#...#.###...#.##.##..',
  '#####..#..#.#.####..#.#.',
  '.####...#####..#...###..'
]

function joinMajorRows (rows) {
  return rows.reduce((tot, row) => {
    return tot.concat(row)
  }, [])
}

deepStrictEqual(
  joinMajorRows(
    TEST_MAJOR_ROWS
  ),
  TEST_JOINED_MAJOR_ROWS
)

function findSolution (data) {
  const meta = {}

  data.forEach(d => {
    meta[d.id] = {
      right: [],
      down: [],
      tile: d.tile
    }
  })

  for (let i = 0; i < data.length - 1; ++i) {
    for (let j = i + 1; j < data.length; ++j) {
      const from = data[i]
      const to = data[j]
      for (let fromIndex = 0; fromIndex < PERMUTATIONS.length; ++fromIndex) {
        for (let toIndex = 0; toIndex < PERMUTATIONS.length; ++toIndex) {
          const fromPerm = PERMUTATIONS[fromIndex](from.tile)
          const toPerm = PERMUTATIONS[toIndex](to.tile)
          if (fitsRight(fromPerm, toPerm)) {
            meta[from.id].right.push({
              from: { id: from.id, perm: fromIndex },
              to: { id: to.id, perm: toIndex }
            })
          } else if (fitsDown(fromPerm, toPerm)) {
            meta[from.id].down.push({
              from: { id: from.id, perm: fromIndex },
              to: { id: to.id, perm: toIndex }
            })
          } else if (fitsLeft(fromPerm, toPerm)) {
            meta[to.id].right.push({
              from: { id: to.id, perm: toIndex },
              to: { id: from.id, perm: fromIndex }
            })
          } else if (fitsUp(fromPerm, toPerm)) {
            meta[to.id].down.push({
              from: { id: to.id, perm: toIndex },
              to: { id: from.id, perm: fromIndex }
            })
          }
        }
      }
    }
  }

  const SIZE = Math.sqrt(data.length)

  function splitLinkArray (links) {
    const result = [links[0].from]
    links.forEach(link => result.push(link.to))
    return result
  }

  function findRows (id) {
    const m = meta[id]
    const result = []

    m.right.forEach(link => {
      const res = [link]
      let next = link.to
      while (res.length < SIZE) {
        const nextMeta = meta[next.id]
        const nextLink = nextMeta.right.find(l => {
          return l.from.id === next.id && l.from.perm === next.perm
        })
        if (nextLink) {
          if (!res.find(i => {
            return (nextLink.to.id === i.from.id ||
                    nextLink.from.id === i.from.id)
          })) {
            res.push(nextLink)
            next = nextLink.to
          } else {
            break
          }
        } else {
          break
        }
      }
      result.push(splitLinkArray(res))
    })

    return result
  }

  /**
   * Go through the metata and collect candidates for possible
   * rows with length = SIZE
   */
  function findRowCandidates () {
    let result = []
    data.forEach(d => { result = result.concat(findRows(d.id, SIZE)) })
    return result
  }

  const rowCandidates = findRowCandidates().filter(r => r.length === SIZE)

  /**
   *
   */
  function rowFits (fromRow, toRow) {
    if (fromRow.length !== toRow.length) return false
    for (let i = 0; i < fromRow.length; ++i) {
      const from = fromRow[i]
      const to = toRow[i]
      if (from.id === to.id) {
        return false
      }
      const fromMeta = meta[from.id]
      const find = fromMeta.down.find(link => {
        return (link.from.id === from.id &&
                link.from.perm === from.perm &&
                link.to.id === to.id &&
                link.to.perm === to.perm)
      })
      if (!find) {
        return false
      }
    }
    return true
  }

  /**
   * Match all row candidates against each other (from -> to with to row under from)
   */
  const rowPairs = []
  for (let i = 0; i < rowCandidates.length; ++i) {
    for (let j = 0; j < rowCandidates.length; ++j) {
      if (i === j) continue
      if (rowFits(rowCandidates[i], rowCandidates[j])) {
        rowPairs.push([i, j])
      }
    }
  }

  const allImageVersions = []

  // Time to find SIZE - 1 row pairs that fit together
  for (let i = 0; i < rowPairs.length; ++i) {
    let currentPair = rowPairs[i]
    const allRows = [currentPair]
    while (allRows.length < SIZE - 1) {
      const next = currentPair[1]
      const search = rowPairs.find(p => {
        return p[0] === next
      })
      if (search) {
        allRows.push(search)
        currentPair = search
      } else {
        break
      }
    }

    if (allRows.length === SIZE - 1) {
      allImageVersions.push(allRows)
    }
  }

  return allImageVersions
    .map(image => {
      const join = [image[0][0]]
      return join.concat(image.map(i => i[1]))
    })
    .map(image => {
      return image.map(rowIndex => {
        const row = rowCandidates[rowIndex]
        return joinRowOfTiles(row.map(tile => {
          const tileMeta = meta[tile.id]
          const transformed = PERMUTATIONS[tile.perm](tileMeta.tile)
          return removeTileBorders(transformed)
        }))
      })
    })
    .map(joinMajorRows)
}

// write all image versions to .json files -> use in part2_2.js
const result = findSolution(DATA)
// const result = findSolution(TEST_DATA)
console.log(JSON.stringify(result, null, 2))
