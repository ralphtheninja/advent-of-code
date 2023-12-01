const fs = require('fs')
const ruleData = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)

const rules = new Map()

ruleData.forEach(rule => {
  const [container, bags] = rule.split(' bags contain ')
  const list = bags.split(', ').map(bag => {
    const bagSplit = bag.split(' ')
    const count = Number(bagSplit[0])
    const name = `${bagSplit[1]} ${bagSplit[2]}`
    return [name, count]
  })
  rules.set(container, list)
})

function findValidContainer (bag) {
  const containers = []
  rules.forEach((value, key) => {
    value.forEach(([name, count]) => {
      if (name === bag) {
        containers.push(key)
      }
    })
  })
  return containers
}

const all = {}

function findAllContainers (bag) {
  const result = findValidContainer(bag)
  result.forEach(bag => {
    all[bag] = true
  })
  result.forEach(bag => findAllContainers(bag))
}

findAllContainers('shiny gold')

const names = Object.keys(all).sort()
console.log(names)
console.log('number of bags', names.length)
