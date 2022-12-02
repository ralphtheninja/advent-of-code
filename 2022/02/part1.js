const fs = require('fs')
const assert = require('assert')

const ROCK = 1
const PAPER = 2
const SCISSORS = 3

const isDraw = ({ opp, me }) => opp === me
const iLose = ({ opp, me }) => ((me === ROCK && opp === PAPER) ||
                                (me === PAPER && opp === SCISSORS) ||
                                (me === SCISSORS && opp === ROCK))
const iWin = (match) => !iLose(match)

function matchScore (match) {
  if (isDraw(match)) return 3 + match.me
  else if (iLose(match)) return 0 + match.me
  else if (iWin(match)) return 6 + match.me
  else throw new Error('should not happen')
}

function handToNumber (hand) {
  if (hand === 'A' || hand === 'X') return ROCK
  else if (hand === 'B' || hand === 'Y') return PAPER
  else if (hand === 'C' || hand === 'Z') return SCISSORS
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const matches = data.split('\n').filter(Boolean).map(row => {
    const [ oppHand, myHand ] = row.split(' ')
    return { opp: handToNumber(oppHand), me: handToNumber(myHand) }
  })
  return matches.map(matchScore).reduce((tot, val) => tot + val, 0)
}


assert.equal(isDraw({ opp: ROCK, me: ROCK }), true)
assert.equal(isDraw({ opp: PAPER, me: PAPER }), true)
assert.equal(isDraw({ opp: SCISSORS, me: SCISSORS }), true)

assert.equal(iLose({ opp: PAPER, me: ROCK }), true)
assert.equal(iLose({ opp: SCISSORS, me: PAPER }), true)
assert.equal(iLose({ opp: ROCK, me: SCISSORS }), true)

assert.equal(iWin({ opp: SCISSORS, me: ROCK }), true)
assert.equal(iWin({ opp: ROCK, me: PAPER }), true)
assert.equal(iWin({ opp: PAPER, me: SCISSORS }), true)

assert.equal(run('./test-data.txt'), 15)
console.log('total score', run('./data.txt'))
