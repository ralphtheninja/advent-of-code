const { createHash } = require('node:crypto')

function run (key) {
  for (let i = 1; ; i++) {
    const hash = createHash('md5')
    hash.update(`${key}${i}`)
    const digest = hash.digest('hex').substring(0, 6)
    console.log(i, digest)
    if (digest === '000000') return i
  }
}

console.log('result', run('bgvyzdsv'))
