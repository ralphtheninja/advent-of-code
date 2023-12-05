const fs = require('fs')

function parseCoord (coord) {
  const [x, y] = coord.split(',').map(Number)
  return { x, y }
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const lightMap = {}
  const instructions = lines.map(line => {
    const split = line.split(' ')
    if (split[0] === 'toggle') {
      return {
        op: split[0],
        from: parseCoord(split[1]),
        to: parseCoord(split[3])
      }
    } else {
      return {
        op: split[1],
        from: parseCoord(split[2]),
        to: parseCoord(split[4])
      }
    }
  })

  for (const { op, from, to } of instructions) {
    console.log(op, from, to)
    for (let x = from.x; x <= to.x; ++x) {
      for (let y = from.y; y <= to.y; ++y) {
        const coord = `${x},${y}`
        if (op === 'on') {
          lightMap[coord] = true
        } else if (op === 'off') {
          lightMap[coord] = false
        } else if (op === 'toggle') {
          if (!lightMap[coord]) lightMap[coord] = true
          else lightMap[coord] = false
        }
      }
    }
  }

  return Object.keys(lightMap).map(key => lightMap[key]).filter(Boolean).length
}

console.log('result', run('./input'))
