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
  const rope = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]

  motions.forEach(({ dir, steps }) => {
    for (let step = 0; step < steps; ++step) {
      if (dir === 'R') {
        ++rope[0].x
      } else if (dir === 'L') {
        --rope[0].x
      } else if (dir === 'U') {
        ++rope[0].y
      } else if (dir === 'D') {
        --rope[0].y
      } else {
        assert(false, 'should not happen')
      }

      for (let i = 0; i < rope.length - 1; ++i) {
        const lead = rope[i]
        const follow = rope[i + 1]
        if (!inTouch(lead, follow)) {
          if (lead.x > follow.x) {
            ++follow.x
          } else if (lead.x < follow.x) {
            --follow.x
          }
          if (lead.y > follow.y) {
            ++follow.y
          } else if (lead.y < follow.y) {
            --follow.y
          }
        }
      }

      const tail = rope[rope.length - 1]
      visited[`${tail.x},${tail.y}`] = true
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

assert.equal(run('./test-data.txt'), 1)
console.log('result', run('./data.txt'))
