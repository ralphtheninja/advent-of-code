const fs = require('fs')

function run (file) {
  const data = fs.readFileSync(file, 'utf8').split('\n\n')
  const directions = data[0]
  const network = {}
  const regex = /\((\w+), (\w+)\)/
  data[1].split('\n').filter(Boolean).forEach(line => {
    const split = line.split(' = ')
    const node = split[0]

    const match = regex.exec(split[1])
    if (!match) {
      throw new Error('should not happen')
    }
    const L = match[1]
    const R = match[2]

    network[node] = { L, R }
  })
  return { directions, network }
}

function computeSteps (directions, network) {
  let steps = 0
  let node = 'AAA'
  let done = false
  while (!done) {
    for (let i = 0; i < directions.length; ++i) {
      if (node === 'ZZZ') {
        done = true
        break
      }
      console.log('checking node', node)
      const paths = network[node]
      const direction = directions[i]
      node = paths[direction]
      console.log(' dir -> ', direction, 'node ->', node)
      steps++
    }
  }
  return steps
}

// const { directions, network } = run('./input.test')
// const assert = require('assert')
// const steps = computeSteps(directions, network)
// assert.equal(steps, 2)

// const { directions, network } = run('./input.test2')
// const assert = require('assert')
// const steps = computeSteps(directions, network)
// assert.equal(steps, 6)

const { directions, network } = run('./input')
const steps = computeSteps(directions, network)
console.log('steps', steps)
