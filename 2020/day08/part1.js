const fs = require('fs')
const program = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean).map(row => {
  const [cmd, arg] = row.split(' ')
  return [cmd, Number(arg)]
})

let accumulator = 0
let pc = 0
const stack = []

do {
  if (pc >= program.length) {
    console.error('invalid instruction')
    process.exit(1)
  }

  if (stack.includes(pc)) {
    console.log('will enter infinite loop, exiting')
    console.log('accumulator is', accumulator)
    process.exit(1)
  }

  const [cmd, arg] = program[pc]

  stack.push(pc)
  console.log('running instruction', pc, cmd, arg)

  if (cmd === 'acc') {
    accumulator += arg
    console.log('accumulator updated', accumulator)
    pc++
  } else if (cmd === 'jmp') {
    console.log('jumping', arg)
    pc += arg
  } else if (cmd === 'nop') {
    pc++
  }

} while (true)

