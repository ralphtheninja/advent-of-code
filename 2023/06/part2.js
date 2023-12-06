const fs = require('fs')

function parse (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const t = Number(lines[0].split(/\s+/).slice(1).join(''))
  const d = Number(lines[1].split(/\s+/).slice(1).join(''))
  return { t, d }
}

// const race = parse('./input.test')
const race = parse('./input')

console.log('calculating race t:', race.t, 'd:', race.d)

let number = 0
for (let t = 0; t <= race.t; t++) {
  const speed = t
  const distance = (race.t - t) * speed
  if (distance > race.d) number++
}

// const assert = require('assert')
// assert.equal(number, 71503)

console.log('result', number)
