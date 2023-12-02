const fs = require('fs')

function parseSets (line) {
  return line.split(': ')[1].split('; ').map(s => {
    return s.split(', ').reduce((tot, item) => {
      const [number, color] = item.split(' ')
      return {
        ...tot,
        [color]: tot[color] + Number(number)
      }
    }, { red: 0, blue: 0, green: 0 })
  })
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const games = lines.map((line, i) => {
    return {
      id: i + 1,
      sets: parseSets(line)
    }
  })
  const fewest = games.map(g => {
    const maxRed = g.sets.reduce((max, i) => {
      return i.red > max ? i.red : max
    }, 0)
    const maxBlue = g.sets.reduce((max, i) => {
      return i.blue > max ? i.blue : max
    }, 0)
    const maxGreen = g.sets.reduce((max, i) => {
      return i.green > max ? i.green : max
    }, 0)
    return { maxRed, maxBlue, maxGreen }
  })
  const powers = fewest.map(g => g.maxRed * g.maxBlue * g.maxGreen)
  return powers.reduce((tot, power) => tot + power, 0)
}

const assert = require('assert')
run('./test-data.txt')
assert.equal(run('./test-data.txt'), 2286)
console.log('result', run('./data.txt'))
