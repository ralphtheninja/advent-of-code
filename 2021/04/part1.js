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

  const result = { data }

  for (const number of numbers) {
    for (let i = 0; i < boards.length; ++i) {
      const board = boards[i]
      if (boardHasNumber(board, number)) {
        markNumber(board, number)
      }
      if (isWinningBoard(board)) {
        console.log('FINAL NUMBER is', number, 'BOARD NUMBER', i, 'WON!')
        result.winningNumber = number
        result.winningBoard = i
        return result
      }
    }
  }
}

function test () {
  assert.equal(hasMarkedRow([
    [{ marked: false }, { marked: false }, { marked: false }],
    [{ marked: true }, { marked: true }, { marked: true }],
    [{ marked: false }, { marked: false }, { marked: false }]
  ]), true)
  assert.equal(hasMarkedRow([
    [{ marked: true }, { marked: true }, { marked: true }],
    [{ marked: false }, { marked: false }, { marked: false }],
    [{ marked: false }, { marked: false }, { marked: false }]
  ]), true)
  assert.equal(hasMarkedRow([
    [{ marked: false }, { marked: false }, { marked: false }],
    [{ marked: false }, { marked: false }, { marked: false }],
    [{ marked: true }, { marked: true }, { marked: true }]
  ]), true)
  assert.equal(hasMarkedRow([
    [{ marked: false }, { marked: false }, { marked: false }],
    [{ marked: false }, { marked: false }, { marked: false }],
    [{ marked: false }, { marked: false }, { marked: false }]
  ]), false)
  assert.equal(hasMarkedColumn([
    [{ marked: true }, { marked: false }, { marked: false }],
    [{ marked: true }, { marked: false }, { marked: false }],
    [{ marked: true }, { marked: false }, { marked: false }]
  ]), true)
  assert.equal(hasMarkedColumn([
    [{ marked: false }, { marked: true }, { marked: false }],
    [{ marked: false }, { marked: true }, { marked: false }],
    [{ marked: false }, { marked: true }, { marked: false }]
  ]), true)
  assert.equal(hasMarkedColumn([
    [{ marked: false }, { marked: false }, { marked: true }],
    [{ marked: false }, { marked: false }, { marked: true }],
    [{ marked: false }, { marked: false }, { marked: true }]
  ]), true)
  assert.equal(hasMarkedColumn([
    [{ marked: false }, { marked: false }, { marked: false }],
    [{ marked: false }, { marked: false }, { marked: false }],
    [{ marked: false }, { marked: false }, { marked: false }]
  ]), false)

  const tempBoard = [
    [
      { value: 1, marked: false },
      { value: 99, marked: false },
      { value: 17, marked: false },
      { value: 24, marked: true },
      { value: 4, marked: true }
    ],
    [
      { value: 10, marked: false },
      { value: 16, marked: false },
      { value: 15, marked: true },
      { value: 9, marked: true },
      { value: 19, marked: false }
    ],
    [
      { value: 18, marked: false },
      { value: 8, marked: true },
      { value: 23, marked: true },
      { value: 26, marked: false },
      { value: 20, marked: false }
    ],
    [
      { value: 22, marked: true },
      { value: 11, marked: true },
      { value: 13, marked: false },
      { value: 6, marked: false },
      { value: 5, marked: false }
    ],
    [
      { value: 2, marked: true },
      { value: 0, marked: false },
      { value: 12, marked: false },
      { value: 3, marked: false },
      { value: 7, marked: false }
    ]
  ]
  assert.equal(sumUnmarked(tempBoard), 1 + 99 + 17 + 10 + 16 + 19 + 18 + 26 + 20 + 13 + 6 + 5 + 0 + 12 + 3 + 7)
  assert.equal(boardHasNumber(tempBoard, 1), true)
  assert.equal(boardHasNumber(tempBoard, 8), true)
  assert.equal(boardHasNumber(tempBoard, 13), true)
  assert.equal(boardHasNumber(tempBoard, 0), true)
  assert.equal(boardHasNumber(tempBoard, 5), true)
  assert.equal(boardHasNumber(tempBoard, 444), false)

  const result = processBoards('./test-data.txt')
  assert.equal(isWinningBoard(result.data.boards[0]), false)
  assert.equal(isWinningBoard(result.data.boards[1]), false)
  assert.equal(isWinningBoard(result.data.boards[2]), true)

  assert.equal(sumUnmarked(result.data.boards[2]), 188)
}

// test()

const result = processBoards('./data.txt')
const winning = result.data.boards[result.winningBoard]
console.log('SCORE IS', sumUnmarked(winning) * result.winningNumber)
