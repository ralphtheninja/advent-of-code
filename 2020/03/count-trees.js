const fs = require('fs')
const map = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(row => row.length > 0)

// column indexes 0 -> 30
const colCount = map[0].length
// row indexes 0 -> 322
const rowCount = map.length

const SPACE = '.'
const TREE = '#'

function countTrees (xStep, yStep) {
  let numberOfTrees = 0
  const position = { x: 0, y: 0 }

  do {
    position.x = (position.x + xStep) % colCount
    position.y = position.y + yStep
    if (position.y < rowCount) {
      const row = map[position.y]
      if (row[position.x] === TREE) {
        numberOfTrees++
      }
    }
  } while (position.y <= rowCount - 1)

  return numberOfTrees
}

// part 1
// console.log(countTrees(3, 1))

// part 2
console.log(
  (countTrees(1, 1) *
   countTrees(3, 1) *
   countTrees(5, 1) *
   countTrees(7, 1) *
   countTrees(1, 2)
  )
)
