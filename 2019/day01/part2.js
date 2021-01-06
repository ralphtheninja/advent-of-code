const { deepStrictEqual } = require('assert')
const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean).map(Number)

function massToFuel (m) {
  return Math.floor(m / 3) - 2
}

function moduleToFuel (m) {
  let total = 0
  let fuel = m
  do {
    fuel = massToFuel(fuel)
    if (fuel > 0) total += fuel
  } while (fuel > 0)
  return total
}

deepStrictEqual(moduleToFuel(12), 2)
deepStrictEqual(moduleToFuel(1969), 966)
deepStrictEqual(moduleToFuel(100756), 50346)

console.log('total', DATA.reduce((tot, m) => tot + moduleToFuel(m), 0))
