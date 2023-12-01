const fs = require('fs')
const assert = require('assert')

const ROCK = 1
const PAPER = 2
const SCISSORS = 3

const shouldDraw = match => match.outcome === 'Y'
const shouldLose = match => match.outcome === 'X'
const shouldWin = match => match.outcome === 'Z'

function winning (opp) {
  switch (opp) {
    case ROCK:
      return PAPER
    case PAPER:
      return SCISSORS
    case SCISSORS:
      return ROCK
    default:
      throw new Error('should not happen')
  }
}

function losing (opp) {
  switch (opp) {
    case ROCK:
      return SCISSORS
    case PAPER:
      return ROCK
    case SCISSORS:
      return PAPER
    default:
      throw new Error('should not happen')
  }
}

function matchScore (match) {
  if (shouldDraw(match)) return 3 + match.opp
  else if (shouldLose(match)) return losing(match.opp)
  else if (shouldWin(match)) return 6 + winning(match.opp)
  else throw new Error('should not happen')
}

function handToNumber (hand) {
  if (hand === 'A') return ROCK
  else if (hand === 'B') return PAPER
  else if (hand === 'C') return SCISSORS
  else throw new Error('should not happen')
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const matches = data.split('\n').filter(Boolean).map(row => {
    const [oppHand, outcome] = row.split(' ')
    return { opp: handToNumber(oppHand), outcome }
  })
  return matches.map(matchScore).reduce((tot, val) => tot + val, 0)
}

assert.equal(winning(ROCK), PAPER)
assert.equal(winning(PAPER), SCISSORS)
assert.equal(winning(SCISSORS), ROCK)

assert.equal(losing(ROCK), SCISSORS)
assert.equal(losing(PAPER), ROCK)
assert.equal(losing(SCISSORS), PAPER)

assert.equal(run('./test-data.txt'), 12)
console.log('total score', run('./data.txt'))
