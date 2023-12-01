const fs = require('fs')
const assert = require('assert')

function findCommonLetter (group) {
  const [first, second, third] = group
  const length = first.length
  for (let i = 0; i < length; ++i) {
    const c = first[i]
    if (second.includes(c) && third.includes(c)) return c
  }
}

function charToPriority (char) {
  const code = char.charCodeAt(0)
  return code >= 97 ? code - 97 + 1 : code - 65 + 27
}

function computePriority (group) {
  return charToPriority(findCommonLetter(group))
}

function getGroups (sacks) {
  const groups = []
  const length = sacks.length
  let currentGroup = null
  for (let i = 0; i < length; ++i) {
    const sack = sacks[i]
    if (i % 3 === 0) {
      if (currentGroup) {
        groups.push(currentGroup)
      }
      currentGroup = []
    }
    currentGroup.push(sack)
  }
  groups.push(currentGroup)
  return groups
}

function run (file) {
  const sacks = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
  return getGroups(sacks).map(computePriority).reduce((tot, val) => tot + val, 0)
}

assert.equal(run('./test-data.txt'), 70)
console.log('total score', run('./data.txt'))
