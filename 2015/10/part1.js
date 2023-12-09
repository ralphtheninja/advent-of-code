const assert = require('assert')

function next (seq) {
  let result = ''
  let i = 0
  do {
    const first = seq[i++]
    let subSeq = first

    while (i < seq.length) {
      const next = seq[i]
      if (next === first) {
        subSeq += next
        i++
      } else {
        break
      }
    }

    result += `${subSeq.length}${subSeq[0]}`
  } while (i < seq.length)
  return result
}

assert.equal(next('1'), '11')
assert.equal(next('11'), '21')
assert.equal(next('21'), '1211')
assert.equal(next('1211'), '111221')
assert.equal(next('111221'), '312211')

function repeat (n, seq) {
  let result = seq
  for (let i = 0; i < n; ++i) {
    result = next(result)
  }
  return result
}

console.log('result', repeat(40, '1113222113').length)
