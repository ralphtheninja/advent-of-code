const fs = require('fs')

function hasEnoughVowels (str) {
  let count = 0
  for (let i = 0; i < str.length; ++i) {
    switch (str[i]) {
      case 'a':
      case 'e':
      case 'i':
      case 'o':
      case 'u':
        count++
        break
      default:
        break
    }
  }
  return count >= 3
}

function hasDoubleLetters (str) {
  for (let i = 0; i < str.length - 1; ++i) {
    const c = str[i]
    const next = str[i + 1]
    if (c === next) {
      return true
    }
  }
  return false
}

function hasInvalidSubstrings (str) {
  return !!str.match(/ab|cd|pq|xy/)
}

function isNice (str) {
  return (hasEnoughVowels(str) &&
          hasDoubleLetters(str) &&
          !hasInvalidSubstrings(str))
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  return lines.map(isNice).filter(Boolean).length
}

const assert = require('assert')

assert.equal(hasEnoughVowels('bb'), false)
assert.equal(hasEnoughVowels('aaa'), true)
assert.equal(hasEnoughVowels('aey'), false)
assert.equal(hasEnoughVowels('aeiou'), true)
assert.equal(hasEnoughVowels('aey'), false)
assert.equal(hasEnoughVowels('aei'), true)
assert.equal(hasEnoughVowels('xazegov'), true)
assert.equal(hasEnoughVowels('aeiouaeiouaeiou'), true)

assert.equal(hasDoubleLetters('bb'), true)
assert.equal(hasDoubleLetters('abc'), false)
assert.equal(hasDoubleLetters('abccd'), true)
assert.equal(hasDoubleLetters('abcdde'), true)
assert.equal(hasDoubleLetters('xx'), true)

assert.equal(hasInvalidSubstrings('abccd'), true)
assert.equal(hasInvalidSubstrings('foocd'), true)
assert.equal(hasInvalidSubstrings('pqfoo'), true)
assert.equal(hasInvalidSubstrings('haegwjzuvuyypxyu'), true)
assert.equal(hasInvalidSubstrings('bb'), false)

assert.equal(isNice('ugknbfddgicrmopn'), true)
assert.equal(isNice('aaa'), true)
assert.equal(isNice('jchzalrnumimnmhp'), false)
assert.equal(isNice('haegwjzuvuyypxyu'), false)
assert.equal(isNice('dvszwmarrgswjxmb'), false)

console.log('result', run('./input'))
