const fs = require('fs')

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const boxes = lines.map(line => {
    const [w, h, l] = line.split('x').map(Number)
    return { w, h, l }
  })
  return boxes
    .map(({ w, h, l }) => {
      const p1 = 2 * w + 2 * h
      const p2 = 2 * w + 2 * l
      const p3 = 2 * h + 2 * l
      const wrap = Math.min(p1, p2, p3)
      const bow = w * h * l
      return wrap + bow
    }).reduce((tot, area) => tot + area, 0)
}

// console.log('result', run('./input.test'))
console.log('result', run('./input'))
