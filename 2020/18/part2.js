const { deepStrictEqual } = require('assert')
const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean).map(row => row.replace(/\s/g, ''))

function evaluate (expr) {
  function readSubExpression (start) {
    let j = start + 1
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

  if (expr.includes('(') && expr.includes(')')) {
    while (expr.includes('(')) {
      let subExpr = readSubExpression(expr.indexOf('('))
      const evaled = evaluate(subExpr)
      expr = expr.replace('(' + subExpr + ')', evaled)
    }
    return evaluate(expr)
  } else {
    if (!isNaN(expr)) {
      return Number(expr)
    } else if (expr.includes('+') && expr.includes('*')) {
      return expr.split('*').map(evaluate).reduce((tot, i) => i * tot, 1)
    } else  if (expr.includes('+')) {
      return expr.split('+').map(Number).reduce((tot, i) => i + tot, 0)
    } else  if (expr.includes('*')) {
      return expr.split('*').map(Number).reduce((tot, i) => i * tot, 1)
    }
  }
}

deepStrictEqual(evaluate('4'), 4)
deepStrictEqual(evaluate('4+5'), 9)
deepStrictEqual(evaluate('4*5'), 20)
deepStrictEqual(evaluate('4+5*10+1'), 99)
deepStrictEqual(evaluate('1+2*3+4*5+6'), 231)
deepStrictEqual(evaluate('(4*5)'), 20)
deepStrictEqual(evaluate('((4*5))'), 20)
deepStrictEqual(evaluate('(((4*5)))'), 20)
deepStrictEqual(evaluate('1+(2*3)+(4*(5+6))'), 51)
deepStrictEqual(evaluate('2*3+(4*5)'), 46)
deepStrictEqual(evaluate('5+(8*3+9+3*4*3)'), 1445)
deepStrictEqual(evaluate('5*9*(7*3*3+9*3+(8+6*4))'), 669060)
deepStrictEqual(evaluate('((2+4*9)*(6+9*8+6)+6)+2+4*2'), 23340)

console.log(DATA.map(evaluate).reduce((total,sum)=>total+sum,0))

