const fs = require('fs')

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  let floor = 0
  for (let i = 0; i < data.length; ++i) {
    const c = data[i]
    if (c === '(') floor++
    else if (c === ')') floor--
  }
  return floor
}

console.log('result', run('./input'))
