const fs = require('fs')

function parse (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const t = lines[0].split(/\s+/).slice(1).map(Number)
  const d = lines[1].split(/\s+/).slice(1).map(Number)
  const races = []
  for (let i = 0; i < t.length; ++i) {
    races.push({ t: t[i], d: d[i] })
  }
  return races
}

function numberOfBeats (maxT, record) {
  let number = 0
  for (let t = 0; t <= maxT; t++) {
    const speed = t
    const distance = (maxT - t) * speed
    if (distance > record) number++
  }
  return number
}

// const races = parse('./input.test')
const races = parse('./input')
const numbers = races.map(race => {
  const maxT = race.t
  const record = race.d
  return numberOfBeats(maxT, record)
})
const mult = numbers.reduce((t, n) => t * n, 1)

// const assert = require('assert')
// assert.equal(mult, 288)

console.log('result', mult)
