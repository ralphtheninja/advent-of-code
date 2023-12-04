const fs = require('fs')

function hasValidPairs (str) {
  const count = {}
  let prevPair = ''
  for (let i = 0; i < str.length - 1; ++i) {
    const l = str[i]
    const r = str[i + 1]
    const pair = l + r
    if (pair !== prevPair) {
      if (count[pair]) count[pair]++
      else count[pair] = 1
      prevPair = pair
    } else {
      prevPair = ''
    }
  }
  const hasPairs = Object.keys(count).map(k => {
    return { k, c: count[k] }
  }).filter(({ c }) => c >= 2)
  return [hasPairs.length > 0, hasPairs]
}

function hasRepeatingLetters (str) {
  for (let i = 0; i < str.length - 2; ++i) {
    const l = str[i]
    const m = str[i + 1]
    const r = str[i + 2]
    if (l === r) {
      return [true, l + m + r]
    }
  }
  return [false]
}

function isNice (str) {
  return hasValidPairs(str)[0] && hasRepeatingLetters(str)[0]
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  return lines.map(line => {
    const [hasPairs] = hasValidPairs(line)
    const [hasRepeat] = hasRepeatingLetters(line)
    const isNice = hasPairs && hasRepeat
    return { line, hasPairs, hasRepeat, isNice }
  }).filter(({ isNice }) => isNice).length
}

const assert = require('assert')

assert.equal(hasValidPairs('xxxx')[0], true)
assert.equal(hasValidPairs('xxxx')[1][0].k, 'xx')
assert.equal(hasValidPairs('xyxy')[0], true)
assert.equal(hasValidPairs('xyxy')[1][0].k, 'xy')
assert.equal(hasValidPairs('aabcdefgaa')[0], true)
assert.equal(hasValidPairs('aabcdefgaa')[1][0].k, 'aa')
assert.equal(hasValidPairs('uurcxstgmygtbstg')[0], true)
assert.equal(hasValidPairs('uurcxstgmygtbstg')[1][0].k, 'st')
assert.equal(hasValidPairs('uurcxstgmygtbstg')[1][1].k, 'tg')
assert.equal(hasValidPairs('aaa')[0], false)
assert.equal(hasValidPairs('aaaa')[0], true)

assert.equal(hasRepeatingLetters('xyx')[0], true)
assert.equal(hasRepeatingLetters('xyx')[1], 'xyx')
assert.equal(hasRepeatingLetters('abcdefeghi')[0], true)
assert.equal(hasRepeatingLetters('abcdefeghi')[1], 'efe')
assert.equal(hasRepeatingLetters('aaa')[0], true)
assert.equal(hasRepeatingLetters('aaa')[1], 'aaa')
assert.equal(hasRepeatingLetters('ieodomkazucvgmuy')[0], true)
assert.equal(hasRepeatingLetters('ieodomkazucvgmuy')[1], 'odo')

assert.equal(isNice('qjhvhtzxzqqjkmpb'), true)
assert.equal(isNice('xxyxx'), true)
assert.equal(isNice('uurcxstgmygtbstg'), false)
assert.equal(isNice('ieodomkazucvgmuy'), false)

console.log('result', run('./input'))
