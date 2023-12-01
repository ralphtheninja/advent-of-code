// const { deepStrictEqual } = require('assert')

/**
 * Clearly rewriting and searching arrays of 1M and doing this 10M times
 * will take a lot of time. So lets build a circular list instead.
 * We still might need to search for destination elements, but picking out
 * and re-inserting the three elements should only be about changing
 * 'pointer' values.
 * Now each element is of the form { value, prev, next } where
 * - value i the value
 * - prev points to the previous element in the list
 * - next points to the next element in the list
 */
function moveCups (CUPS, MAX_MOVES) {
  const temp = CUPS.split('').map(Number)
  for (let i = 10; i <= 1000000; ++i) {
    temp.push(i)
  }

  // Index that takes a value and points to the corresponding
  // element object (with .value, .prev and .next)
  const index = {}

  // Build circular list where current points to the first element
  // all sub sequent elements points previous element to it so thereby
  // setting it's own p and the previous n correctly.
  // At the end of the list we hook the last element together with
  // the first element (current)
  let current = { value: temp[0], next: null, prev: null }
  index[current.value] = current
  let prev = current
  let maxValue = 0

  temp.forEach((value, i) => {
    if (i > 0) {
      const el = { value, next: null, prev }
      index[value] = el
      el.prev.next = el
      prev = el
      if (i === temp.length - 1) {
        el.next = current
        current.prev = el
      }
    }
    maxValue = Math.max(maxValue, value)
  })

  function findDestination (current, picked) {
    let destinationValue = current.value - 1
    while (destinationValue >= 1 &&
           picked.includes(destinationValue)) {
      destinationValue--
    }
    if (destinationValue !== 0) {
      return index[destinationValue]
    } else {
      destinationValue = maxValue
      while (destinationValue >= 1 &&
             picked.includes(destinationValue)) {
        destinationValue--
      }
      return index[destinationValue]
    }
  }

  let moves = 0
  while (moves < MAX_MOVES) {
    // Pick out three linked elements after current
    const pickStart = current.next
    const pickEnd = pickStart.next.next
    const picked = [
      pickStart.value,
      pickStart.next.value,
      pickEnd.value
    ]
    current.next = pickEnd.next
    pickEnd.next.prev = current

    // Find destination and link in picked elements after it
    const destination = findDestination(current, picked)
    pickEnd.next = destination.next
    destination.next.prev = pickEnd
    pickStart.prev = destination
    destination.next = pickStart

    current = current.next
    moves++
  }

  const one = index[1]
  return one.next.value * one.next.next.value
}

// deepStrictEqual(moveCups('389125467', 10000000), 934001 * 159792)
console.log('result:', moveCups('215694783', 10000000))
