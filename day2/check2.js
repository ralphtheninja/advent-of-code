const fs = require('fs')
const data = fs.readFileSync('./data.txt', 'utf8').split('\n')

let correctCount = 0

data.forEach(row => {
  if (row.length > 0) {
    const [prefix, password] = row.split(': ')
    const [range, letter] = prefix.split(' ')
    const [first, second] = range.split('-').map(Number)
    const firstValid = password[first - 1] === letter
    const secondValid = password[second - 1] === letter
    if ((firstValid && !secondValid) ||
        (!firstValid && secondValid)) {
      correctCount++
    }
  }
})

console.log('number of correct passwords', correctCount)
