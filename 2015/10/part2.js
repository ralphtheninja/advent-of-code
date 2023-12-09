function next (seq) {
  let result = ''
  let i = 0
  do {
    const first = seq[i++]
    let subSeq = first

    while (i < seq.length) {
      const next = seq[i]
      if (next === first) {
        subSeq += next
        i++
      } else {
        break
      }
    }

    result += `${subSeq.length}${subSeq[0]}`
  } while (i < seq.length)
  return result
}

function repeat (n, seq) {
  let result = seq
  for (let i = 0; i < n; ++i) {
    result = next(result)
  }
  return result
}

console.log('result', repeat(50, '1113222113').length)
