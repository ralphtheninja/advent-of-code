const fs = require('fs')
const assert = require('assert')

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)

  // set the total state to 1 for each card, lets use indices for everything instead
  // of card numbers, the position in an array or a card number shouldn't matter
  const cardCount = {}
  for (let i = 0; i < lines.length; ++i) {
    cardCount[i] = 1
  }

  // results contains the number of wins
  const results = lines.map(line => {
    const cardData = line.split(/Card\s+\d+:\s+/g)[1]
    let [win, mine] = cardData.split('|')
    win = win.split(' ').filter(Boolean).map(Number)
    mine = mine.split(' ').filter(Boolean).map(Number)
    return mine.map(n => win.includes(n)).filter(Boolean).length
  })

  for (let card = 0; card < lines.length; ++card) {
    const noWins = results[card]
    const multiplicator = cardCount[card]
    for (let next = card + 1; next <= card + noWins; ++next) {
      if (next < lines.length) {
        cardCount[next] += multiplicator
      }
    }
  }

  return Object.keys(cardCount).map(key => cardCount[key]).reduce((t, i) => t + i, 0)
}

assert.equal(run('./input.test'), 30)
console.log('result', run('./input'))
