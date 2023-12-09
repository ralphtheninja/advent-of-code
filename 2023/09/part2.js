const fs = require('fs')

function run (file) {
  const data = fs.readFileSync(file, 'utf8').split('\n')
  return data.map(row => row.split(' ').map(Number))
}

function computeSubSeries (series) {
  const result = []
  for (let i = 0; i < series.length - 1; ++i) {
    result.push(series[i + 1] - series[i])
  }
  return result
}

function allZeros (series) {
  return series.every(el => el === 0)
}

function prevElement (series) {
  const subSeries = [series.slice()]
  do {
    const next = computeSubSeries(series)
    series = next
    if (!allZeros(next)) {
      subSeries.push(next)
    } else {
      break
    }
  } while (true)
  return subSeries.reverse().reduce((tot, arr) => {
    return arr[0] - tot
  }, 0)
}

const assert = require('assert')
assert.equal(prevElement([0, 3, 6, 9, 12, 15]), -3)
assert.equal(prevElement([1, 3, 6, 10, 15, 21]), 0)
assert.equal(prevElement([10, 13, 16, 21, 30, 45]), 5)

const series = run('./input')
const sum = series.map(seq => prevElement(seq)).reduce((tot, i) => tot + i, 0)
console.log('result', sum)
