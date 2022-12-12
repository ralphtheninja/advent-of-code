const fs = require('fs')
const assert = require('assert')

function run (file) {
  const data = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
  const rowCount = data.length
  const colCount = data[0].length

  const isFirstRow = i => i === 0
  const isLastRow = i => i === rowCount - 1
  const isFirstCol = j => j === 0
  const isLastCol = j => j === colCount - 1

  const leftScore = (i, j) => {
    const el = data[i][j]
    let score = 0
    for (let col = j - 1; col >= 0; --col) {
      ++score
      if (data[i][col] >= el) break
    }
    return score
  }
  const rightScore = (i, j) => {
    const el = data[i][j]
    let score = 0
    for (let col = j + 1; col < colCount; ++col) {
      ++score
      if (data[i][col] >= el) break
    }
    return score
  }
  const upScore = (i, j) => {
    const el = data[i][j]
    let score = 0
    for (let row = i - 1; row >= 0; --row) {
      ++score
      if (data[row][j] >= el) break
    }
    return score
  }
  const downScore = (i, j) => {
    const el = data[i][j]
    let score = 0
    for (let row = i + 1; row < rowCount; ++row) {
      ++score
      if (data[row][j] >= el) break
    }
    return score
  }

  function scenicScore (i, j) {
    if (isFirstRow(i) || isLastRow(i) || isFirstCol(j) || isLastCol(j)) {
      return 0
    }
    return leftScore(i, j) * rightScore(i, j) * upScore(i, j) * downScore(i, j)
  }

  let maxScore = 0

  for (let i = 0; i < rowCount; ++i) {
    for (let j = 0; j < colCount; ++j) {
      const score = scenicScore(i, j)
      if (score > maxScore) maxScore = score
    }
  }

  return maxScore
}

//assert.equal(run('./test-data.txt'), 8)
console.log('max score', run('./data.txt'))
