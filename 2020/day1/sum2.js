// read file, find three numbers that sum to 2020 and multiply them
const fs = require('fs')

const data = fs.readFileSync('./data.txt', 'utf8')
const numbers = data.split('\n').map(Number)
numbers.forEach(n => console.log(n))

for (let i = 0; i < numbers.length; ++i) {
  for (let j = i; j < numbers.length; ++j) {
    for (let k = j; k < numbers.length; ++k) {
      if (numbers[i] + numbers[j] + numbers[k] === 2020) {
        console.log('number 1: ', numbers[i], i)
        console.log('number 2: ', numbers[j], j)
        console.log('number 3: ', numbers[k], k)
        console.log('result: ', numbers[i] * numbers[j] * numbers[k])
      }
    }
  }
}

// Seems last row turns into 0 so not valid.
