const { deepStrictEqual } = require('assert')
const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean).map(Number)

function massToFuel (m) {
  return Math.floor(m / 3) - 2
}

deepStrictEqual(massToFuel(12), 2)
deepStrictEqual(massToFuel(14), 2)
deepStrictEqual(massToFuel(1969), 654)
deepStrictEqual(massToFuel(100756), 33583)

console.log('total fuel', DATA.reduce((tot, m) => tot + massToFuel(m), 0))
