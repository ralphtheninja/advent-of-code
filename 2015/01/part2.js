const fs = require('fs')

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  let floor = 0
  let i = 0

  for (; i < data.length; ++i) {
    const c = data[i]
    if (c === '(') floor++
    else if (c === ')') floor--

    if (floor === -1) {
      break
    }
  }

  return i + 1
}

console.log('result', run('./input'))
