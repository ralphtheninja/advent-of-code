const fs = require('fs')
const { deepStrictEqual } = require('assert')
const data = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean).map(Number)

const sample = [17, 42, 18, 39, 1, 16, 13, 31, 35, 32, 47, 11, 40, 23, 29, 30, 3, 38, 43, 27, 41, 9, 19, 14, 46, 44, 4, 20, 5, 6, 10]

function preamble (pos, data) {
  return data.slice(pos - 25, pos)
}

deepStrictEqual(preamble(25, sample), [17, 42, 18, 39, 1, 16, 13, 31, 35, 32, 47, 11, 40, 23, 29, 30, 3, 38, 43, 27, 41, 9, 19, 14, 46])
deepStrictEqual(preamble(26, sample), [42, 18, 39, 1, 16, 13, 31, 35, 32, 47, 11, 40, 23, 29, 30, 3, 38, 43, 27, 41, 9, 19, 14, 46, 44])
deepStrictEqual(preamble(27, sample), [18, 39, 1, 16, 13, 31, 35, 32, 47, 11, 40, 23, 29, 30, 3, 38, 43, 27, 41, 9, 19, 14, 46, 44, 4])
deepStrictEqual(preamble(28, sample), [39, 1, 16, 13, 31, 35, 32, 47, 11, 40, 23, 29, 30, 3, 38, 43, 27, 41, 9, 19, 14, 46, 44, 4, 20])

function sumsOfTwo (window) {
  const sums = []
  for (let i = 0; i < window.length - 1; ++i) {
    for (let j = i + 1; j < window.length; ++j) {
      sums.push(window[i] + window[j])
    }
  }
  return sums
}

deepStrictEqual(sumsOfTwo([1, 2, 3, 4]), [3, 4, 5, 5, 6, 7])
deepStrictEqual(sumsOfTwo([17, 42, 18, 39, 1, 16, 13]), [59, 35, 56, 18, 33, 30, 60, 81, 43, 58, 55, 57, 19, 34, 31, 40, 55, 52, 17, 14, 29])

for (let i = 25; i < data.length; ++i) {
  const window = data.slice(i - 25, i)
  const number = data[i]
  if (!sumsOfTwo(window).includes(number)) {
    console.log(number, 'is not a sum of any of the previous 25 numbers')
    process.exit(0)
  }
}
