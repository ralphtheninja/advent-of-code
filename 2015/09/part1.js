const fs = require('fs')

function parse (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const cities = {}
  const costs = {}
  lines.forEach(line => {
    const split = line.split(' = ')
    const [from, to] = split[0].split(' to ')
    const dist = Number(split[1])
    costs[`${from}.${to}`] = dist
    costs[`${to}.${from}`] = dist
    if (!cities[from]) cities[from] = true
    if (!cities[to]) cities[to] = true
  })
  return { cities: Object.keys(cities), costs }
}

/**
 * Taken from https://medium.com/weekly-webtips/step-by-step-guide-to-array-permutation-using-recursion-in-javascript-4e76188b88ff
 * Thanks a lot! <3
 */
function permute (nums) {
  const result = []
  if (nums.length === 0) return []
  if (nums.length === 1) return [nums]
  for (let i = 0; i < nums.length; i++) {
    const currentNum = nums[i]
    const remainingNums = nums.slice(0, i).concat(nums.slice(i + 1))
    const remainingNumsPermuted = permute(remainingNums)
    for (let j = 0; j < remainingNumsPermuted.length; j++) {
      const permutedArray = [currentNum].concat(remainingNumsPermuted[j])
      result.push(permutedArray)
    }
  }
  return result
}

// const { cities, costs } = parse('./input.test')
const { cities, costs } = parse('./input')
const permutations = permute(cities)

const routeCosts = permutations.map(route => {
  let cost = 0
  for (let i = 0; i < route.length - 1; ++i) {
    const from = route[i]
    const to = route[i + 1]
    cost += costs[`${from}.${to}`]
  }
  return { route, cost }
})
const min = routeCosts.reduce((tot, { route, cost }) => {
  if (cost < tot.cost) return { cost, route }
  else return tot
}, { cost: Infinity })

// const assert = require('assert')
// assert.equal(min.cost, 605)

console.log('result', min)
