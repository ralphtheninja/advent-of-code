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

function nextElement (series) {
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
  return subSeries.reduce((tot, arr) => {
    return tot + arr[arr.length - 1]
  }, 0)
}

const assert = require('assert')
assert.equal(nextElement([0, 3, 6, 9, 12, 15]), 18)
assert.equal(nextElement([1, 3, 6, 10, 15, 21]), 28)
assert.equal(nextElement([10, 13, 16, 21, 30, 45]), 68)

const series = run('./input')
const sum = series.map(seq => nextElement(seq)).reduce((tot, i) => tot + i, 0)
console.log('result', sum)
