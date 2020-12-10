const fs = require('fs')
const { deepStrictEqual } = require('assert')
const ADAPTERS = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean).map(Number)

// Sample data.
const SAMPLE1 = [16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4]
const SAMPLE2 = [28, 33, 18, 42, 31, 14, 46, 20, 48, 47, 24, 23, 49, 45, 19, 38, 39, 11, 1, 32, 25, 35, 8, 17, 7, 9, 4, 2, 34, 10, 3]

function prepare (adapters) {
  const copy = adapters.slice()

  copy.sort((a, b) => {
    if (a < b) return -1
    else if (a > b) return 1
    else return 0
  })

  // Add the computer device last with 3 higher joltage
  // than the last adapter.
  copy.push(copy[copy.length - 1] + 3)

  // Prepend charging outlet.
  copy.unshift(0)

  return copy
}

// Tests for preparing data
deepStrictEqual(prepare(SAMPLE1), [0, 1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19, 22])
deepStrictEqual(prepare(SAMPLE2), [0, 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31, 32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 48, 49, 52])

function differences (adapters) {
  const result = {}
  for (let i = 0; i < adapters.length - 1; ++i) {
    const diff = adapters[i + 1] - adapters[i]
    if (!result[diff]) {
      result[diff] = 1
    } else {
      result[diff]++
    }
  }
  return result
}

// Tests for differences
deepStrictEqual(differences(prepare(SAMPLE1)), { 1: 7, 3: 5 })
deepStrictEqual(differences(prepare(SAMPLE2)), { 1: 22, 3: 10 })

function solution (adapters) {
  adapters = prepare(adapters)
  const diffs = differences(adapters)
  return diffs['1'] * diffs['3']
}

// Tests for other solutions.
deepStrictEqual(solution(SAMPLE1), 7 * 5)
deepStrictEqual(solution(SAMPLE2), 22 * 10)

// The actual solution.
console.log('solution', solution(ADAPTERS))
