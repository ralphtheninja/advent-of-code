const cardPubKey = 10441485
const doorPubKey = 1004920

function findLoopSize (sn, pubKey) {
  let value = 1
  let loopSize = 0
  while (value !== pubKey) {
    value = value * sn
    value = value % 20201227
    ++loopSize
  }
  return loopSize
}

const cardLoopSize = findLoopSize(7, cardPubKey)
console.log('card loop size', cardLoopSize)
const doorLoopSize = findLoopSize(7, doorPubKey)
console.log('door loop size', doorLoopSize)

function transform (sn, loopSize) {
  let value = 1
  for (let i = 0; i < loopSize; ++i) {
    value = value * sn
    value = value % 20201227
  }
  return value
}

const k1 = transform(doorPubKey, cardLoopSize)
const k2 = transform(cardPubKey, doorLoopSize)
console.log('k1', k1, 'k2', k2)
