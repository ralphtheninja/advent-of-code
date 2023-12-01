const { deepStrictEqual, notEqual } = require('assert')

function pickUp (current, cups) {
  const out = []
  let count = 0
  while (count < 3) {
    const index = cups.indexOf(current)
    notEqual(index, -1, 'current must exist')
    if (index >= 0 && index < cups.length - 1) {
      out.push(cups.splice(index + 1, 1)[0])
    } else if (index === cups.length - 1) {
      out.push(cups.splice(0, 1)[0])
    }
    count++
  }
  return out
}

deepStrictEqual(pickUp(3, [3, 8, 9, 1, 2, 5, 4, 6, 7]), [8, 9, 1])
deepStrictEqual(pickUp(1, [9, 2, 5, 4, 8, 1, 3, 6, 7]), [3, 6, 7])
deepStrictEqual(pickUp(9, [7, 2, 5, 8, 4, 1, 9, 3, 6]), [3, 6, 7])
deepStrictEqual(pickUp(2, [8, 3, 6, 7, 4, 1, 9, 2, 5]), [5, 8, 3])
deepStrictEqual(pickUp(6, [7, 4, 1, 5, 8, 3, 9, 2, 6]), [7, 4, 1])

function findDestination (current, cups) {
  let destination = current - 1
  while (destination >= 1) {
    const index = cups.indexOf(destination)
    if (index !== -1) {
      return destination
    }
    destination--
  }
  return cups.reduce((tot, el) => Math.max(tot, el), 0)
}

deepStrictEqual(findDestination(3, [3, 2, 5, 4, 6, 7]), 2)
deepStrictEqual(findDestination(2, [3, 2, 5, 4, 6, 7]), 7)
deepStrictEqual(findDestination(1, [9, 2, 5, 4, 8, 1]), 9)
deepStrictEqual(findDestination(9, [2, 5, 8, 4, 1, 9]), 8)
deepStrictEqual(findDestination(2, [6, 7, 4, 1, 9, 2]), 1)
deepStrictEqual(findDestination(6, [5, 8, 3, 9, 2, 6]), 5)
deepStrictEqual(findDestination(5, [5, 8, 3, 9, 2, 6]), 3)

function cupsResult (cups) {
  const str = cups.join('')
  const arr = str.split(1)
  arr.reverse()
  return arr.join('')
}

deepStrictEqual(cupsResult([5, 8, 3, 7, 4, 1, 9, 2, 6]), '92658374')
deepStrictEqual(cupsResult([5, 8, 3, 7, 4, 9, 2, 6, 1]), '58374926')

function moveCups (CUPS, MAX_MOVES) {
  let moves = 0
  const cups = CUPS.split('').map(Number)
  let current = cups[0]

  while (moves < MAX_MOVES) {
    const pick = pickUp(current, cups)
    const destination = findDestination(current, cups)
    const destinationIndex = cups.indexOf(destination)
    console.log('picked', pick)
    pick.reverse().forEach(el => cups.splice(destinationIndex + 1, 0, el))
    console.log('destination', destination, 'destination index', destinationIndex, 'cups after', cups)
    const currentIndex = cups.indexOf(current)
    const newCurrentIndex = currentIndex <= cups.length - 2 ? currentIndex + 1 : 0
    current = cups[newCurrentIndex]
    console.log('new current', current)
    moves++
  }

  return cupsResult(cups)
}

// deepStrictEqual(moveCups('389125467', 10), '92658374')
// deepStrictEqual(moveCups('389125467', 100), '67384529')
console.log('result:', moveCups('215694783', 100))
