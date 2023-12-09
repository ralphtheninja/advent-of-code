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

console.log('next', next('hxbxxyzz'))
