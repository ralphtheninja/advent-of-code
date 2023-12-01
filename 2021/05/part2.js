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

function isValidLine (line) {
  return isHorizontal(line) || isVertical(line) || isDiagonal45(line)
}

function isHorizontal (line) {
  const { from, to } = line
  return from[1] === to[1]
}

function isVertical (line) {
  const { from, to } = line
  return from[0] === to[0]
}

function isDiagonal45 (line) {
  const { from, to } = line
  return Math.abs(to[1] - from[1]) === Math.abs(to[0] - from[0])
}

function getCoordinates (line) {
  const { from, to } = line
  if (isHorizontal(line)) {
    const y = from[1]
    const x1 = from[0]
    const x2 = to[0]
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
    const x = from[0]
    const y1 = from[1]
    const y2 = to[1]
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
  } else if (isDiagonal45(line)) {
    // By convention we start with the point with the left most x-coordinate
    const start = from[0] <= to[0] ? from : to
    const end = from[0] <= to[0] ? to : from
    const stepY = end[1] >= start[1] ? 1 : -1
    const coords = []
    let x = start[0]
    let y = start[1]
    for (; x <= end[0]; x++) {
      coords.push([x, y])
      y += stepY
    }
    return coords
  } else {
    throw new Error('can this even happen?')
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

  assert(isHorizontal({ from: [0, 9], to: [5, 9] }))
  assert(!isVertical({ from: [0, 9], to: [5, 9] }))
  assert(isHorizontal({ from: [0, 9], to: [2, 9] }))
  assert(!isVertical({ from: [0, 9], to: [2, 9] }))
  assert(isVertical({ from: [2, 2], to: [2, 1] }))
  assert(isVertical({ from: [7, 0], to: [7, 3] }))
  assert(!isHorizontal({ from: [2, 2], to: [2, 1] }))

  assert(isDiagonal45({ from: [1, 1], to: [3, 3] }))
  assert(isDiagonal45({ from: [3, 3], to: [1, 1] }))
  assert(isDiagonal45({ from: [9, 7], to: [7, 9] }))
  assert(isDiagonal45({ from: [7, 9], to: [9, 7] }))

  assert.deepEqual(
    getCoordinates(
      { from: [0, 9], to: [5, 9] }
    ),
    [[0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9]]
  )
  assert.deepEqual(
    getCoordinates(
      { from: [0, 9], to: [2, 9] }
    ),
    [[0, 9], [1, 9], [2, 9]]
  )
  assert.deepEqual(
    getCoordinates(
      { from: [2, 2], to: [2, 1] }
    ),
    [[2, 1], [2, 2]]
  )
  assert.deepEqual(
    getCoordinates(
      { from: [7, 0], to: [7, 3] }
    ),
    [[7, 0], [7, 1], [7, 2], [7, 3]]
  )

  lines = lines.filter(isValidLine)
  const map = createMap(lines)
  assert.equal(Object.values(map).filter(v => v >= 2).length, 12)
}

// test()

const lines = readFile('./data.txt').filter(isValidLine)
const map = createMap(lines)
console.log('COORDS with at least 2 hits', Object.values(map).filter(v => v >= 2).length)
