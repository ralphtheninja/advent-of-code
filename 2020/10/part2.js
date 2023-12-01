const fs = require('fs')
const { deepStrictEqual } = require('assert')
const ADAPTERS = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean).map(Number)

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

deepStrictEqual(prepare(SAMPLE1), [0, 1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19, 22])

function lookAhead (adapters, from) {
  const result = []
  for (let i = from + 1; i < adapters.length; ++i) {
    const diff = adapters[i] - adapters[from]
    if (diff >= 1 && diff <= 3) {
      result.push(adapters[i])
    }
  }
  return result
}

deepStrictEqual(lookAhead(prepare(SAMPLE1), 0), [1])
deepStrictEqual(lookAhead(prepare(SAMPLE1), 1), [4])
deepStrictEqual(lookAhead(prepare(SAMPLE1), 2), [5, 6, 7])
deepStrictEqual(lookAhead(prepare(SAMPLE1), 5), [10])
deepStrictEqual(lookAhead(prepare(SAMPLE1), 6), [11, 12])
deepStrictEqual(lookAhead(prepare(SAMPLE1), 8), [15])
deepStrictEqual(lookAhead(prepare(SAMPLE1), 8), [15])
deepStrictEqual(lookAhead(prepare(SAMPLE1), 9), [16])
deepStrictEqual(lookAhead(prepare(SAMPLE1), 10), [19])
deepStrictEqual(lookAhead(prepare(SAMPLE1), 11), [22])
deepStrictEqual(lookAhead(prepare(SAMPLE1), 12), [])

/**
 * A bit hacky.
 *
 * The list of adapters form a connected graph, where each sub graph has a certain
 * multiplicity. Since each sub graph can be computed individually, without affecting the others
 * the product of all sub graphs should yield the total amount of combinations.
 *
 * The gist is that there are three things that can happen (starting from the first element):
 *
 * 1. You can only go to one element from the current (e.g. 0 -> 2), i.e. there is no choice
 *    so we step to the next element in the adapter list.
 * 2. You can go to two different elements (e.g. 0 -> [1, 2]), which will make fork and a
 *    multiplicator of 2.
 * 3. You can reach three different element (e.g. 0 -> [1, 2, 3]). Slightly trickier, since
 *    the multiplicity depends on the value of the adapter coming after this sequence. It's
 *    possible that this adapter can be reached from some or all of the intermediate adapters,
 *    which results in a graph with different multiplicity.
 */
function solution (adapters) {
  adapters = prepare(adapters)

  let i = 0
  let count = 1

  do {
    const ahead = lookAhead(adapters, i)
    let multiplicator = 1

    if (ahead.length === 1) {
      const end = adapters[i + 1]
      console.log('[', adapters[i], '] -> [', end, ']')
      // Step to next element.
      i++
    } else if (ahead.length === 2) {
      const end = adapters[i + 3]
      console.log('[', adapters[i], '] -> ', ahead, '-> [', end, ']')
      // Step to element after sub graph
      i += 3
      multiplicator = 2
    } else if (ahead.length === 3) {
      const end = adapters[i + 4]
      console.log('[', adapters[i], '] -> ', ahead, '-> [', end, ']')

      if (end - adapters[i + 1] === 3) {
        multiplicator = 7
      } else if (end - adapters[i + 2] === 3) {
        multiplicator = 6
      } else if (end - adapters[i + 3] === 3) {
        multiplicator = 4
      }

      // Step to element after sub graph
      i += 4
    }

    count *= multiplicator
  } while (i < adapters.length - 1)

  return count
}

deepStrictEqual(solution(SAMPLE1), 8)
deepStrictEqual(solution(SAMPLE2), 19208)

// The actual solution.
console.log('Answer:', solution(ADAPTERS))
