const fs = require('fs')

/**
 * Read in original program data.
 */
function readProgram () {
  return fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean).map(row => {
    const [cmd, arg] = row.split(' ')
    return [cmd, Number(arg)]
  })
}

/**
 * Runs the provided program array.
 * Returns the accumulator on success.
 * Throws an error if the program goes into an infinite loop.
 */
function run (program) {
  let accumulator = 0
  let pc = 0
  const stack = []

  do {
    if (stack.includes(pc)) {
      throw new Error('E_INFINITE_LOOP')
    }

    if (pc === program.length) {
      console.log('trying to execute instruction after last line')
      return accumulator
    }

    const [cmd, arg] = program[pc]

    stack.push(pc)

    if (cmd === 'acc') {
      accumulator += arg
      pc++
    } else if (cmd === 'jmp') {
      pc += arg
    } else if (cmd === 'nop') {
      pc++
    }
  } while (true)
}

/**
 * Get all jmp/nop instructions and save their location.
 */
const JMP_NOP = readProgram().map((instruction, i) => {
  return { instruction, i }
}).filter(({ instruction }) => {
  return ['jmp', 'nop'].includes(instruction[0])
})

JMP_NOP.forEach(({ instruction, i }) => {
  // Copy the original program.
  const program = readProgram()
  // Replace instruction and run the program.
  const [cmd, arg] = instruction
  if (cmd === 'jmp') {
    program[i][0] = 'nop'
  } else if (cmd === 'nop') {
    program[i][0] = 'jmp'
  }
  try {
    const accumulator = run(program)
    console.log('> accumulator is', accumulator, 'for i', i, instruction, '->', program[i])
  } catch (err) {
    // console.log(err.message)
  }
})
