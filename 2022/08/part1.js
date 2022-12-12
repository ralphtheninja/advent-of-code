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

  const isVisibleLeft = (i, j) => {
    const el = data[i][j]
    for (let col = 0; col < j; ++col) {
      if (data[i][col] >= el) return false
    }
    return true
  }

  const isVisibleRight = (i, j) => {
    const el = data[i][j]
    for (let col = j + 1; col < colCount; ++col) {
      if (data[i][col] >= el) return false
    }
    return true
  }

  const isVisibleUp = (i, j) => {
    const el = data[i][j]
    for (let row = 0; row < i; ++row) {
      if (data[row][j] >= el) return false
    }
    return true
  }

  const isVisibleDown = (i, j) => {
    const el = data[i][j]
    for (let row = i + 1; row < rowCount; ++row) {
      if (data[row][j] >= el) return false
    }
    return true
  }

  function isVisible (i, j) {
    return (isFirstRow(i) ||
            isLastRow(i) ||
            isFirstCol(j) ||
            isLastCol(j) ||
            isVisibleLeft(i, j) ||
            isVisibleRight(i, j) ||
            isVisibleUp(i, j) ||
            isVisibleDown(i, j))
  }

  let visibleCount = 0
  for (let i = 0; i < rowCount; ++i) {
    for (let j = 0; j < colCount; ++j) {
      if (isVisible(i, j)) visibleCount++
    }
  }

  return visibleCount
}

assert.equal(run('./test-data.txt'), 21)
console.log('total visible', run('./data.txt'))
