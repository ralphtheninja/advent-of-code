const { deepStrictEqual } = require('assert')
const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n\n').filter(Boolean)

const player1 = DATA[0].split(':\n')[1].split('\n').filter(Boolean).map(Number)
const player2 = DATA[1].split(':\n')[1].split('\n').filter(Boolean).map(Number)

function arrayEquals (lhs, rhs) {
  if (lhs.length !== rhs.length) return false
  for (let i = 0; i < lhs.length; ++i) {
    if (lhs[i] !== rhs[i]) return false
  }
  return true
}

deepStrictEqual(arrayEquals([1, 2, 3], [1, 2, 3]), true)
deepStrictEqual(arrayEquals([1, 2, 3], [2, 3]), false)

function playGame (p1, p2, depth = 0) {
  const history = []

  let prefix = ''
  for (let i = 0; i < depth; ++i) prefix += ' '
  console.log(prefix + 'NEW GAME', p1, p2, 'with depth', depth)

  function infinite () {
    // TODO check if (p1, p2) exists in history array, if so return true
    for (let i = 0; i < history.length; ++i) {
      const h = history[i]
      if (arrayEquals(h[0], p1) && arrayEquals(h[1], p2)) {
        console.log('Found infinite game!')
        return true
      }
    }
    return false
  }

  while (p1.length > 0 && p2.length > 0) {
    if (infinite()) {
      return { won: 'p1', cards: p1 }
    } else {
      // New configuration. Draw cards!
      history.push([p1.slice(), p2.slice()])
      const c1 = p1.shift()
      const c2 = p2.shift()
      console.log(prefix + 'DREW cards', c1, 'and', c2)
      if (p1.length >= c1 && p2.length >= c2) {
        console.log(prefix + 'RECURSIVE game')
        const sub = playGame(p1.slice(0, c1), p2.slice(0, c2), depth + 1)
        if (sub.won === 'p1') {
          p1.push(c1)
          p1.push(c2)
        } else if (sub.won === 'p2') {
          p2.push(c2)
          p2.push(c1)
        }
      } else {
        if (c1 > c2) {
          console.log(prefix + ' player1 won', c1, '>', c2)
          p1.push(c1)
          p1.push(c2)
        } else if (c2 > c1) {
          console.log(prefix + ' player2 won', c1, '<', c2)
          p2.push(c2)
          p2.push(c1)
        }
      }
    }
  }

  if (p1.length > 0) {
    return { won: 'p1', cards: p1 }
  } else if (p2.length > 0) {
    return { won: 'p2', cards: p2 }
  }
}

function computeScore (hand) {
  const reverseHand = hand.slice().reverse()
  return reverseHand.reduce((tot, card, i) => {
    return tot + card * (i + 1)
  }, 0)
}

// const INF_TEST = {
//   p1: [43, 19],
//   p2: [2, 29, 14]
// }

// const TEST = {
//   p1: [9, 2, 6, 3, 1],
//   p2: [5, 8, 4, 7, 10]
// }

// const inf = playGame(INF_TEST.p1, INF_TEST.p2)
// deepStrictEqual(inf.won, 'p1')

// const test = playGame(TEST.p1, TEST.p2)
// deepStrictEqual(test.won, 'p2')
// deepStrictEqual(test.cards, [7, 5, 6, 2, 4, 1, 10, 8, 9, 3])
// deepStrictEqual(computeScore(test.cards), 291)

const res = playGame(player1, player2)
console.log('player', res.won, 'won!')
console.log('score is', computeScore(res.cards))
