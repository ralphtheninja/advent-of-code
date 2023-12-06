const fs = require('fs')

function parse (file) {
  const data = fs.readFileSync(file, 'utf8')
  return data.split('\n').filter(Boolean)
}

// const lines = parse('./input.test')
const lines = parse('./input')
console.log(lines)

const codeCount = lines.map(line => line.length).reduce((t, i) => t + i, 0)
const encodeCount = lines.map(line => {
  let count = 0
  let i = 0
  console.log('checking line', line)
  while (i < line.length) {
    const c = line[i]
    if (c === '"') {
      // This should happen at the beginning and end of a string
      // console.log('found "')
      count += 2
      i++
    } else if (c === '\\') {
      // When we find an escape, we need to parse it
      // console.log('found \\')
      count += 2
      i++
      if (line[i] === '\\' || line[i] === '"') {
        count += 2
        i++
      } else if (line[i] === 'x') {
        count += 3
        i += 3
      }
    } else {
      // A normal character
      count++
      i++
    }
  }
  // + 2 for enclosing ""
  return count + 2
}).reduce((t, i) => t + i, 0)

// const assert = require('assert')
// assert.equal(encodeCount, 42)
// assert.equal(codeCount, 23)

console.log('diff', encodeCount - codeCount)
