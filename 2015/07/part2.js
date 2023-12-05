const fs = require('fs')

function AND (lhs, rhs) {
  return lhs & rhs
}

function OR (lhs, rhs) {
  return lhs | rhs
}

function LSHIFT (lhs, rhs) {
  return lhs << rhs
}

function RSHIFT (lhs, rhs) {
  return lhs >> rhs
}

function NOT (rhs) {
  // ~ returns negative values which needs to be 16 bit
  return 2 ** 16 + ~rhs
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)

  const operations = {}
  let cache = {}

  const get = (id) => {
    if (!isNaN(Number(id))) {
      // numbers evaluate to themselves
      return Number(id)
    } else {
      // we must cache values to reduce computation
      if (cache[id]) {
        console.log('cached value', cache[id], 'for id', id)
        return cache[id]
      } else {
        const v = operations[id]()
        cache[id] = v
        return v
      }
    }
  }

  lines.forEach(line => {
    const split = line.split(' -> ')
    const wire = split[1]
    const op = split[0]
    if (op.includes('AND')) {
      const [p1, p2] = op.split(' AND ')
      operations[wire] = () => AND(get(p1), get(p2))
    } else if (op.includes('OR')) {
      const [p1, p2] = op.split(' OR ')
      operations[wire] = () => OR(get(p1), get(p2))
    } else if (op.includes('LSHIFT')) {
      const [p1, p2] = op.split(' LSHIFT ')
      operations[wire] = () => LSHIFT(get(p1), get(p2))
    } else if (op.includes('RSHIFT')) {
      const [p1, p2] = op.split(' RSHIFT ')
      operations[wire] = () => RSHIFT(get(p1), get(p2))
    } else if (op.startsWith('NOT')) {
      const p1 = op.split(' ')[1]
      operations[wire] = () => NOT(get(p1))
    } else {
      operations[wire] = () => get(op)
    }
  })

  // compute a
  const a = operations.a()
  // let b get its value from this value
  operations.b = () => a
  // reset the cache
  cache = {}
  // compute a again
  return operations.a()
}

console.log('result', run('./input'))
