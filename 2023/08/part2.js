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
  const nodes = Object.keys(network).map(key => {
    return key.endsWith('A') ? key : undefined
  }).filter(Boolean)

  const allSteps = nodes.map(node => {
    let steps = 0
    let done = false
    while (!done) {
      for (let i = 0; i < directions.length; ++i) {
        if (node.endsWith('Z')) {
          done = true
          break
        }
        const paths = network[node]
        const direction = directions[i]
        node = paths[direction]
        steps++
      }
    }
    return steps
  })
  return directions.length * allSteps.map(steps => steps / directions.length).reduce((t, i) => t * i, 1)
}

const { directions, network } = run('./input')
const steps = computeSteps(directions, network)
console.log('steps', steps)
