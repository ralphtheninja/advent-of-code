const fs = require('fs')
const assert = require('assert')

function round (monkeys) {
  const MONKEYS = monkeys.slice()
  for (let i = 0; i < MONKEYS.length; ++i) {
    const m = MONKEYS[i]
    // console.log('Monkey', i)
    const { items, op, div, onTrue, onFalse } = m
    if (items.length === 0) {
      // console.log('  Monkey has no items, turn ended')
      continue
    }
    for (let j = 0; j < items.length; ++j) {
      const item = items[j]
      // console.log('  Monkey inspects an item with a worry level of', item)
      let worry = eval(`const old = ${item};${op}`)
      // console.log('    Worry level becomes', worry)
      worry = Math.floor(worry / 3)
      // console.log(`    Monkey gets bored with item. Worry level is divided by ${div} to ${worry}`)
      const isTrue = worry % div === 0
      const toMonkey = isTrue ? onTrue : onFalse
      // console.log(`    Item with worry level ${worry} is thrown to ${toMonkey}`)
      MONKEYS[toMonkey].items.push(worry)
      m.inspected++
    }
    m.items = []
  }
  return MONKEYS
}

function run (file) {
  let monkeys = fs.readFileSync(file, 'utf8').split('\n\n').map(str => {
    const rows = str.split('\n').map(s => s.trim())
    const items = rows[1].split(': ')[1].split(',').map(Number)
    const op = rows[2].split(' = ')[1]
    const div = Number(rows[3].split(' divisible by ')[1])
    const onTrue = Number(rows[4].split(' throw to monkey ')[1])
    const onFalse = Number(rows[5].split(' throw to monkey ')[1])
    return {
      items,
      op,
      div,
      onTrue,
      onFalse,
      inspected: 0
    }
  })

  for (let i = 0; i < 20; ++i) {
    console.log('ROUND', i + 1)
    monkeys = round(monkeys)
    console.log(monkeys)
  }

  monkeys.sort((lhs, rhs) => {
    if (lhs.inspected > rhs.inspected) return -1
    else if (lhs.inspected < rhs.inspected) return 1
    else if (lhs.inspected === rhs.inspected) return 0
  })

  return monkeys[0].inspected * monkeys[1].inspected
}

assert.equal(run('./test-data.txt'), 10605)
// console.log('result', run('./data.txt'))
