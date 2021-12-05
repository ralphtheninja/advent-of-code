const fs = require('fs')
const assert = require('assert')

function readFile (file) {
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
}

function calculate (rows) {
  const oneCount = new Array(rows[0].length)
  oneCount.fill(0)

  for (const row of rows) {
    for (let i = 0; i < row.length; ++i) {
      if (row[i] === '1') oneCount[i]++
    }
  }

  let gamma = ''
  let epsilon = ''
  const rowCount = rows.length

  for (const count of oneCount) {
    const diff = 2 * count - rowCount
    if (diff > 0) {
      gamma += '1'
      epsilon += '0'
    } else if (diff < 0) {
      gamma += '0'
      epsilon += '1'
    } else {
      assert(false, 'Most common 0 or 1 indeterminate')
    }
  }

  return parseInt(gamma, 2) * parseInt(epsilon, 2)
}

// assert.equal(calculate(readFile('./test-data.txt')), 198)

console.log('result', calculate(readFile('./data.txt')))
