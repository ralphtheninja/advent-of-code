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
  const seeds = groups[0].split(': ')[1].split(' ').map(Number)
  const seedRanges = []
  for (let i = 0; i < seeds.length - 1; i += 2) {
    seedRanges.push({ s: seeds[i], l: seeds[i + 1] })
  }
  return {
    seedRanges,
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
    if (number >= s && number < s + l) {
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

function findMinLocation (app) {
  let min = Infinity
  for (let i = 0; i < app.seedRanges.length; ++i) {
    const { s, l } = app.seedRanges[i]
    console.log('testing range', s, '->', s + l - 1)
    for (let seed = s; seed < s + l; seed++) {
      const loc = findLocation(app, seed)
      min = Math.min(loc, min)
    }
  }
  return min
}

// const assert = require('assert')
// const app = parse('./input.test')
// assert.equal(findMinLocation(app), 46)

const app = parse('./input')
console.log('min location', findMinLocation(app))
