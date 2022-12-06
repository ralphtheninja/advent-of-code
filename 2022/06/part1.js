const fs = require('fs')
const assert = require('assert')

function allDifferent (str) {
  const cache = {}
  const length = str.length
  for (let i = 0; i < length; ++i) {
    const c = str[i]
    if (cache[c]) {
      return false
    } else {
      cache[c] = true
    }
  }
  return true
}

function markerPosition (str) {
  const length = str.length
  for (let i = 0; i < length - 4; ++i) {
    const sub = str.substr(i, 4)
    if (allDifferent(sub)) return i + 4
  }
}

function run (file) {
  return markerPosition(fs.readFileSync(file, 'utf8').trim())
}

assert.equal(allDifferent('mjqj'), false)
assert.equal(allDifferent('jqjp'), false)
assert.equal(allDifferent('qjpq'), false)
assert.equal(allDifferent('jpqm'), true)

assert.equal(markerPosition('mjqjpqmgbljsphdztnvjfqwrcgsmlb'), 7)
assert.equal(markerPosition('bvwbjplbgvbhsrlpgdmjqwftvncz'), 5)
assert.equal(markerPosition('nppdvjthqldpwncqszvftbrmjlhg'), 6)
assert.equal(markerPosition('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'), 10)
assert.equal(markerPosition('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'), 11)

console.log('result', run('./data.txt'))
