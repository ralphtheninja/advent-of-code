const { deepStrictEqual } = require('assert')
const INPUT = [0, 13, 1, 8, 6, 15]

function compute (input, MAX) {
  const META = {}
  input.forEach((n, i) => META[n] = { prev: i, last: -1 })

  let count = input.length
  let last = input[input.length - 1]

  function store (n) {
    const meta = META[n]
    if (meta) {
      if (meta.last !== -1) {
        meta.prev = meta.last
        meta.last = count
      } else {
        meta.last = count
      }
    } else {
      META[n] = { prev: count, last: -1 }
    }
  }

  while (count < MAX) {
    const meta = META[last]
    store(last = meta.last !== -1 ? meta.last - meta.prev : 0)
    count++
  }

  return last
}

const TEST2020 = [
  { input: [0, 3, 6], result: 436 },
  { input: [1, 3, 2], result: 1 },
  { input: [2, 1, 3], result: 10 },
  { input: [1, 2, 3], result: 27 },
  { input: [2, 3, 1], result: 78 },
  { input: [3, 2, 1], result: 438 },
  { input: [3, 1, 2], result: 1836 }
]

TEST2020.forEach(t => deepStrictEqual(compute(t.input, 2020), t.result))

const TEST = [
  { input: [0, 3, 6], result: 175594 },  // correct, t = 11:26 minutes
  { input: [1, 3, 2], result: 2578 },    // correct, t = 13:24 minutes
  { input: [2, 1, 3], result: 3544142 },
  { input: [1, 2, 3], result: 261214 },
  { input: [2, 3, 1], result: 6895259 },
  { input: [3, 2, 1], result: 18 },
  { input: [3, 1, 2], result: 362 }
]

//TEST.forEach(t => deepStrictEqual(compute(t.input, 30000000), t.result))
console.log(compute(INPUT, 30000000))
