const fs = require('fs')

function parseMap (map) {
  const ranges = map.split('\n').slice(1)
  return ranges.map(range => {
    const [d, s, l] = range.split(' ').map(Number)
    return { s, l, d }
  })
}

function parse (file) {
  const data = fs.readFileSync(file, 'utf8')
  const groups = data.split('\n\n').filter(Boolean)
  return {
    seeds: groups[0].split(': ')[1].split(' ').map(Number),
    seedToSoil: parseMap(groups[1]),
    soilToFertilizer: parseMap(groups[2]),
    fertilizerToWater: parseMap(groups[3]),
    waterToLight: parseMap(groups[4]),
    lightToTemperature: parseMap(groups[5]),
    temperatureToHumidity: parseMap(groups[6]),
    humidityToLocation: parseMap(groups[7])
  }
}

function lookup (number, map) {
  for (let i = 0; i < map.length; ++i) {
    const { s, l, d } = map[i]
    if (number >= s && number <= s + l) {
      return d + number - s
    }
  }
  return number
}

function findLocation (app, seed) {
  const soil = lookup(seed, app.seedToSoil)
  const fertilizer = lookup(soil, app.soilToFertilizer)
  const water = lookup(fertilizer, app.fertilizerToWater)
  const light = lookup(water, app.waterToLight)
  const temperature = lookup(light, app.lightToTemperature)
  const humidity = lookup(temperature, app.temperatureToHumidity)
  return lookup(humidity, app.humidityToLocation)
}

// const assert = require('assert')
// const app = parse('./input.test')
// assert.equal(lookup(79, app.seedToSoil), 81)
// assert.equal(lookup(14, app.seedToSoil), 14)
// assert.equal(lookup(55, app.seedToSoil), 57)
// assert.equal(lookup(13, app.seedToSoil), 13)
// assert.equal(lookup(100, app.humidityToLocation), 100)
// assert.equal(lookup(56, app.humidityToLocation), 60)
// assert.equal(lookup(58, app.humidityToLocation), 62)
// assert.equal(lookup(95, app.humidityToLocation), 58)
// assert.equal(findLocation(app, 79), 82)
// assert.equal(findLocation(app, 14), 43)
// assert.equal(findLocation(app, 55), 86)
// assert.equal(findLocation(app, 13), 35)

const app = parse('./input')
const locations = app.seeds.map(seed => {
  return findLocation(app, seed)
})
console.log('min location', Math.min(...locations))
