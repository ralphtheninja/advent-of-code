const { deepStrictEqual } = require('assert')
const PROGRAM = require('fs').readFileSync('./data.txt', 'utf8').trim().split(',').map(Number)

function run (prog, noun, verb) {
  const program = prog.slice()

  program[1] = noun
  program[2] = verb

  let ip = 0
  while (ip < program.length) {
    const opcode = program[ip]
    if (opcode === 1) {
      const lhsPos = program[ip + 1]
      const rhsPos = program[ip + 2]
      const pos = program[ip + 3]
      const result = program[lhsPos] + program[rhsPos]
      program[pos] = result
      ip += 4
    } else if (opcode === 2) {
      const lhsPos = program[ip + 1]
      const rhsPos = program[ip + 2]
      const pos = program[ip + 3]
      const result = program[lhsPos] * program[rhsPos]
      program[pos] = result
      ip += 4
    } else if (opcode === 99) {
      break
    }
  }
  return program
}

for (let noun = 0; noun <= 99; ++noun) {
  for (let verb = 0; verb <= 99; ++verb) {
    const result = run(PROGRAM, noun, verb)
    if (result[0] === 19690720) {
      console.log('result:', noun * 100 + verb)
      process.exit(0)
    }
  }
}
