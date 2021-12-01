const fs = require('fs')
const { deepStrictEqual } = require('assert')
const DATA = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)

function manhattanDistance (instructions) {
  let position = { x: 0, y: 0 }
  let waypoint = { x: 10, y: 1 }
  //let direction = 90

  instructions.forEach(i => {
    const cmd = i[0]
    const arg = Number(i.slice(1, i.length))

    console.log(i, '-> (' + cmd + ', ' + arg + ')')
    deepStrictEqual(cmd + arg, i)

    if (cmd === 'F') {
      position.x += arg * waypoint.x
      position.y += arg * waypoint.y
    } else if (cmd === 'N') {
      waypoint.y += arg
    } else if (cmd === 'S') {
      waypoint.y -= arg
    } else if (cmd === 'E') {
      waypoint.x += arg
    } else if (cmd === 'W') {
      waypoint.x -= arg
    } else if (cmd === 'L') {
      if (arg === 90) {
        waypoint = {
          x: -waypoint.y,
          y: waypoint.x
        }
      } else if (arg === 270) {
        waypoint = {
          x: waypoint.y,
          y: -waypoint.x
        }
      } else if (arg === 180) {
        waypoint = {
          x: -waypoint.x,
          y: -waypoint.y
        }
      }
    } else if (cmd === 'R') {
      if (arg === 270) {
        waypoint = {
          x: -waypoint.y,
          y: waypoint.x
        }
      } else if (arg === 90) {
        waypoint = {
          x: waypoint.y,
          y: -waypoint.x
        }
      } else if (arg === 180) {
        waypoint = {
          x: -waypoint.x,
          y: -waypoint.y
        }
      }
    }
  })

  console.log('final position:', position)

  return Math.abs(position.x) + Math.abs(position.y)
}

// Test
deepStrictEqual(manhattanDistance([
  'F10',
  'N3',
  'F7',
  'R90',
  'F11'
]), 286)

console.log('distance:', manhattanDistance(DATA))
