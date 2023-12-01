const fs = require('fs')

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const digits = lines.map(line => {
    let first, last
    for (let i = 0; i < line.length; ++i) {
      const c = line[i]
      if (!first) {
        if (!isNaN(Number(c))) {
          first = Number(c)
        }
      } else {
        if (!isNaN(Number(c))) {
          last = Number(c)
        }
      }
    }
    if (!last) last = first
    return 10 * first + last
  })
  return digits.reduce((tot, el) => tot + el, 0)
}

// const assert = require('assert')
// assert.equal(run('./test-data.txt'), 142)
console.log('result', run('./data.txt'))
