const fs = require('fs')

const MAX_RED = 12
const MAX_GREEN = 13
const MAX_BLUE = 14

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
  const possible = games.filter(game => {
    return game.sets.every(set => {
      return set.red <= MAX_RED && set.green <= MAX_GREEN && set.blue <= MAX_BLUE
    })
  })
  return possible.map(g => g.id).reduce((tot, i) => tot + i, 0)
}

const assert = require('assert')
assert.equal(run('./test-data.txt'), 8)
console.log('result', run('./data.txt'))
