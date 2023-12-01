const fs = require('fs')
const assert = require('assert')

function inTouch (head, tail) {
  return Math.abs(head.x - tail.x) <= 1 && Math.abs(head.y - tail.y) <= 1
}

function run (file) {
  const motions = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(row => {
    const [dir, steps] = row.split(' ')
    return { dir, steps: Number(steps) }
  })

  const visited = { '0,0': true }
  const head = { x: 0, y: 0 }
  const tail = { x: 0, y: 0 }

  motions.forEach(({ dir, steps }) => {
    for (let step = 0; step < steps; ++step) {
      if (dir === 'R') {
        ++head.x
      } else if (dir === 'L') {
        --head.x
      } else if (dir === 'U') {
        ++head.y
      } else if (dir === 'D') {
        --head.y
      } else {
        assert(false, 'should not happen')
      }

      if (!inTouch(head, tail)) {
        if (head.x > tail.x) {
          ++tail.x
        } else if (head.x < tail.x) {
          --tail.x
        }
        if (head.y > tail.y) {
          ++tail.y
        } else if (head.y < tail.y) {
          --tail.y
        }
        visited[`${tail.x},${tail.y}`] = true
      }
    }
  })

  return Object.keys(visited).length
}

assert.equal(inTouch({ x: 0, y: 0 }, { x: 0, y: 0 }), true) // on top
assert.equal(inTouch({ x: -1, y: 0 }, { x: 0, y: 0 }), true) // w
assert.equal(inTouch({ x: 1, y: 0 }, { x: 0, y: 0 }), true) // e
assert.equal(inTouch({ x: 0, y: -1 }, { x: 0, y: 0 }), true) // s
assert.equal(inTouch({ x: 0, y: 1 }, { x: 0, y: 0 }), true) // n
assert.equal(inTouch({ x: 1, y: 1 }, { x: 0, y: 0 }), true) // ne
assert.equal(inTouch({ x: -1, y: 1 }, { x: 0, y: 0 }), true) // nw
assert.equal(inTouch({ x: -1, y: -1 }, { x: 0, y: 0 }), true) // sw
assert.equal(inTouch({ x: 1, y: -1 }, { x: 0, y: 0 }), true) // se

assert.equal(inTouch({ x: 2, y: 0 }, { x: 0, y: 0 }), false)
assert.equal(inTouch({ x: -2, y: 0 }, { x: 0, y: 0 }), false)
assert.equal(inTouch({ x: 2, y: 0 }, { x: 0, y: 0 }), false)
assert.equal(inTouch({ x: 0, y: -2 }, { x: 0, y: 0 }), false)
assert.equal(inTouch({ x: 0, y: 2 }, { x: 0, y: 0 }), false)
assert.equal(inTouch({ x: 2, y: 2 }, { x: 0, y: 0 }), false)
assert.equal(inTouch({ x: -2, y: 2 }, { x: 0, y: 0 }), false)
assert.equal(inTouch({ x: -2, y: -2 }, { x: 0, y: 0 }), false)
assert.equal(inTouch({ x: 2, y: -2 }, { x: 0, y: 0 }), false)

assert.equal(run('./test-data.txt'), 13)
console.log('result', run('./data.txt'))
