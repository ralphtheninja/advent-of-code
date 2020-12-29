// read file, find two numbers that sum to 2020 and multiply them
const fs = require('fs')
const data = fs.readFileSync('./data.txt', 'utf8')
const numbers = data.split('\n').map(Number)

for (let i = 0; i < numbers.length; ++i) {
  for (let j = i; j < numbers.length; ++j) {
    if (numbers[i] + numbers[j] === 2020) {
      console.log('result: ', numbers[i] * numbers[j])
      process.exit(0)
    }
  }
}
