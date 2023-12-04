const fs = require('fs')

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const map = { '0,0': 1 }
  let x = 0
  let y = 0
  for (let i = 0; i < data.length; i++) {
    switch (data[i]) {
      case '^':
        y++
        break
      case 'v':
        y--
        break
      case '>':
        x++
        break
      case '<':
        x--
        break
    }
    if (map[`${x},${y}`]) map[`${x},${y}`]++
    else map[`${x},${y}`] = 1
  }
  return Object.keys(map).length
}

console.log('result', run('./input'))
