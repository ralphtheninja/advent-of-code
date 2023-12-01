const fs = require('fs')
const assert = require('assert')

function parseCli (cli, debug) {
  const folders = {}
  const dirStack = []

  function currentPath () {
    return dirStack.length === 1 ? '/' : dirStack.join('/')
  }

  function cd (arg) {
    assert(arg, 'cd should have an argument')
    // Note that '/' only happens once initially so no need to care about
    // resetting the current dir stack
    if (arg === '/') {
      dirStack.push('')
    } else if (arg === '..') {
      assert(dirStack.length >= 1, 'can only pop stack if we can go up')
      dirStack.pop()
    } else {
      dirStack.push(arg)
    }
    if (debug) console.log(`cd ${arg} (${currentPath()})`)
  }

  function isCommand (row) {
    return row.startsWith('$ ')
  }

  const length = cli.length
  for (let i = 0; i < length;) {
    const row = cli[i]
    if (isCommand(row)) {
      const cmd = row.slice(2)
      const [op, arg] = cmd.split(' ')
      if (op === 'cd') {
        cd(arg)
        ++i
      } else if (op === 'ls') {
        assert(!arg, 'ls should not have an argument')
        ++i
        const path = currentPath()
        if (debug) console.log('LISTING PATH', path)
        const listing = []
        for (let j = i; j < length; ++j, ++i) {
          const row = cli[j]
          if (!isCommand(row)) {
            if (row.startsWith('dir')) {
              const name = row.split(' ')[1]
              listing.push({ type: 'dir', name })
            } else {
              const [size, name] = row.split(' ')
              listing.push({ type: 'file', name, size: Number(size) })
            }
          } else {
            break
          }
        }
        folders[currentPath()] = listing
      } else {
        assert(false, 'should not happen, only cd and ls commands')
      }
    } else {
      assert(false, 'should not happen since we read out files in ls mode')
    }
  }

  return folders
}

function dirSize (tree, dir) {
  const listing = tree[dir]
  assert(Array.isArray(listing))

  let totalSize = 0
  for (const item of listing) {
    if (item.type === 'file') {
      totalSize += item.size
    } else if (item.type === 'dir') {
      const nextFolder = dir === '/' ? `/${item.name}` : `${dir}/${item.name}`
      totalSize += dirSize(tree, nextFolder)
    } else {
      assert(false, 'only file and dir should be possible')
    }
  }

  return totalSize
}

function sumTotal (tree) {
  const allSizes = Object.keys(tree).map(name => {
    return { name, size: dirSize(tree, name) }
  })
  return allSizes.reduce((tot, folder) => {
    return folder.size < 100000 ? tot + folder.size : tot
  }, 0)
}

/*
function test () {
  const cli = fs.readFileSync('./test-data.txt', 'utf8').split('\n').filter(Boolean)
  const tree = parseCli(cli)
  console.log('tree', tree)
  assert.equal(dirSize(tree, '/a/e'), 584)
  assert.equal(dirSize(tree, '/d'), 24933642)
  assert.equal(dirSize(tree, '/a'), 94853)
  assert.equal(dirSize(tree, '/'), 48381165)

  assert.equal(sumTotal(tree), 95437)
}
test()
*/

function run (debug) {
  const cli = fs.readFileSync('./data.txt', 'utf8').split('\n').filter(Boolean)
  const tree = parseCli(cli, debug)
  if (debug) console.log('tree', tree)
  return sumTotal(tree)
}

console.log('result', run())
