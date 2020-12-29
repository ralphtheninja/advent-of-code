const fs = require('fs')
const { deepStrictEqual } = require('assert')
const DATA = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)

function manhattanDistance (instructions) {
  let position = { x: 0, y: 0 }
  let direction = 90

  instructions.forEach(i => {
    const cmd = i[0]
    const arg = Number(i.slice(1, i.length))

    console.log(i, '-> (' + cmd + ', ' + arg + ')')
    deepStrictEqual(cmd + arg, i)

    if (cmd === 'F') {
      if (direction === 90) {
        position.x += arg
      } else if (direction === 180) {
        position.y -= arg
      } else if (direction === 270) {
        position.x -= arg
      } else if (direction === 0) {
        position.y += arg
      } else {
        throw new Error('invalid dir ' + direction)
      }
    } else if (cmd === 'N') {
      position.y += arg
    } else if (cmd === 'S') {
      position.y -= arg
    } else if (cmd === 'E') {
      position.x += arg
    } else if (cmd === 'W') {
      position.x -= arg
    } else if (cmd === 'L') {
      let newAngle = (direction - arg) % 360
      while (newAngle < 0) newAngle += 360
      direction = newAngle
    } else if (cmd === 'R') {
      direction = (direction + arg) % 360
    } else {
      throw new Error('invalid cmd ' + cmd)
    }
  })

  console.log('final position:', position)
  console.log('final direction:', direction)

  return Math.abs(position.x) + Math.abs(position.y)
}

// Test
deepStrictEqual(manhattanDistance([
  'F10',
  'N3',
  'F7',
  'R90',
  'F11'
]), 25)

console.log('distance:', manhattanDistance(DATA))
