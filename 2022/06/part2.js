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
  for (let i = 0; i < length - 14; ++i) {
    const sub = str.substr(i, 14)
    if (allDifferent(sub)) return i + 14
  }
}

function run (file) {
  return markerPosition(fs.readFileSync(file, 'utf8').trim())
}

assert.equal(allDifferent('mjqj'), false)
assert.equal(allDifferent('jqjp'), false)
assert.equal(allDifferent('qjpq'), false)
assert.equal(allDifferent('jpqm'), true)

assert.equal(markerPosition('mjqjpqmgbljsphdztnvjfqwrcgsmlb'), 19)
assert.equal(markerPosition('bvwbjplbgvbhsrlpgdmjqwftvncz'), 23)
assert.equal(markerPosition('nppdvjthqldpwncqszvftbrmjlhg'), 23)
assert.equal(markerPosition('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg'), 29)
assert.equal(markerPosition('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw'), 26)

console.log('result', run('./data.txt'))
