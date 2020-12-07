const fs = require('fs')
const groups = fs.readFileSync('./data.txt', 'utf8').split('\n\n').filter(Boolean)

const totalCount = groups.map(group => {
  const answers = {}
  group.split('').forEach(answer => {
    if (answer !== '\n') answers[answer] = true
  })
  return Object.keys(answers).length
}).reduce((count, total) => count + total, 0)

console.log('# groups:', groups.length)
console.log('answer count:', totalCount)
