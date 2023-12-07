const fs = require('fs')

const CARDS = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
}

const TYPES = {
  FIVE_OF_A_KIND: 7,
  FOUR_OF_A_KIND: 6,
  FULL_HOUSE: 5,
  THREE_OF_A_KIND: 4,
  TWO_PAIR: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1,
  NONE: 0
}

function getHandType (hand) {
  const map = {}
  for (let i = 0; i < hand.length; ++i) {
    const c = hand[i]
    if (!map[c]) map[c] = 1
    else map[c]++
  }
  const v = Object.keys(map).map(k => map[k])
  v.sort()
  if (v.length === 1 && v[0] === 5) {
    return 'FIVE_OF_A_KIND'
  } else if (v.length === 2 && v[0] === 1 && v[1] === 4) {
    return 'FOUR_OF_A_KIND'
  } else if (v.length === 2 && v[0] === 2 && v[1] === 3) {
    return 'FULL_HOUSE'
  } else if (v.length === 3 && v[0] === 1 && v[1] === 1 && v[2] === 3) {
    return 'THREE_OF_A_KIND'
  } else if (v.length === 3 && v[0] === 1 && v[1] === 2 && v[2] === 2) {
    return 'TWO_PAIR'
  } else if (v.length === 4 && v[0] === 1 && v[1] === 1 && v[2] === 1 && v[3] === 2) {
    return 'ONE_PAIR'
  } else if (v.length === 5 && v[0] === 1 && v[1] === 1 && v[2] === 1 && v[3] === 1 && v[4] === 1) {
    return 'HIGH_CARD'
  } else {
    return 'NONE'
  }
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const hands = lines.map(line => {
    const split = line.split(' ')
    const hand = split[0]
    const bid = Number(split[1])
    return { hand, bid, type: getHandType(hand) }
  })
  const sortedHands = hands.slice().sort((l, r) => {
    const lValue = TYPES[l.type]
    const rValue = TYPES[r.type]
    if (lValue > rValue) return 1
    else if (lValue < rValue) return -1
    else {
      for (let i = 0; i < 5; ++i) {
        const lCard = CARDS[l.hand[i]]
        const rCard = CARDS[r.hand[i]]
        if (lCard > rCard) return 1
        else if (lCard < rCard) return -1
      }
      return 0
    }
  })
  return sortedHands
    .map((hand, i) => hand.bid * (i + 1))
    .reduce((t, v) => t + v, 0)
}

const assert = require('assert')
assert.equal(run('./input.test'), 6440)

console.log('result', run('./input'))
