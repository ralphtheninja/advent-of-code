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
const TEST_DATA = readFile('./test-data.txt')

function tt (id) {
  return TEST_DATA.find(tile => tile.id === id).tile
}

const CELL = [
  '########..',
  '.#########',
  '..########',
  '...#######',
  '......####',
  '......####',
  '......####',
  '.......###',
  '........##',
  '.........#'
]
const FLIP = [
  '..########',
  '#########.',
  '########..',
  '#######...',
  '####......',
  '####......',
  '####......',
  '###.......',
  '##........',
  '#.........'
]
const ROT90 = [
  '.........#',
  '........##',
  '.......###',
  '......####',
  '......####',
  '......####',
  '...#######',
  '..########',
  '.########.',
  '#########.'
]
const ROT180 = [
  '#.........',
  '##........',
  '###.......',
  '####......',
  '####......',
  '####......',
  '#######...',
  '########..',
  '#########.',
  '..########'
]
const ROT270 = [
  '.#########',
  '.########.',
  '########..',
  '#######...',
  '####......',
  '####......',
  '####......',
  '###.......',
  '##........',
  '#.........'
]

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

deepStrictEqual(rot90(CELL), ROT90)
deepStrictEqual(rot180(CELL), ROT180)
deepStrictEqual(rot90(rot90(CELL)), ROT180)
deepStrictEqual(rot270(CELL), ROT270)
deepStrictEqual(rot90(rot90(rot90(CELL))), ROT270)
deepStrictEqual(rot90(rot180(CELL)), ROT270)
deepStrictEqual(rot90(ROT270), CELL)
deepStrictEqual(flip(CELL), FLIP)
deepStrictEqual(flip(flip(CELL)), CELL)
deepStrictEqual(flip(rot90(flip(CELL))), ROT270)

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

deepStrictEqual(borderUp(tt(1951)), '#.##...##.')
deepStrictEqual(borderDown(tt(1951)), '#...##.#..')
deepStrictEqual(borderLeft(tt(1951)), '##.#..#..#')
deepStrictEqual(borderRight(tt(1951)), '.#####..#.')

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

deepStrictEqual(fitsRight(tt(1951), tt(2311)), true) // this happens to be true without any flips/rots
deepStrictEqual(fitsLeft(tt(2311), tt(1951)), true) // this happens to be true without any flips/rots

deepStrictEqual(fitsRight(rot180(flip(tt(2311))), tt(3079)), true)
deepStrictEqual(fitsRight(rot180(flip(tt(2729))), rot180(flip(tt(1427)))), true)
deepStrictEqual(fitsRight(rot180(flip(tt(1427))), rot90(flip(tt(2473)))), true)
deepStrictEqual(fitsRight(rot180(flip(tt(2971))), rot180(flip(tt(1489)))), true)
deepStrictEqual(fitsRight(rot180(flip(tt(1489))), flip(tt(1171))), true)
deepStrictEqual(fitsLeft(rot180(flip(tt(2311))), rot180(flip(tt(1951)))), true)
deepStrictEqual(fitsLeft(tt(3079), rot180(flip(tt(2311)))), true)
deepStrictEqual(fitsLeft(rot180(flip(tt(1427))), rot180(flip(tt(2729)))), true)
deepStrictEqual(fitsLeft(rot90(flip(tt(2473))), rot180(flip(tt(1427)))), true)
deepStrictEqual(fitsLeft(rot180(flip(tt(1489))), rot180(flip(tt(2971)))), true)
deepStrictEqual(fitsLeft(flip(tt(1171)), rot180(flip(tt(1489)))), true)
deepStrictEqual(fitsDown(rot180(flip(tt(1951))), rot180(flip(tt(2729)))), true)
deepStrictEqual(fitsDown(rot180(flip(tt(2311))), rot180(flip(tt(1427)))), true)
deepStrictEqual(fitsDown(tt(3079), rot90(flip(tt(2473)))), true)
deepStrictEqual(fitsDown(rot180(flip(tt(2729))), rot180(flip(tt(2971)))), true)
deepStrictEqual(fitsDown(rot180(flip(tt(1427))), rot180(flip(tt(1489)))), true)
deepStrictEqual(fitsDown(rot90(flip(tt(2473))), flip(tt(1171))), true)
deepStrictEqual(fitsUp(rot180(flip(tt(2729))), rot180(flip(tt(1951)))), true)
deepStrictEqual(fitsUp(rot180(flip(tt(1427))), rot180(flip(tt(2311)))), true)
deepStrictEqual(fitsUp(rot90(flip(tt(2473))), tt(3079)), true)
deepStrictEqual(fitsUp(rot180(flip(tt(2971))), rot180(flip(tt(2729)))), true)
deepStrictEqual(fitsUp(rot180(flip(tt(1489))), rot180(flip(tt(1427)))), true)
deepStrictEqual(fitsUp(flip(tt(1171)), rot90(flip(tt(2473)))), true)

// Some extra based on what we've found..
deepStrictEqual(fitsRight(rot90(flip(tt(2729))), rot90(flip(tt(2971)))), true)
deepStrictEqual(fitsRight(rot90(tt(2729)), rot90(tt(2971))), true)

// Note! That if A -> B (fits right), then rot90(A) fits down to rot90(B) etc

// Algorithm to find out possible neighbors:
// - start with list of tiles
// - pick first tile and compare to all other tiles (N - 1) -> note down how A fits with B and the opposite
// on B if fits right or down and append to list of possible neighbors
// - pick next tile after, comparing to (N - 2) etc until the second to last tile is compared to the last
// Algorithm to figure out the rest:
// - Try to find 12 DIFFERENT tiles that each can go right in 11 steps (are there exactly 12 different?)
// - From each of these 12 tiles, find one of them that can descend down the others (top left corner down
// to bottom left corner).

// Possible number of permutations (8)
// - I (identity)
// - I + rot 90
// - I + rot 180
// - I + rot 270
// - I + flip
// - I + flip + 90
// - I + flip + 180
// - I + flip + 270
// This means comparing two images A and B means there are 64 different combinations
// of permutations and also four directions from A to B (right, down, left and up).
// Note that this is an array of functions and the permutation index uniquely defines the operation.
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

    // Enough to find ONE match (there are 8 different results)
    if (allRows.length === SIZE - 1) {
      const firstRowIndex = allRows[0][0]
      const lastRowIndex = allRows[allRows.length - 1][1]
      const firstRow = rowCandidates[firstRowIndex]
      const lastRow = rowCandidates[lastRowIndex]
      return firstRow[0].id * firstRow[SIZE - 1].id * lastRow[0].id * lastRow[SIZE - 1].id
    }
  }
}

deepStrictEqual(findSolution(TEST_DATA), 20899048083289)

// Test results below.

// const rowCandidates = [
//   [{ id: 2311, perm: 1 }, { id: 1427, perm: 1 }, { id: 1489, perm: 1 }], // 0
//   [{ id: 2311, perm: 5 }, { id: 1427, perm: 5 }, { id: 1489, perm: 5 }], // 1
//   [{ id: 1951, perm: 0 }, { id: 2311, perm: 0 }, { id: 3079, perm: 6 }], // 2
//   [{ id: 1951, perm: 6 }, { id: 2311, perm: 6 }, { id: 3079, perm: 0 }], // 3
//   [{ id: 1951, perm: 1 }, { id: 2729, perm: 1 }, { id: 2971, perm: 1 }], // 4
//   [{ id: 1951, perm: 5 }, { id: 2729, perm: 5 }, { id: 2971, perm: 5 }], // 5
//   [{ id: 1171, perm: 0 }, { id: 1489, perm: 2 }, { id: 2971, perm: 2 }], // 6
//   [{ id: 1171, perm: 6 }, { id: 1489, perm: 4 }, { id: 2971, perm: 4 }], // 7
//   [{ id: 1171, perm: 1 }, { id: 2473, perm: 0 }, { id: 3079, perm: 5 }], // 8
//   [{ id: 1171, perm: 5 }, { id: 2473, perm: 6 }, { id: 3079, perm: 1 }], // 9
//   [{ id: 1489, perm: 3 }, { id: 1427, perm: 3 }, { id: 2311, perm: 3 }], // 10
//   [{ id: 1489, perm: 7 }, { id: 1427, perm: 7 }, { id: 2311, perm: 7 }], // 11
//   [{ id: 2473, perm: 3 }, { id: 1427, perm: 2 }, { id: 2729, perm: 2 }], // 12
//   [{ id: 2473, perm: 7 }, { id: 1427, perm: 4 }, { id: 2729, perm: 4 }], // 13
//   [{ id: 2971, perm: 0 }, { id: 1489, perm: 0 }, { id: 1171, perm: 2 }], // 14
//   [{ id: 2971, perm: 6 }, { id: 1489, perm: 6 }, { id: 1171, perm: 4 }], // 15
//   [{ id: 2971, perm: 3 }, { id: 2729, perm: 3 }, { id: 1951, perm: 3 }], // 16
//   [{ id: 2971, perm: 7 }, { id: 2729, perm: 7 }, { id: 1951, perm: 7 }], // 17
//   [{ id: 2729, perm: 0 }, { id: 1427, perm: 0 }, { id: 2473, perm: 1 }], // 18
//   [{ id: 2729, perm: 6 }, { id: 1427, perm: 6 }, { id: 2473, perm: 5 }], // 19
//   [{ id: 3079, perm: 4 }, { id: 2311, perm: 2 }, { id: 1951, perm: 2 }], // 20
//   [{ id: 3079, perm: 2 }, { id: 2311, perm: 4 }, { id: 1951, perm: 4 }], // 21
//   [{ id: 3079, perm: 7 }, { id: 2473, perm: 2 }, { id: 1171, perm: 3 }], // 22
//   [{ id: 3079, perm: 3 }, { id: 2473, perm: 4 }, { id: 1171, perm: 7 }] // 23
// ]

// Pairs from test data:
// const pairs = [
//   [0, 22],
//   [1, 5],
//   [3, 19],
//   [4, 0],
//   [7, 13],
//   [8, 10],
//   [10, 16],
//   [11, 9],
//   [12, 6],
//   [13, 21],
//   [14, 18],
//   [17, 11],
//   [18, 2],
//   [19, 15],
//   [20, 12],
//   [23, 1]
// ]

// Goal: Find two (SIZE - 1) row pairs that fit together
/*
const possiblePairs = [
  [[3, 19], [19, 15]], // VALID! (as the website shows)
  // [ { id: 1951, perm: 6 }, { id: 2311, perm: 6 }, { id: 3079, perm: 0 } ], // 3
  // [ { id: 2729, perm: 6 }, { id: 1427, perm: 6 }, { id: 2473, perm: 5 } ], // 19
  // [ { id: 2971, perm: 6 }, { id: 1489, perm: 6 }, { id: 1171, perm: 4 } ], // 15

  [[17, 11], [11, 9]], // VALID! (big matrix rotated 90)
  // [ { id: 2971, perm: 7 }, { id: 2729, perm: 7 }, { id: 1951, perm: 7 } ], // 17
  // [ { id: 1489, perm: 7 }, { id: 1427, perm: 7 }, { id: 2311, perm: 7 } ], // 11
  // [ { id: 1171, perm: 5 }, { id: 2473, perm: 6 }, { id: 3079, perm: 1 } ], // 9

  [[7, 13], [13, 21]], // VALID! (big matrix rotated 180)
  // [ { id: 1171, perm: 6 }, { id: 1489, perm: 4 }, { id: 2971, perm: 4 } ], // 7
  // [ { id: 2473, perm: 7 }, { id: 1427, perm: 4 }, { id: 2729, perm: 4 } ], // 13
  // [ { id: 3079, perm: 2 }, { id: 2311, perm: 4 }, { id: 1951, perm: 4 } ], // 21

  [[23, 1], [1, 5]], // VALID (big matrix rotated 270)
  // [ { id: 3079, perm: 3 }, { id: 2473, perm: 4 }, { id: 1171, perm: 7 } ], // 23
  // [ { id: 2311, perm: 1 }, { id: 1427, perm: 1 }, { id: 1489, perm: 1 } ], // 0
  // [ { id: 1951, perm: 5 }, { id: 2729, perm: 5 }, { id: 2971, perm: 5 } ], // 5

  [[20, 12], [12, 6]], // VALID! (big matrix flipped)
  // [ { id: 3079, perm: 4 }, { id: 2311, perm: 2 }, { id: 1951, perm: 2 } ], // 20
  // [ { id: 2473, perm: 3 }, { id: 1427, perm: 2 }, { id: 2729, perm: 2 } ], // 12
  // [ { id: 1171, perm: 0 }, { id: 1489, perm: 2 }, { id: 2971, perm: 2 } ], // 6

  [[8, 10], [10, 16]], // VALID! (big matrix flipped and rotated 90)
  // [ { id: 1171, perm: 1 }, { id: 2473, perm: 0 }, { id: 3079, perm: 5 } ], // 8
  // [ { id: 1489, perm: 3 }, { id: 1427, perm: 3 }, { id: 2311, perm: 3 } ], // 10
  // [ { id: 2971, perm: 3 }, { id: 2729, perm: 3 }, { id: 1951, perm: 3 } ], // 16

  [[14, 18], [18, 2]], // VALID! (big matrix flipped and rotated 180)
  // [ { id: 2971, perm: 0 }, { id: 1489, perm: 0 }, { id: 1171, perm: 2 } ], // 14
  // [ { id: 2729, perm: 0 }, { id: 1427, perm: 0 }, { id: 2473, perm: 1 } ], // 18
  // [ { id: 1951, perm: 0 }, { id: 2311, perm: 0 }, { id: 3079, perm: 6 } ], // 2

  [[4, 0], [0, 22]] // VALID! (big matrix flipped and rotated 270)
  // [ { id: 1951, perm: 1 }, { id: 2729, perm: 1 }, { id: 2971, perm: 1 } ], // 4
  // [ { id: 2311, perm: 1 }, { id: 1427, perm: 1 }, { id: 1489, perm: 1 } ], // 0
  // [ { id: 3079, perm: 7 }, { id: 2473, perm: 2 }, { id: 1171, perm: 3 } ], // 22
]
*/

// Funny result that we get eight different versions of the resulting image, since
// we can use the same eight permutations to get eight different versions of the image
// which all result in the same corners, which then results in the same answer.

// Also note that we get 16 different row pairs because of this, which basically
// tells us that there are 8 different combinations of two valid row pairs.

// Running the code on the real data produces 88 different row pairs, which tells
// us that there are 8 versions of 11 row pairs (12 rows). It should be enough to
// find ONE of the solutions.
console.log(findSolution(DATA))
