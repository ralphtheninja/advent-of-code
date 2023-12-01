// const { deepStrictEqual } = require('assert')
const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n\n').filter(Boolean)

const player1 = DATA[0].split(':\n')[1].split('\n').filter(Boolean).map(Number)

const player2 = DATA[1].split(':\n')[1].split('\n').filter(Boolean).map(Number)

let round = 1
while (player1.length > 0 && player2.length > 0) {
  console.log('round', round, 'begins!')
  console.log(' player1 cards:', player1)
  console.log(' player2 cards:', player2)
  const card1 = player1.shift()
  const card2 = player2.shift()
  if (card1 > card2) {
    console.log(' player1 won', card1, '>', card2)
    player1.push(card1)
    player1.push(card2)
  } else if (card2 > card1) {
    console.log(' player2 won', card1, '<', card2)
    player2.push(card2)
    player2.push(card1)
  } else {
    throw new Error('draw should not happen')
  }
  round++
}

function computeScore (hand) {
  const reverseHand = hand.slice().reverse()
  return reverseHand.reduce((tot, card, i) => {
    const score = card * (i + 1)
    console.log('score for card', card, score)
    return tot + score
  }, 0)
}

if (player1.length > 0) {
  console.log('winning hand', player1)
  console.log('player 1 won with score', computeScore(player1))
} else if (player2.length > 0) {
  console.log('winning hand', player2)
  console.log('player 2 won with score', computeScore(player2))
}
