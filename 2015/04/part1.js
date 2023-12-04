const { createHash } = require('node:crypto')

function run (key) {
  for (let i = 1; ; i++) {
    const hash = createHash('md5')
    hash.update(`${key}${i}`)
    const digest = hash.digest('hex').substring(0, 5)
    console.log(i, digest)
    if (digest === '00000') return i
  }
}

// const assert = require('assert')
// assert.equal(run('abcdef'), 609043)
// assert.equal(run('pqrstuv'), 1048970)
console.log('result', run('bgvyzdsv'))
