const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)

// It's pretty evident that we can't brute force the timestamps.
// We have the following buses:

// t      -> 17
// t + 11 -> 37
// t + 17 -> 571
// t + 35 -> 13
// t + 40 -> 23
// t + 46 -> 29
// t + 48 -> 401
// t + 58 -> 41
// t + 67 -> 19

// An observation is that all bus ids are prime numbers!
// We can also see that bus 17, which divides t, also divides t + 17, since that is the next round of that bus.
// But t + 17 is also passed by bus 571. So, 17 and 571 divides t + 17 and since they are BOTH prime numbers,
// the product of them also divides t + 17, i.e. 17 * 571 divides t + 17

const buses = DATA[1].split(',').map((id, i) => {
  return {
    id: id === 'x' ? id : Number(id),
    i
  }
}).filter(bus => bus.id !== 'x')

console.log(buses)

// Yes, I know there's no need to check for 17 and 571..
function matchesTime (t) {
  return buses.every(bus => (t + bus.i) % bus.id === 0)
}

let t17Counter = 0
const primeMultiple = 17 * 571
let t

while (true) {
  t = t17Counter * primeMultiple - 17
  if (matchesTime(t)) {
    break
  } else {
    t17Counter++
  }
}

console.log('t17Counter', t17Counter, 't', t)

// result
// t17Counter: 23369242115
// t: 226845233210288
// time: ~11 minutes

// pure brute force would have meant roughly 11*17*571 minutes
// or about 74 days!
