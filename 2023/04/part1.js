const fs = require('fs')
const assert = require('assert')

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const cards = lines.map(line => {
    const cardData = line.split(/Card\s+\d+:\s+/g)[1]
    let [win, mine] = cardData.split('|')
    win = win.split(' ').filter(Boolean).map(Number)
    mine = mine.split(' ').filter(Boolean).map(Number)
    return { win, mine }
  })
  const games = cards.map(({ win, mine }) => {
    return mine.filter(my => win.includes(my))
  })
  return games.map(game => game.length)
    .filter(l => l > 0)
    .map(l => 2 ** (l - 1))
    .reduce((tot, i) => tot + i, 0)
}

assert.equal(run('./input.test'), 13)
console.log('result', run('./input'))
