const fs = require('fs')
// const assert = require('assert')

function readFile (file) {
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
}

function countOnes (rows, pos) {
  let oneCount = 0
  for (const row of rows) {
    if (row[pos] === '1') oneCount++
  }
  return oneCount
}

function findMostCommon (rows, pos) {
  return 2 * countOnes(rows, pos) - rows.length >= 0 ? '1' : '0'
}

function findLeastCommon (rows, pos) {
  return 2 * countOnes(rows, pos) - rows.length >= 0 ? '0' : '1'
}

function oxygenRating (rows) {
  let pos = 0

  do {
    const mostCommon = findMostCommon(rows, pos)
    rows = rows.filter(row => row[pos] === mostCommon)
    if (rows.length === 1) {
      return parseInt(rows[0], 2)
    } else {
      pos++
    }
  } while (rows.length > 1)

  return 0
}

function co2Rating (rows) {
  let pos = 0

  do {
    const leastCommon = findLeastCommon(rows, pos)
    rows = rows.filter(row => row[pos] === leastCommon)
    if (rows.length === 1) {
      return parseInt(rows[0], 2)
    } else {
      pos++
    }
  } while (rows.length > 1)

  return 0
}

function calculate (rows) {
  return oxygenRating(rows) * co2Rating(rows)
}

// assert.deepEqual(findMostCommon(readFile('./test-data.txt'), 0), '1')
// assert.deepEqual(findMostCommon(readFile('./test-data.txt'), 1), '0')
// assert.deepEqual(findMostCommon(readFile('./test-data.txt'), 2), '1')
// assert.deepEqual(findMostCommon(readFile('./test-data.txt'), 3), '1')
// assert.deepEqual(findMostCommon(readFile('./test-data.txt'), 4), '0')
// assert.deepEqual(findLeastCommon(readFile('./test-data.txt'), 0), '0')
// assert.deepEqual(findLeastCommon(readFile('./test-data.txt'), 1), '1')
// assert.deepEqual(findLeastCommon(readFile('./test-data.txt'), 2), '0')
// assert.deepEqual(findLeastCommon(readFile('./test-data.txt'), 3), '0')
// assert.deepEqual(findLeastCommon(readFile('./test-data.txt'), 4), '1')
// assert.equal(oxygenRating(readFile('./test-data.txt')), 23)
// assert.equal(co2Rating(readFile('./test-data.txt')), 10)
// assert.equal(calculate(readFile('./test-data.txt')), 230)

console.log('result', calculate(readFile('./data.txt')))
