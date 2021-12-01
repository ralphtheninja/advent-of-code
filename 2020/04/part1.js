const fs = require('fs')
const data = fs.readFileSync('./data.txt', 'utf8')
const passports = data.split('\n\n')

const REQUIRED = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid'
]

function isValidPassport (passport) {
  const keys = passport.split(/\s/).filter(Boolean).map(pair => {
    return pair.split(':')[0]
  })
  return REQUIRED.filter(key => keys.includes(key)).length === REQUIRED.length
}

console.log(passports.filter(isValidPassport).length)
