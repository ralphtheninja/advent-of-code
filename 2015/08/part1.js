const fs = require('fs')

function parse (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  return { lines }
}

const app = parse('./input')

const codeCount = app.lines.map(line => line.length).reduce((t, i) => t + i, 0)
const memCount = app.lines.map(line => {
  let count = 0
  let i = 0
  while (i < line.length) {
    const c = line[i]
    if (c === '\\') {
      i++
      if (line[i] === '\\' || line[i] === '"') {
        i++
        count++
      } else if (line[i] === 'x') {
        i += 3
        count++
      }
    } else if (c !== '"') {
      i++
      count++
    } else {
      i++
    }
  }
  return count
}).reduce((t, i) => t + i, 0)

console.log('diff', codeCount - memCount)
