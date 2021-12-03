const fs = require('fs')
const assert = require('assert')

function readFile (file) {
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(cmd => {
    const split = cmd.split(' ')
    return {
      dir: split[0],
      step: Number(split[1])
    }
  })
}

const directions = readFile('./data.txt')

function calculate (commands) {
  const pos = { horizontal: 0, vertical: 0 }
  commands.forEach(({ dir, step }) => {
    switch (dir) {
      case 'forward':
        pos.horizontal += step
        break
      case 'down':
        pos.vertical += step
        break
      case 'up':
        pos.vertical -= step
        break
    }
  })
  return pos.horizontal * pos.vertical
}

// assert.equal(calculate(readFile('./test-data.txt')), 150)

console.log('result', calculate(readFile('./data.txt')))
