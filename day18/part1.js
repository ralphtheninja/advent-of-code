const { deepStrictEqual } = require('assert')
const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean).map(row => row.replace(/\s/g, ''))

function evaluate (expr) {
  let result = 0

  let op = null
  let i = 0

  /**
   * Read until matching end parenthesis and return
   * everything inside
   */
  function readSubExpression () {
    let j = i + 1
    let sub = ''
    let endParen = 1
    while (true) {
      const char = expr[j]
      if (char === '(') {
        endParen++
      } else if (char === ')') {
        endParen--
      }
      if (endParen === 0) {
        break
      }
      sub += char
      ++j
    }
    return sub
  }

  while (i < expr.length) {
    const char = expr[i]
    if (char === '(') {
      // parse sub expression
      const subExpr = readSubExpression()
      i += subExpr.length + 1 // move i past sub expr + )
      const number = evaluate(subExpr)
      if (op === null) {
        result = number
      } else if (op === '*') {
        result = result * number
      } else if (op === '+') {
        result = result + number
      }
    } else if (char === '*') {
      op = '*'
    } else if (char === '+') {
      op = '+'
    } else if (!isNaN(char)) {
      const number = Number(char)
      if (op === null) {
        result = number
      } else if (op === '*') {
        result = result * number
      } else if (op === '+') {
        result = result + number
      }
    } else {
      throw new Error('should not happen')
    }
    ++i
  }

  return result
}

deepStrictEqual(evaluate('4*5'), 20)
deepStrictEqual(evaluate('(4*5)'), 20)
deepStrictEqual(evaluate('((4*5))'), 20)
deepStrictEqual(evaluate('(((4*5)))'), 20)
deepStrictEqual(evaluate('2*3+(4*5)'), 26)
deepStrictEqual(evaluate('8*3+9+3*4*3'), 432)
deepStrictEqual(evaluate('5+(8*3+9+3*4*3)'), 437)
deepStrictEqual(evaluate('5*9*(7*3*3+9*3+(8+6*4))'), 12240)
deepStrictEqual(evaluate('((2+4*9)*(6+9*8+6)+6)+2+4*2'), 13632)

console.log(DATA.map(evaluate).reduce((total, sum) => total + sum, 0))

