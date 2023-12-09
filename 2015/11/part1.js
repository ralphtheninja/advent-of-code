const assert = require('assert')

const A = 'a'.charCodeAt()
const Z = 'z'.charCodeAt()

const TRIPPLETS = []

for (let c = A; c <= Z - 2; ++c) {
  const l = String.fromCharCode(c)
  const m = String.fromCharCode(c + 1)
  const r = String.fromCharCode(c + 2)
  TRIPPLETS.push(`${l}${m}${r}`)
}

function hasIllegalVowels (password) {
  return !!password.match(/i|o|l/)
}

function hasEnoughDoubleLetters (str) {
  let count = 0
  for (let c = A; c <= Z; ++c) {
    const C = String.fromCharCode(c)
    if (str.includes(`${C}${C}`)) count++
  }
  return count >= 2
}

function hasValidTripplet (str) {
  return TRIPPLETS.some(tri => str.includes(tri))
}

function isValid (password) {
  if (!hasValidTripplet(password)) return false
  if (hasIllegalVowels(password)) return false
  if (!hasEnoughDoubleLetters(password)) return false
  return true
}

function increment (str) {
  if (!str) {
    // Recursing down with an empty 'head' means it should bump to 'a'
    return 'a'
  }
  const split = str.split('')
  const lastCode = split[split.length - 1].charCodeAt()
  if (lastCode < Z) {
    split[split.length - 1] = String.fromCharCode(lastCode + 1)
    return split.join('')
  } else {
    const head = split.slice(0, split.length - 1)
    return increment(head.join('')) + String.fromCharCode(A)
  }
}

function next (password) {
  console.log('password', password)
  let result = password
  let count = 0
  do {
    result = increment(result)
    count++
    console.log(' ->', result)
  } while (!isValid(result))
  console.log(' count', count)
  return result
}

assert.equal(hasIllegalVowels('aaaoo'), true)
assert.equal(hasIllegalVowels('bbibb'), true)
assert.equal(hasIllegalVowels('bblllbiao'), true)
assert.equal(hasIllegalVowels('hijklmmn'), true)

assert.equal(hasEnoughDoubleLetters('hijklmmn'), false)
assert.equal(hasEnoughDoubleLetters('ghijklmn'), false)
assert.equal(hasEnoughDoubleLetters('abbceffg'), true)

assert.equal(hasValidTripplet('hijklmmn'), true)
assert.equal(hasValidTripplet('abbceffg'), false)
assert.equal(hasValidTripplet('abbcefgh'), true)
assert.equal(hasValidTripplet('abbcegjk'), false)
assert.equal(hasValidTripplet('abcdefgh'), true)

assert.equal(isValid('hijklmmn'), false)
assert.equal(isValid('ghijklmn'), false)
assert.equal(isValid('abbceffg'), false)
assert.equal(isValid('abbcegjk'), false)
assert.equal(isValid('hijklmmn'), false)
assert.equal(isValid('hxbxwxba'), false)
assert.equal(isValid('abcdffaa'), true)
assert.equal(isValid('ghjaabcc'), true)

assert.equal(increment('aa'), 'ab')
assert.equal(increment('xx'), 'xy')
assert.equal(increment('xy'), 'xz')
assert.equal(increment('xz'), 'ya')
assert.equal(increment('ya'), 'yb')
assert.equal(increment('xzzz'), 'yaaa')
assert.equal(increment('z'), 'aa')
assert.equal(increment('zz'), 'aaa')
assert.equal(increment('zzzzzzzzzz'), 'aaaaaaaaaaa')

// assert.equal(next('abcdefgh'), 'abcdffaa')
// assert.equal(next('ghijklmn'), 'ghjaabcc')

console.log('next', next('hxbxwxba'))
