const fs = require('fs')
const ruleData = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)

const rules = new Map()

ruleData.forEach(rule => {
  const [container, bags] = rule.split(' bags contain ')
  if (bags.startsWith('no other')) {
    rules.set(container, [])
  } else {
    const list = bags.split(', ').map(bag => {
      const bagSplit = bag.split(' ')
      const count = Number(bagSplit[0])
      const name = `${bagSplit[1]} ${bagSplit[2]}`
      return [name, count]
    })
    rules.set(container, list)
  }
})

function numberOfContainingBags (bag) {
  const children = rules.get(bag)
  if (children.length === 0) {
    // A big with no children returns 0
    return 0
  }
  let result = 0
  children.forEach(child => {
    const [name, count] = child
    result += count + count * numberOfContainingBags(name)
  })
  return result
}

console.log(numberOfContainingBags('shiny gold'))
