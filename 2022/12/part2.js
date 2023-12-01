const fs = require('fs')
const assert = require('assert')

function round (monkeys, monkeyCount, maxFactor) {
  for (let i = 0; i < monkeyCount; ++i) {
    const m = monkeys[i]
    const { items, fn, mod, onTrue, onFalse } = m
    if (items.length) {
      for (let j = 0; j < items.length; ++j) {
        const item = items[j]
        let worry = fn(item)
        if (worry > maxFactor) {
          worry = worry % maxFactor
        }
        const isTrue = (!(worry % mod))
        const toMonkey = isTrue ? onTrue : onFalse
        monkeys[toMonkey].items.push(worry)
        m.inspected++
      }
      m.items = []
    }
  }
}

function run (file) {
  const monkeys = fs.readFileSync(file, 'utf8').split('\n\n').map(str => {
    const rows = str.split('\n').map(s => s.trim())
    const items = rows[1].split(': ')[1].split(',').map(Number)
    const op = rows[2].split(' = ')[1]
    const operator = op.split(' ')[1]
    const operands = op.split(/ [+*] /)
    const lastOperand = operands[1]
    const mod = Number(rows[3].split(' divisible by ')[1])
    let fn = null
    if (operator === '+') {
      if (lastOperand === 'old') {
        fn = (old) => old + old
      } else if (!isNaN(Number(lastOperand))) {
        fn = (old) => old + Number(lastOperand)
      } else {
        assert(false, 'should not happen 1')
      }
    } else if (operator === '*') {
      if (lastOperand === 'old') {
        fn = (old) => old * old
      } else if (!isNaN(Number(lastOperand))) {
        fn = (old) => old * Number(lastOperand)
      } else {
        assert(false, 'should not happen 1')
      }
    } else {
      assert(false, 'should not happen 2')
    }
    const onTrue = Number(rows[4].split(' throw to monkey ')[1])
    const onFalse = Number(rows[5].split(' throw to monkey ')[1])
    return {
      items,
      fn,
      mod,
      onTrue,
      onFalse,
      inspected: 0
    }
  })

  const maxFactor = monkeys.reduce((tot, m) => {
    return tot * m.mod
  }, 1)

  const monkeyCount = monkeys.length
  const checkRounds = [1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]

  for (let r = 1; r <= 10000; ++r) {
    round(monkeys, monkeyCount, maxFactor)
    if (checkRounds.includes(r)) {
      console.log('ROUND', r)
      monkeys.forEach((m, i) => {
        console.log(' Monkey', i, 'inspected items', m.inspected, 'times')
      })
    }
  }

  monkeys.sort((lhs, rhs) => {
    if (lhs.inspected > rhs.inspected) return -1
    else if (lhs.inspected < rhs.inspected) return 1
    else return 0
  })

  return monkeys[0].inspected * monkeys[1].inspected
}

// assert.equal(run('./test-data.txt'), 2713310158)
console.log('result', run('./data.txt'))
