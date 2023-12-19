const fs = require('fs')

function distance (file, expandFactor) {
  const data = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)

  const emptyRowIndices = data.map((row, i) => {
    return row.split('').every(c => c === '.') ? i : 0
  }).filter(Boolean)

  const emptyRowRanges = emptyRowIndices.map((row, i) => {
    const start = row + i * (expandFactor - 1)
    return {
      orig: row,
      start,
      end: start + expandFactor - 1
    }
  })

  const emptyColumnIndices = []
  const noCols = data[0].length
  for (let i = 0; i < noCols; ++i) {
    if (data.every(row => row[i] === '.')) {
      emptyColumnIndices.push(i)
    }
  }

  const emptyColumnRanges = emptyColumnIndices.map((col, j) => {
    const start = col + j * (expandFactor - 1)
    return {
      orig: col,
      start,
      end: start + expandFactor - 1
    }
  })

  const galaxies = []
  const noRows = data.length

  for (let i = 0; i < noCols; ++i) {
    for (let j = 0; j < noRows; ++j) {
      if (data[j][i] === '#') {
        galaxies.push([i, j])
      }
    }
  }

  function expandCoordinate (galaxy) {
    const [origX, origY] = galaxy
    const rangesBelowOrigX = emptyColumnRanges
      .map(col => col.orig < origX)
      .filter(Boolean)
      .length
    const rangesBelowOrigY = emptyRowRanges
      .map(row => row.orig < origY)
      .filter(Boolean)
      .length
    return [
      origX + rangesBelowOrigX * (expandFactor - 1),
      origY + rangesBelowOrigY * (expandFactor - 1)
    ]
  }

  const distances = []
  for (let i = 0; i < galaxies.length - 1; ++i) {
    for (let j = i + 1; j < galaxies.length; ++j) {
      const [fromX, fromY] = expandCoordinate(galaxies[i])
      const [toX, toY] = expandCoordinate(galaxies[j])
      distances.push(Math.abs(fromX - toX) + Math.abs(fromY - toY))
    }
  }
  return distances.reduce((tot, d) => tot + d, 0)
}

// const assert = require('assert')
// assert.equal(distance('./input.test', 2), 374)
// assert.equal(distance('./input.test', 10), 1030)
// assert.equal(distance('./input.test', 100), 8410)

console.log('distance', distance('./input', 1000000))
