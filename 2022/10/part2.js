const fs = require('fs')
const assert = require('assert')

function run (file) {
  const data = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(row => {
    const [op, val] = row.split(' ')
    if (val) {
      return { op, val: Number(val) }
    } else {
      return { op }
    }
  })

  let x = 1
  const history = []

  data.forEach(({ op, val }, i) => {
    const length = history.length
    if (op === 'addx') {
      history.push(x)
      history.push(x)
      x = x + val
    } else if (op === 'noop') {
      history.push(x)
    }
  })

  for (let row = 0; row < 6; ++row) {
    const start = row * 40
    const slice = history.slice(start, start + 40)
    let output = ''
    for (let pixel = 0; pixel < 40; ++pixel) {
      const sprite = slice[pixel]
      if (pixel >= sprite - 1 && pixel <= sprite + 1) {
        output += '#'
      } else {
        output += '.'
      }
    }
    console.log(output)
  }
}

//run('./test-data.txt')
run('./data.txt')
