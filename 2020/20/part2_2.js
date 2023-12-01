const { deepStrictEqual } = require('assert')
const DATA = require('./part2.json')
const TEST_DATA = require('./part2-test.json')

const TEST_IMAGE = [
  [
    '.####...#####..#...###..',
    '#####..#..#.#.####..#.#.',
    '.#.#...#.###...#.##.O#..',
    '#.O.##.OO#.#.OO.##.OOO##',
    '..#O.#O#.O##O..O.#O##.##',
    '...#.#..##.##...#..#..##',
    '#.##.#..#.#..#..##.#.#..',
    '.###.##.....#...###.#...',
    '#.####.#.#....##.#..#.#.',
    '##...#..#....#..#...####',
    '..#.##...###..#.#####..#',
    '....#.##.#.#####....#...',
    '..##.##.###.....#.##..#.',
    '#...#...###..####....##.',
    '.#.##...#.##.#.#.###...#',
    '#.###.#..####...##..#...',
    '#.###...#.##...#.##O###.',
    '.O##.#OO.###OO##..OOO##.',
    '..O#.O..O..O.#O##O##.###',
    '#.#..##.########..#..##.',
    '#.#####..#.#...##..#....',
    '#....##..#.#########..##',
    '#...#.....#..##...###.##',
    '#..###....##.#...##.##.#'
  ],
  [
    '.####...#####..#...###..',
    '#####..#..#.#.####..#.#.',
    '.#.#...#.###...#.##.##..',
    '#.#.##.###.#.##.##.#####',
    '..##.###.####..#.####.##',
    '...#.#..##.##...#..#..##',
    '#.##.#..#.#..#..##.#.#..',
    '.###.##.....#...###.#...',
    '#.####.#.#....##.#..#.#.',
    '##...#..#....#..#...####',
    '..#.##...###..#.#####..#',
    '....#.##.#.#####....#...',
    '..##.##.###.....#.##..#.',
    '#...#...###..####....##.',
    '.#.##...#.##.#.#.###...#',
    '#.###.#..####...##..#...',
    '#.###...#.##...#.######.', // 16
    '.###.###.#######..#####.', // 17
    '..##.#..#..#.#######.###', // 18
    '#.#..##.########..#..##.',
    '#.#####..#.#...##..#....',
    '#....##..#.#########..##',
    '#...#.....#..##...###.##',
    '#..###....##.#...##.##.#'
  ]
]

function computeRoughness (image) {
  function countSharps (line) {
    let count = 0
    for (let i = 0; i < line.length; ++i) {
      if (line[i] === '#') count++
    }
    return count
  }
  return image.reduce((total, line) => {
    return total + countSharps(line)
  }, 0)
}

function computeMonster (image) {
  function countOs (line) {
    let count = 0
    for (let i = 0; i < line.length; ++i) {
      if (line[i] === 'O') count++
    }
    return count
  }
  return image.reduce((total, line) => {
    return total + countOs(line)
  }, 0)
}

const MONSTER = [
  '                  # ',
  '#    ##    ##    ###',
  ' #  #  #  #  #  #   '
]

deepStrictEqual(computeRoughness(TEST_IMAGE[0]), 273)

function monsterRowMatches (row, monsterRow) {
  for (let i = 0; i < monsterRow.length; ++i) {
    if (monsterRow[i] === '#') {
      if (row[i] === '.') {
        return false
      }
    }
  }
  return true
}

function rowsContainMonster (rows, fromCol, toCol) {
  const window = rows.map(row => {
    return row.substr(fromCol, toCol - fromCol + 1)
  })

  return window.every((row, i) => {
    return monsterRowMatches(row, MONSTER[i])
  })
}

function drawMonsterRow (row, monsterRow, fromCol, toCol) {
  let result = ''
  for (let i = 0; i < row.length; ++i) {
    if (i >= fromCol && i <= toCol) {
      if (monsterRow[i - fromCol] === '#' && row[i] === '#') {
        result += 'O'
      } else {
        result += row[i]
      }
    } else {
      result += row[i]
    }
  }
  return result
}

function drawMonsterPattern (rows, fromCol, toCol) {
  return rows.map((row, i) => {
    return drawMonsterRow(row, MONSTER[i], fromCol, toCol)
  })
}

function findSeaMonsters (image) {
  const windowHeight = MONSTER.length - 1
  const windowWidth = MONSTER[0].length - 1
  const imageWidth = image[0].length

  let count = 0

  for (let i = 0; i < image.length - windowHeight; ++i) {
    const fromRow = i
    const toRow = i + windowHeight
    for (let j = 0; j < imageWidth - windowWidth; ++j) {
      const fromCol = j
      const toCol = j + windowWidth
      if (rowsContainMonster(image.slice(fromRow, toRow + 1), fromCol, toCol)) {
        count++
        const copy = image.slice()
        const monster = drawMonsterPattern(image.slice(fromRow, toRow + 1), fromCol, toCol)
        monster.forEach((monsterRow, i) => {
          image.splice(fromRow + i, 1, monsterRow)
        })
      }
    }
  }

  return { image, count }
}

// const { image, count } = findSeaMonsters(TEST_IMAGE[1])
// deepStrictEqual(computeRoughness(image), 273)
// console.log('monsters in total:', count)

DATA.forEach(img => {
  const preRoughness = computeRoughness(img)
  const { image, count } = findSeaMonsters(img)
  if (count) {
    console.log('monsters in image:', count)
    console.log('computed roughness', computeRoughness(image))
  }
})
