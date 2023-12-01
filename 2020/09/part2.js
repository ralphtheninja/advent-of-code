const fs = require('fs')
const { deepStrictEqual } = require('assert')
const data = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean).map(Number)

const sample = [17, 42, 18, 39, 1, 16, 13, 31, 35, 32]

function partitionArray (array, size) {
  if (size >= array.length) {
    throw new Error('size is too big')
  }
  const result = []
  const N = array.length - size + 1
  for (let i = 0; i < N; ++i) {
    result.push(array.slice(i, i + size))
  }
  return result
}

deepStrictEqual(partitionArray(sample, 9), [
  [17, 42, 18, 39, 1, 16, 13, 31, 35],
  [42, 18, 39, 1, 16, 13, 31, 35, 32]
])
deepStrictEqual(partitionArray(sample, 8), [
  [17, 42, 18, 39, 1, 16, 13, 31],
  [42, 18, 39, 1, 16, 13, 31, 35],
  [18, 39, 1, 16, 13, 31, 35, 32]
])
deepStrictEqual(partitionArray(sample, 7), [
  [17, 42, 18, 39, 1, 16, 13],
  [42, 18, 39, 1, 16, 13, 31],
  [18, 39, 1, 16, 13, 31, 35],
  [39, 1, 16, 13, 31, 35, 32]
])
deepStrictEqual(partitionArray(sample, 2), [
  [17, 42],
  [42, 18],
  [18, 39],
  [39, 1],
  [1, 16],
  [16, 13],
  [13, 31],
  [31, 35],
  [35, 32]
])

function sumArray (array) {
  return array.reduce((item, total) => {
    return item + total
  }, 0)
}

deepStrictEqual(sumArray([1, 2, 3]), 6)
deepStrictEqual(sumArray([1, 2, 3, 4]), 10)
deepStrictEqual(sumArray([11, 2, 333, 44]), 390)

// the magic number is at array index 646, so we can start by using
// the first 646 numbers from index 0 to 645
const SUM = 1038347917
const numbers = data.slice(0, 646)

console.log('size of numbers', numbers.length)

for (let size = numbers.length - 1; size > 1; size--) {
  const partitions = partitionArray(numbers, size)
  partitions.forEach(part => {
    if (sumArray(part) === SUM) {
      console.log('Found contiguous partition', part)
      const sorted = part.slice().sort()
      console.log('sorted', sorted)
      console.log('min + max', sorted[0] + sorted[sorted.length - 1])
      process.exit(0)
    }
  })
}
