const fs = require('fs')
const data = fs.readFileSync('./data.txt', 'utf8').split('\n')

function countLetter (letter, password) {
  let result = 0
  for (let i = 0; i < password.length; ++i) {
    if (password[i] === letter) result++
  }
  return result
}

let correctCount = 0

data.forEach(row => {
  if (row.length > 0) {
    const [prefix, password] = row.split(': ')
    const [range, letter] = prefix.split(' ')
    const [min, max] = range.split('-').map(Number)
    const count = countLetter(letter, password)
    if (count >= min && count <= max) {
      ++correctCount
    }
  }
})

console.log('number of correct passwords', correctCount)
