const fs = require('fs')
const assert = require('assert')

function parseBoards (rows) {
  assert.equal(rows.length % 5, 0, 'board rows must be a multiple of five')
  const boards = []

  for (let i = 0; i < rows.length / 5; ++i) {
    const slice = rows.slice(i * 5, (i + 1) * 5)
    boards.push(slice.map(row => {
      const parsedRow = row.split(/\s+/gi).filter(Boolean).map(value => {
        return {
          value: Number(value),
          marked: false
        }
      })
      return parsedRow
    }))
  }

  return boards
}

function readFile (file) {
  const rows = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
  return {
    numbers: rows[0].split(',').map(Number),
    boards: parseBoards(rows.slice(1))
  }
}

function arrayMarked (arr) {
  return arr.every(el => el.marked)
}

function hasMarkedRow (board) {
  for (const row of board) {
    if (arrayMarked(row)) return true
  }
  return false
}

function hasMarkedColumn (board) {
  const colCount = board[0].length
  for (let col = 0; col < colCount; ++col) {
    const column = board.map(row => {
      return row[col]
    })
    if (arrayMarked(column)) return true
  }
  return false
}

function isWinningBoard (board) {
  return hasMarkedRow(board) || hasMarkedColumn(board)
}

function boardHasNumber (board, value) {
  return board.some(row => {
    return row.some(el => el.value === value)
  })
}

function markNumber (board, value) {
  for (const row of board) {
    for (const el of row) {
      if (el.value === value && !el.marked) {
        el.marked = true
        return
      }
    }
  }
}

function sumUnmarked (board) {
  return board.map(row => {
    return row.filter(el => !el.marked).map(el => el.value).reduce((sum, value) => sum + value, 0)
  }).reduce((sum, value) => sum + value, 0)
}

function processBoards (file) {
  const data = readFile(file)
  const { numbers, boards } = data

  const boardCount = boards.length

  for (const number of numbers) {
    for (let i = 0; i < boardCount; ++i) {
      const board = boards[i]
      if (boardHasNumber(board, number)) {
        markNumber(board, number)
      }
      if (isWinningBoard(board)) {
        const winningBoards = boards.map(isWinningBoard).filter(Boolean)
        if (winningBoards.length === boardCount) {
          console.log('The last winning board is number', i, 'with score', sumUnmarked(board) * number)
          process.exit(0)
        }
      }
    }
  }
}

processBoards('./data.txt')
