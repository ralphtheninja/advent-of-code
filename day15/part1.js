const { deepStrictEqual } = require('assert')
const INPUT = [0, 13, 1, 8, 6, 15]

function compute2020th (input) {
  const spoken = input.slice()

  function previouslySpoken (n) {
    return spoken.filter(i => i === n).length > 1
  }

  function findLastSpokenDistance (n) {
    let toIndex = null
    for (let i = spoken.length - 1; i >= 0; --i) {
      if (spoken[i] === n) {
        if (toIndex === null) toIndex = i
        else return toIndex - i
      }
    }
  }

  while (spoken.length < 2020) {
    const last = spoken[spoken.length - 1]
    spoken.push(previouslySpoken(last) ? findLastSpokenDistance(last) : 0)
  }

  return spoken[spoken.length - 1]
}

const TEST = [
  { input: [0, 3, 6], result: 436 },
  { input: [1, 3, 2], result: 1 },
  { input: [2, 1, 3], result: 10 },
  { input: [1, 2, 3], result: 27 },
  { input: [2, 3, 1], result: 78 },
  { input: [3, 2, 1], result: 438 },
  { input: [3, 1, 2], result: 1836 }
]

TEST.forEach(t => deepStrictEqual(compute2020th(t.input), t.result))

console.log(compute2020th(INPUT))
