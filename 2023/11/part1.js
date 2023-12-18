const fs = require('fs')

function parse (file) {
  const originalData = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)

  let noCols = originalData[0].length

  const emptyRow = '.'.repeat(noCols)
  const emptyRows = originalData.map((row, i) => {
    return row.split('').every(c => c === '.') ? i : 0
  }).filter(Boolean)
  const insertRowsAt = emptyRows.map((row, i) => row + i)

  const dataAfterRows = originalData.slice()
  insertRowsAt.forEach(row => {
    dataAfterRows.splice(row, 0, emptyRow)
  })
  const noRows = dataAfterRows.length

  const emptyColumns = []
  for (let i = 0; i < noCols; ++i) {
    if (dataAfterRows.every(row => row[i] === '.')) {
      emptyColumns.push(i)
    }
  }
  const insertColumnsAt = emptyColumns.map((row, i) => row + i)

  const data = dataAfterRows.map(row => {
    const split = row.split('')
    insertColumnsAt.forEach(col => split.splice(col, 0, '.'))
    return split.join('')
  })

  noCols = data[0].length

  const galaxies = []
  for (let i = 0; i < noCols; ++i) {
    for (let j = 0; j < noRows; ++j) {
      if (data[j][i] === '#') {
        galaxies.push([i, j])
      }
    }
  }

  return galaxies
}

function distance (galaxies) {
  const distances = []
  for (let i = 0; i < galaxies.length - 1; ++i) {
    for (let j = i + 1; j < galaxies.length; ++j) {
      const from = galaxies[i]
      const to = galaxies[j]
      const dist = Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1])
      distances.push(dist)
    }
  }
  return distances.reduce((tot, d) => tot + d, 0)
}

// const galaxies = parse('./input.test')
// const assert = require('assert')
// assert.equal(distance(galaxies), 374)

const galaxies = parse('./input')
console.log('distance', distance(galaxies))
