const fs = require('fs')
const assert = require('assert')

function readFile (file) {
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(row => {
      const split = row.split(' -> ')
      const from = split[0].split(',').map(Number)
      const to = split[1].split(',').map(Number)
      return { from, to }
    })
}

function isHorizontal (line) {
  const { from, to } = line
  return from[1] === to[1]
}

function isVertical (line) {
  const { from, to } = line
  return from[0] === to[0]
}

function getCoordinates (line) {
  if (isHorizontal(line)) {
    const y = line.from[1]
    const x1 = line.from[0]
    const x2 = line.to[0]
    const coords = []
    if (x1 <= x2) {
      for (let x = x1; x <= x2; x++) {
        coords.push([x, y])
      }
    } else {
      for (let x = x2; x <= x1; x++) {
        coords.push([x, y])
      }
    }
    return coords
  } else if (isVertical(line)) {
    const x = line.from[0]
    const y1 = line.from[1]
    const y2 = line.to[1]
    const coords = []
    if (y1 <= y2) {
      for (let y = y1; y <= y2; y++) {
        coords.push([x, y])
      }
    } else {
      for (let y = y2; y <= y1; y++) {
        coords.push([x, y])
      }
    }
    return coords
  } else {
    throw new Error('diagonal lines not yet supported')
  }
}

function createMap (lines) {
  const map = {}

  for (const line of lines) {
    const coords = getCoordinates(line)
    for (const coord of coords) {
      const str = coord.join(',')
      if (!map[str]) {
        map[str] = 1
      } else {
        map[str]++
      }
    }
  }

  return map
}

function test () {
  let lines = readFile('./test-data.txt')

  assert(isHorizontal({ from: [ 0, 9 ], to: [ 5, 9 ] }))
  assert(!isVertical({ from: [ 0, 9 ], to: [ 5, 9 ] }))
  assert(isHorizontal({ from: [ 0, 9 ], to: [ 2, 9 ] }))
  assert(!isVertical({ from: [ 0, 9 ], to: [ 2, 9 ] }))
  assert(isVertical({ from: [ 2, 2 ], to: [ 2, 1 ] }))
  assert(isVertical({ from: [ 7, 0 ], to: [ 7, 3 ] }))
  assert(!isHorizontal({ from: [ 2, 2 ], to: [ 2, 1 ] }))

  assert.deepEqual(
    getCoordinates(
      { from: [ 0, 9 ], to: [ 5, 9 ] }
    ),
    [ [ 0, 9 ], [ 1, 9 ], [ 2, 9 ], [ 3, 9 ], [ 4, 9 ], [ 5, 9 ] ]
  )
  assert.deepEqual(
    getCoordinates(
      { from: [ 0, 9 ], to: [ 2, 9 ] }
    ),
    [ [ 0, 9 ], [ 1, 9 ], [ 2, 9 ] ]
  )
  assert.deepEqual(
    getCoordinates(
      { from: [ 2, 2 ], to: [ 2, 1 ] }
    ),
    [ [ 2, 1 ], [ 2, 2 ] ]
  )
  assert.deepEqual(
    getCoordinates(
      { from: [ 7, 0 ], to: [ 7, 3 ] }
    ),
    [ [ 7, 0 ], [ 7, 1 ], [ 7, 2 ], [ 7, 3 ] ]
  )

  lines = lines.filter(line => isHorizontal(line) || isVertical(line))
  const map = createMap(lines)
  assert.equal(Object.values(map).filter(v => v >= 2).length, 5)
}

// test()

const lines = readFile('./data.txt').filter(line => isHorizontal(line) || isVertical(line))
const map = createMap(lines)
console.log('COORDS with at least 2 hits', Object.values(map).filter(v => v >= 2).length)
