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
      const s1 = w * h
      const s2 = w * l
      const s3 = h * l
      const extra = Math.min(s1, s2, s3)
      return 2 * (s1 + s2 + s3) + extra
    }).reduce((tot, area) => tot + area, 0)
}

console.log('result', run('./input'))
