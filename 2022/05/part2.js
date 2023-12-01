const fs = require('fs')
const assert = require('assert')

function parseStacks (rows, numberOfStacks) {
  const stacks = (new Array(numberOfStacks)).fill([])
  for (let i = 0; i < rows.length; ++i) {
    const row = rows[i]
    let readingCrate = false
    for (let j = 0; j < row.length; ++j) {
      const c = row[j]
      if (c === '[') {
        readingCrate = true
      } else if (c === ']') {
        readingCrate = false
      } else if (readingCrate) {
        const stackIndex = (j + 3) / 4 - 1
        stacks[stackIndex] = stacks[stackIndex].concat(c)
      }
    }
  }
  return stacks.map(stack => stack.slice().reverse())
}

function parseInstructions (rows) {
  return rows.map(row => {
    const split = row.split(' ')
    const move = Number(split[1])
    const from = Number(split[3]) - 1
    const to = Number(split[5]) - 1
    assert(!isNaN(move) && !isNaN(from) && !isNaN(to))
    return { move, from, to }
  })
}

function move (stacks, { move, from, to }) {
  const result = stacks.slice()
  assert(move <= stacks[from].length)

  const fromStack = result[from].slice()
  const toStack = result[to].slice()

  const temp = []
  for (let count = 0; count < move; ++count) {
    temp.push(fromStack.pop())
  }
  temp.reverse()

  result[from] = fromStack
  result[to] = toStack.concat(temp)

  return result
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)

  const splitIndex = data.slice().findIndex(row => {
    return !(row.includes('[') || row.includes(']') || row.includes('move'))
  })
  const stackNumbers = data[splitIndex].trim().split(' ').filter(Boolean).map(Number)
  const numberOfStacks = stackNumbers[stackNumbers.length - 1]

  let stacks = parseStacks(data.slice(0, splitIndex), numberOfStacks)

  const instructions = parseInstructions(data.slice(splitIndex + 1))
  instructions.forEach(instruction => {
    stacks = move(stacks, instruction)
  })

  return stacks.map(stack => {
    const length = stack.length
    assert(stack.length > 0)
    return stack[length - 1]
  }).join('')
}

// assert.equal(run('./test-data.txt'), 'MCD')
console.log('result', run('./data.txt'))
