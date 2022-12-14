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

  return [20, 60, 100, 140, 180, 220].map(pos => pos * history[pos - 1]).reduce((tot, val) => tot + val, 0)
}

//assert.equal(run('./test-data.txt'), 13140)
console.log('result', run('./data.txt'))
