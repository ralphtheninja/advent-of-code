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
  function isValid (k) {
    const found = passport.find(pair => pair[0] === k)
    if (!found) {
      return false
    }

    const [key, value] = found
    if (key === 'byr') {
      const byr = Number(value)
      return (value.length === 4 && byr >= 1920 && byr <= 2002)
    } else if (key === 'iyr') {
      const iyr = Number(value)
      return (value.length === 4 && iyr >= 2010 && iyr <= 2020)
    } else if (key === 'eyr') {
      const eyr = Number(value)
      return (value.length === 4 && eyr >= 2020 && eyr <= 2030)
    } else if (key === 'hgt') {
      if (value.endsWith('cm') || value.endsWith('in')) {
        const length = Number(value.slice(0, value.length - 2))
        const unit = value.slice(-2)
        if (unit === 'cm') {
          return (length >= 150 && length <= 193)
        } else if (unit === 'in') {
          return (length >= 59 && length <= 76)
        } else {
          console.log('invalid unit')
          return false
        }
      } else {
        return false
      }
    } else if (key === 'hcl') {
      return value.length === 7 && value.match(/#[0-9,a-f]{6}/)
    } else if (key === 'ecl') {
      return [
        'amb',
        'blu',
        'brn',
        'gry',
        'grn',
        'hzl',
        'oth',
      ].includes(value)
    } else if (key === 'pid') {
      return value.length === 9 && value.match(/[0-9]{9}/)
    } else {
      console.log('unknown key', key)
      return false
    }
  }
  return REQUIRED.filter(isValid).length === REQUIRED.length
}

const count = passports.map(p => {
  return p.split(/\s/).filter(Boolean).map(i => i.split(':'))
}).filter(isValidPassport).length

console.log('valid passports', count)
