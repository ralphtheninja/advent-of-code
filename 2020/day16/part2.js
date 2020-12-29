const { deepStrictEqual } = require('assert')
const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n\n').filter(Boolean)
const CLASSES = {}

DATA[0].split('\n').forEach(row => {
  const [key, value] = row.split(': ')
  const intervals = value.split(' or ').map(interval => {
    const [from, to] = interval.split('-')
    return [Number(from), Number(to)]
  })
  CLASSES[key] = intervals
})

const MY_TICKET = DATA[1].split('\n')[1].split(',').map(Number)
const NEARBY_TICKETS = DATA[2].split('\n').slice(1).filter(Boolean).map(row => {
  return row.split(',').map(Number)
})

function fieldInRange (field, range) {
  return field >= range[0] && field <= range[1]
}

function fieldInClass (field, ranges) {
  return ranges.some(range => fieldInRange(field, range))
}

function errorRate (ticket, classes) {
  return ticket.reduce((total, field) => {
    if (Object.values(classes).some(ranges => {
      return ranges.some(range => fieldInRange(field, range))
    })) {
      return total
    } else {
      return total + field
    }
  }, 0)
}

const validTickets = NEARBY_TICKETS.filter(ticket => errorRate(ticket, CLASSES) === 0)

const numberOfFields = validTickets[0].length

const allMatches = {}
Object.keys(CLASSES).forEach(key => {
  const ranges = CLASSES[key]
  const matches = []
  for (let i = 0; i < numberOfFields; ++i) {
    if (validTickets.every(ticket => fieldInClass(ticket[i], ranges))) {
      matches.push(i)
    }
  }
  allMatches[key] = matches
})

const filteredMatches = []
while (filteredMatches.length < numberOfFields) {
  const found = Object.keys(allMatches).find(key => allMatches[key].length === 1)
  if (found) {
    const values = allMatches[found]
    const fieldIndex = values[0]
    filteredMatches.push({ key: found, fieldIndex })
    delete allMatches[found]

    Object.keys(allMatches).forEach(key => {
      const values = allMatches[key]
      values.splice(values.indexOf(fieldIndex), 1)
    })
  }
}

console.log(filteredMatches)
console.log('product:', filteredMatches.filter(f => f.key.startsWith('departure')).map(f => f.fieldIndex).map(i => MY_TICKET[i]).reduce((total, value) => total * value, 1))
