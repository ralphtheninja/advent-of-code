const fs = require('fs')

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const map = { '0,0': 2 }
  const santa = { x: 0, y: 0 }
  const robot = { x: 0, y: 0 }
  for (let i = 0; i < data.length; i++) {
    const mover = i % 2 ? santa : robot
    switch (data[i]) {
      case '^':
        mover.y++
        break
      case 'v':
        mover.y--
        break
      case '>':
        mover.x++
        break
      case '<':
        mover.x--
        break
    }
    if (map[`${mover.x},${mover.y}`]) map[`${mover.x},${mover.y}`]++
    else map[`${mover.x},${mover.y}`] = 1
  }
  return Object.keys(map).length
}

console.log('result', run('./input'))
