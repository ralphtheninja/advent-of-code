const { deepStrictEqual } = require('assert')
const PROGRAM = require('fs').readFileSync('./data.txt', 'utf8').trim().split(',').map(Number)

function run (prog) {
  const program = prog.slice()
  let ip = 0
  while (ip < program.length) {
    const opcode = program[ip]
    if (opcode === 1) {
      const lhsPos = program[ip + 1]
      const rhsPos = program[ip + 2]
      const pos = program[ip + 3]
      const result = program[lhsPos] + program[rhsPos]
      console.log('add result', result, 'and store at', pos)
      program[pos] = result
      ip += 4
    } else if (opcode === 2) {
      const lhsPos = program[ip + 1]
      const rhsPos = program[ip + 2]
      const pos = program[ip + 3]
      const result = program[lhsPos] * program[rhsPos]
      console.log('mult result', result, 'and store at', pos)
      program[pos] = result
      ip += 4
    } else if (opcode === 99) {
      console.log('opcode 99 exiting!')
      break
    }
  }
  return program
}

deepStrictEqual(run([1, 0, 0, 0, 99]), [2, 0, 0, 0, 99])
deepStrictEqual(run([2, 3, 0, 3, 99]), [2, 3, 0, 6, 99])
deepStrictEqual(run([2, 4, 4, 5, 99, 0]), [2, 4, 4, 5, 99, 9801])
deepStrictEqual(run([1, 1, 1, 4, 99, 5, 6, 0, 99]), [30, 1, 1, 4, 2, 5, 6, 0, 99])

PROGRAM[1] = 12
PROGRAM[2] = 2
const result = run(PROGRAM)
console.log('result', result[0])
