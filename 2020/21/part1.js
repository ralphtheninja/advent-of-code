const { deepStrictEqual } = require('assert')
const DATA = require('fs').readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)

// Parse the data and gather all dishes
const ALLERGENS = new Set()
const DISHES = []
DATA.forEach(d => {
  const regex = /contains ([^)]+)/i
  const match = regex.exec(d)
  if (match) {
    const allergens = match[1].split(', ')
    allergens.forEach(a => ALLERGENS.add(a))
    let ingredients = d.split(' (')[0]
    ingredients = ingredients.split(' ')
    ingredients.sort()
    DISHES.push({ allergens, ingredients })
  }
})

// Go through dishes and get some statistics on ingredients
const meta = {}
DISHES.forEach(dish => {
  const { ingredients } = dish
  ingredients.forEach(ingredient => {
    if (!meta[ingredient]) {
      meta[ingredient] = 1
    } else {
      meta[ingredient]++
    }
  })
})

function commonWords (left, right) {
  const result = []
  left.forEach(l => {
    if (right.includes(l)) result.push(l)
  })
  return result
}

deepStrictEqual(
  commonWords(
    [
      'bcss', 'bfgcms', 'bgnqdk', 'bzczpk',
      'chhct', 'cnm', 'ddzvfvq', 'dxlzf',
      'fvqhc', 'gkzgj', 'gnmsc', 'gpmpf',
      'hdqkqhh', 'hktlnb', 'hmtkfnq', 'hsqh',
      'hzhzdtd', 'jzn', 'ktpbgdn', 'kxbg',
      'lxjmhz', 'mjcrg', 'mkpmz', 'mmkq',
      'mpkk', 'nbtgf', 'ndfb', 'ndnvm',
      'nrvjmfb', 'pbrds', 'pkptv', 'pmvlzl',
      'pnpfjb', 'psscnhr', 'qtltm', 'qzffj',
      'rdhljms', 'rhbfl', 'rmdmc', 'rscgs',
      'rxxmdp', 'scbhzv', 'sdjnb', 'tcp',
      'tfrlh', 'vccmfr', 'vmc', 'xnkh',
      'xsxnr', 'xxthxs', 'xzfj'
    ],
    [
      'bfgcms', 'bgkh', 'bmgg', 'bnxp', 'bshlm',
      'bzczpk', 'ckxrpj', 'cnm', 'ctvdb', 'cxltld',
      'ddzvfvq', 'dmrnl', 'fgpkgp', 'fkcmf', 'fpmz',
      'gkzgj', 'gpmpf', 'gsfx', 'gxf', 'hnnjms',
      'hrnq', 'jdkxx', 'jkvsmc', 'jqdtgp', 'jqrvm',
      'jzn', 'kjmxcb', 'kngjc', 'kptrg', 'ksbnxq',
      'ktpbgdn', 'lbhl', 'lxjmhz', 'mcgs', 'mdfnq',
      'ndfb', 'ndnvm', 'pclxz', 'pkptv', 'pnpfjb',
      'pqhqv', 'ptjd', 'qgjfx', 'qtltm', 'qzffj',
      'rdhljms', 'rmdmc', 'sdjnb', 'sfhb', 'sfsjpk',
      'tfrlh', 'tsvrr', 'vccmfr', 'vnn', 'xnjx',
      'xnkh', 'xzfj'
    ]), [
    'bfgcms', 'bzczpk', 'cnm', 'ddzvfvq', 'gkzgj',
    'gpmpf', 'jzn', 'ktpbgdn', 'lxjmhz', 'ndfb',
    'ndnvm', 'pkptv', 'pnpfjb', 'qtltm', 'qzffj',
    'rdhljms', 'rmdmc', 'sdjnb', 'tfrlh', 'vccmfr',
    'xnkh', 'xzfj'
  ])

function getDishes (allergen) {
  return DISHES.filter(d => d.allergens.includes(allergen))
}

const allergenMap = {}
for (const allergen of ALLERGENS) {
  const dishes = getDishes(allergen).map(d => d.ingredients)
  allergenMap[allergen] = dishes.reduce((tot, d, i) => {
    if (i === 0) {
      return d
    } else {
      return commonWords(tot, d)
    }
  })
}
// console.log('allergen map', allergenMap)

//  {
//   dairy: [ 'fkcmf', 'ktpbgdn' ],
//   shellfish: [ 'bfgcms', 'fkcmf', 'ktpbgdn' ],
//   eggs: [ 'hdqkqhh', 'ktpbgdn', 'pnpfjb' ],
//   peanuts: [ 'bfgcms', 'fkcmf', 'ndfb', 'pnpfjb', 'rdhljms' ],
//   wheat: [ 'fkcmf', 'hdqkqhh', 'ndfb' ],
//   sesame: [ 'xzfj' ],
//   fish: [ 'ndfb', 'xzfj' ],
//   soy: [ 'fkcmf', 'xzfj' ]
// }

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

const sum = Object.keys(meta).reduce((tot, key) => {
  if (reverseMap[key]) {
    return tot
  } else {
    return tot + meta[key]
  }
}, 0)
console.log(sum)
