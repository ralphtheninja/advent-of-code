const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)

const ts = Number(DATA[0])
const buses = DATA[1].split(',')
    .filter(b => b !== 'x')
    .map(Number)
    .map(id => {
      const time = Math.ceil(ts / id) * id - ts
      return {
        id,
        time,
        total: id * time
      }
    }).sort((a, b) => {
      if (a.time < b.time) return -1
      else if (a.time > b.time) return 1
      else return 0
    })

console.log('Earliest bus is', buses[0].id)
console.log(' which goes', buses[0].time, 'minutes after')
console.log(' times id is', buses[0].total)
