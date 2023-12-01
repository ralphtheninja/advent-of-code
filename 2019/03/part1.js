const { deepStrictEqual } = require('assert')
const LINES = require('fs').readFileSync('./data.txt', 'utf8').trim().split('\n').map(l => l.split(','))

/**
 * Return an array of common coordinates
 */
function intersections (coords1, coords2) {
  const result = []
  coords1.forEach(c1 => {
    const found = coords2.find(c2 => {
      return c1[0] === c2[0] && c1[1] === c2[1]
    })
    if (found) result.push(found)
  })
  return result
}

deepStrictEqual(
  intersections([[1, 2], [3, 3], [5, -1], [4, 0]], [[2, 2], [3, -99], [4, 0], [1, 6]]),
  [[4, 0]]
)

/**
 * Given a line, compute all possible coordinates.
 */
function coordinates (line) {
  const result = []
  const pos = { x: 0, y: 0 }
  line.forEach(l => {
    const dir = l[0]
    const length = Number(l.split(dir)[1])
    if (dir === 'R') {
      for (let i = 0; i < length; ++i) {
        result.push([++pos.x, pos.y])
      }
    } else if (dir === 'U') {
      for (let i = 0; i < length; ++i) {
        result.push([pos.x, ++pos.y])
      }
    } else if (dir === 'L') {
      for (let i = 0; i < length; ++i) {
        result.push([--pos.x, pos.y])
      }
    } else if (dir === 'D') {
      for (let i = 0; i < length; ++i) {
        result.push([pos.x, --pos.y])
      }
    }
  })
  return result
}

deepStrictEqual(
  coordinates('R8,U5,L5,D3'.split(',')),
  [
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [7, 5],
    [6, 5],
    [5, 5],
    [4, 5],
    [3, 5],
    [3, 4],
    [3, 3],
    [3, 2]
  ]
)

/**
 *
 */
function minDistance (l1, l2) {
  const common = intersections(
    coordinates(l1),
    coordinates(l2)
  )
  const distances = common.map(coord => {
    return Math.abs(coord[0]) + Math.abs(coord[1])
  })
  return distances.reduce((min, d) => {
    return Math.min(d, min)
  }, Infinity)
}

deepStrictEqual(
  minDistance(
    'R75,D30,R83,U83,L12,D49,R71,U7,L72'.split(','),
    'U62,R66,U55,R34,D71,R55,D58,R83'.split(',')
  ),
  159
)
deepStrictEqual(
  minDistance(
    'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51'.split(','),
    'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'.split(',')
  ),
  135
)

console.log('result', minDistance(LINES[0], LINES[1]))
