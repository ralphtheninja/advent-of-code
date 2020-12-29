const fs = require('fs')
const groups = fs.readFileSync('./data.txt', 'utf8').split('\n\n').filter(Boolean)

const totalCount = groups.map(group => {
  const answers = new Map()
  const rows = group.split('\n').filter(Boolean)
  rows.forEach(row => {
    row.split('').forEach(answer => {
      if (!answers.has(answer)) {
        answers.set(answer, 1)
      } else {
        answers.set(answer, answers.get(answer) + 1)
      }
    })
  })
  let answerCount = 0
  const groupCount = rows.length
  answers.forEach((value, key) => {
    if (value === groupCount) answerCount++
  })
  return answerCount
}).reduce((count, total) => count + total, 0)

console.log('answer count:', totalCount)
