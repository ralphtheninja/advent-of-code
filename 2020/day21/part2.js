// It was easier to solve this manually than writing code for it.
const resolvedMap = {
  sesame: 'xzfj',
  fish: 'ndfb',
  soy: 'fkcmf',
  dairy: 'ktpbgdn',
  shellfish: 'bfgcms',
  wheat: 'hdqkqhh',
  eggs: 'pnpfjb',
  peanuts: 'rdhljms'
}
const reverseMap = Object.keys(resolvedMap).reduce((tot, key) => {
  const value = resolvedMap[key]
  return Object.assign({}, tot, { [value]: key })
}, {})

const list = Object.keys(reverseMap).map(key => {
  return { key, value: reverseMap[key] }
}).sort((a, b) => {
  if (a.value < b.value) return -1
  else if (a.value > b.value) return 1
  else return 0
})
console.log('canonical dangerous list:', list.map(l => l.key).join(','))
