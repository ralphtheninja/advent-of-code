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

const NEARBY_TICKETS = DATA[2].split('\n').slice(1).map(row => {
  return row.split(',').map(Number)
})

function fieldInRange (field, range) {
  return field >= range[0] && field <= range[1]
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

// Tests
const TEST_CLASSES = {
  class: [[1, 3], [5, 7]],
  row: [[6, 11], [33, 44]],
  seat: [[13, 40], [45, 50]]
}
deepStrictEqual(fieldInRange(7, [5, 7]), true)
deepStrictEqual(fieldInRange(7, [1, 3]), false)
deepStrictEqual(errorRate([7, 1, 4], TEST_CLASSES), 4)
deepStrictEqual(errorRate([7, 3, 47], TEST_CLASSES), 0)
deepStrictEqual(errorRate([40, 4, 50], TEST_CLASSES), 4)
deepStrictEqual(errorRate([55, 2, 20], TEST_CLASSES), 55)
deepStrictEqual(errorRate([38, 6, 12], TEST_CLASSES), 12)

function calculateErrorRate (tickets, classes) {
  return tickets.reduce((total, ticket) => {
    return errorRate(ticket, classes) + total
  }, 0)
}

const TEST_TICKETS = [
  [7, 3, 47],
  [40, 4, 50],
  [55, 2, 20],
  [38, 6, 12],
  [7, 3, 47]
]

deepStrictEqual(calculateErrorRate(TEST_TICKETS, TEST_CLASSES), 71)
console.log('error rate:', calculateErrorRate(NEARBY_TICKETS, CLASSES))
