const { deepStrictEqual } = require('assert')
const DATA = require('fs').readFileSync('./data1.txt', 'utf8').split('\n\n').filter(Boolean)

const RULES = DATA[0].split('\n').filter(Boolean)
const MESSAGES = DATA[1].split('\n').filter(Boolean)

const TEST_RULES = [
  '0: 4 1 5',
  '1: 2 3 | 3 2',
  '2: 4 4 | 5 5',
  '3: 4 5 | 5 4',
  '4: "a"',
  '5: "b"'
]
const TEST_MESSAGES = [
  'ababbb', // should match
  'bababa', // should NOT match
  'abbbab', // should match
  'aaabbb', // should NOT match
  'aaaabbb' // should NOT match (the one that matches everything but the last 'b')
]

function countMatches (rules, messages) {
  // Build a rule map, parse from original data.
  const ruleMap = {}
  rules.forEach(rule => {
    const [key, value] = rule.split(': ')
    let subRules = null
    if (!value.includes('"')) {
      subRules = value.split(' | ').map(r => r.split(' '))
    } else {
      subRules = value.replace(/"/g, '')
    }
    ruleMap[key] = subRules
  })

  function matchingMessage (subRules, message) {
    if (Array.isArray(subRules)) {
      let rest = null

      for (let i = 0; i < subRules.length; ++i) {
        rest = message
        const subRule = subRules[i]
        for (let r = 0; r < subRule.length; ++r) {
          const rule = subRule[r]

          const newRest = matchingMessage(ruleMap[rule], rest)
          if (newRest !== null) {
            // There was a match. Remember this reset for next rule.
            rest = newRest
          } else {
            rest = null
            break
          }
        }

        // one of the sub rules matched, so no need to continue to next sub rule
        if (rest !== null) break
      }

      return rest
    } else {
      const match = message.match(new RegExp(subRules))
      return (match && match.index === 0 ? message.substr(match[0].length) : null)
    }
  }

  return messages.filter(message => {
    // Successful result from calling uppermost rule is an empty rest string
    const result = matchingMessage(ruleMap[0], message)
    const boolean = typeof result === 'string' && result.length === 0
    if (boolean) console.log('Message:', message, 'MATCHED!')
    return boolean
  }).length
}

deepStrictEqual(countMatches(TEST_RULES, TEST_MESSAGES), 2)
console.log('Total matched messages: ', countMatches(RULES, MESSAGES))
