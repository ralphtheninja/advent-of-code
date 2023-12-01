const fs = require('fs')

const NUMBERS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine'
]

/**
 * Get the next number from a string and return the tail
 */
function getNext (line) {
  if (!line) { return { value: undefined, rest: '' } }

  // Check if the first character is a number
  const c = line[0]
  if (!isNaN(Number(c))) {
    return { value: Number(c), rest: line.substring(1) }
  }

  // First check if the string starts with one of the numbers in letters
  for (let i = 0; i < NUMBERS.length; ++i) {
    const N = NUMBERS[i]
    if (line.startsWith(N)) {
      return { value: i + 1, rest: line.substring(N.length) }
    }
  }

  // Otherwise we recurse down
  return getNext(line.substring(1))
}

function lineToNumber (line) {
  let first, last
  while (true) {
    const { value, rest } = getNext(line)
    if (value) {
      if (!first) {
        first = value
      }
      last = value
    }
    if (rest) {
      line = rest
    } else {
      break
    }
  }

  return 10 * first + last
}

function run (file) {
  const data = fs.readFileSync(file, 'utf8')
  const lines = data.split('\n').filter(Boolean)
  const digits = lines.map(lineToNumber)
  console.log('lines.length', lines.length)
  return digits.reduce((tot, el) => tot + el, 0)
}

// const assert = require('assert')

// assert.deepEqual(getNext('two1nine'), { value: 2, rest: '1nine' })
// assert.deepEqual(getNext('1nine'), { value: 1, rest: 'nine' })
// assert.deepEqual(getNext('nine'), { value: 9, rest: '' })

// assert.equal(lineToNumber('two1nine'), 29)
// assert.equal(lineToNumber('eightwothree'), 83)
// assert.equal(lineToNumber('abcone2threexyz'), 13)

// assert.deepEqual(getNext('2threexyz'), { value: 2, rest: 'threexyz' })
// assert.deepEqual(getNext('threexyz'), { value: 3, rest: 'xyz' })
// assert.deepEqual(getNext('xyz'), { value: undefined, rest: '' })

// assert.equal(lineToNumber('two1nine'), 29)
// assert.equal(lineToNumber('eighttwothree'), 83)
// assert.equal(lineToNumber('abcone2threexyz'), 13)
// assert.equal(lineToNumber('xtwone3four'), 24)
// assert.equal(lineToNumber('4nineeightseven2'), 42)
// assert.equal(lineToNumber('zoneight234'), 14)
// assert.equal(lineToNumber('7pqrstsixteen'), 76)

// assert.equal(run('./test-data2.txt'), 281)

// assert.equal(lineToNumber('5ffour295'), 55)
// assert.equal(lineToNumber('m9qvkqlgfhtwo3seven4seven'), 97)
// assert.equal(lineToNumber('2vdqng1sixzjlkjvq'), 26)
// assert.equal(lineToNumber('5twonineeight3onefive'), 55)
// assert.equal(lineToNumber('2three2seveneightseven'), 27)
// assert.equal(lineToNumber('eightsevenfive3bcptwo'), 82)
// assert.equal(lineToNumber('five8six'), 56)
// assert.equal(lineToNumber('twonineseven24one3'), 23)
// assert.equal(lineToNumber('one8bdxplbtfninefourspqn'), 14)
// assert.equal(lineToNumber('nineeight3fiveseven'), 97)
// assert.equal(lineToNumber('xmkhttr64htgvhjfivefcjlzjqrsjlfivekbcnhqpzg'), 65)
// assert.equal(lineToNumber('261flvsthree'), 23)
// assert.equal(lineToNumber('one2mgnphzcx45rmnffneight'), 18)
// assert.equal(lineToNumber('sevenfivesixzvpone8f1plj'), 71)
// assert.equal(lineToNumber('ccthpbg6six3'), 63)
// assert.equal(lineToNumber('f1hzds5kfdsj'), 15)
// assert.equal(lineToNumber('qkneightwofourninejzjfmkjv8eightthdtp'), 88)
// assert.equal(lineToNumber('eight62rvkjphrdtwoseventwo28'), 88)
// assert.equal(lineToNumber('eight33'), 83)
// assert.equal(lineToNumber('sevenkzvnkj5ftone'), 71)
// assert.equal(lineToNumber('76sixrcznjkthreethree72nf'), 72)
// assert.equal(lineToNumber('5nnine'), 59)
// assert.equal(lineToNumber('3cjseventhreen'), 33)
// assert.equal(lineToNumber('sixsix18ctxvtxbs'), 68)
// assert.equal(lineToNumber('7mksmd9threetnkbtwo'), 72)
// assert.equal(lineToNumber('7hxnrgnl8'), 78)
// assert.equal(lineToNumber('vq3dcgtlzgfives8kthone7'), 37)
// assert.equal(lineToNumber('76tmpjjvbzzclfour'), 74)
// assert.equal(lineToNumber('ptwonefive2threekfrtvnbmplpsevenseven'), 27)

// assert.equal(lineToNumber('fivetwo26threeone7eight3'), 53)
// assert.equal(lineToNumber('lxlzzhfkfive4eight2fivezqkdxczbmndvflrsq'), 55)
// assert.equal(lineToNumber('71nineseven5one58'), 78)
// assert.equal(lineToNumber('fivelncljrgtxkdq51gnnpvtsbnine3five'), 55)
// assert.equal(lineToNumber('mjlrpthgvz57skzbs24fourtwoneklr'), 52)
// assert.equal(lineToNumber('njqlhp39five'), 35)
// assert.equal(lineToNumber('8xxmstonetwolhlcgzcpqb'), 82)
// assert.equal(lineToNumber('8gjqlbgfive'), 85)
// assert.equal(lineToNumber('xcdssbrltmf8sevenkxntdzgfsv'), 87)
// assert.equal(lineToNumber('vhgjfxeightvfvpgcxsnineninepkrjtqtseven7'), 87)
// assert.equal(lineToNumber('two3ztllvnrmg7fivetwo'), 22)
// assert.equal(lineToNumber('five1jspfivethree1one'), 51)
// assert.equal(lineToNumber('5stkpqcjhxvmrn'), 55)
// assert.equal(lineToNumber('three3six12fourkdmlgfbflm'), 34)
// assert.equal(lineToNumber('7sixeightnnjnc4one7four'), 74)
// assert.equal(lineToNumber('4bqszrqnfzl9nlp'), 49)
// assert.equal(lineToNumber('two3threesnjpncrjljpcxhjdzxqcjcjbktvxjgvnfp'), 23)
// assert.equal(lineToNumber('36tworrhlh'), 32)
// assert.equal(lineToNumber('43trbqvgrrsjbrxhk'), 43)
// assert.equal(lineToNumber('eight7five'), 85)
// assert.equal(lineToNumber('four934eight8three'), 43)
// assert.equal(lineToNumber('9zjzhmtkt4bvljpttc25sixsix'), 96)
// assert.equal(lineToNumber('twotwocmzcczsjz2qcslmnjl1pqfjqfhlpmtjlpzpjhffxr'), 21)
// assert.equal(lineToNumber('4fseven'), 47)
// assert.equal(lineToNumber('sevennvxlnineph8ninefqbm'), 79)
// assert.equal(lineToNumber('2611five42'), 22)
// assert.equal(lineToNumber('two7nine'), 29)
// assert.equal(lineToNumber('7eightfour7gh19'), 79)
// assert.equal(lineToNumber('71kzdvkfbqnineonetwo'), 72)
// assert.equal(lineToNumber('onesixnine325'), 15)
// assert.equal(lineToNumber('5cbtbckx4vhtslbk'), 54)
// assert.equal(lineToNumber('eightdgczsgkc5seventlsfd'), 87)
// assert.equal(lineToNumber('xdljsnqjctzmmxcgxctdxxg73four'), 74)
// assert.equal(lineToNumber('2shjqglxct5rctbmgvfvjfvrqsvdmthree'), 23)
// assert.equal(lineToNumber('three71onekbksz8'), 38)
// assert.equal(lineToNumber('ninesevenzrcxnnbvninetwoftsvg39'), 99)
// assert.equal(lineToNumber('twofour36'), 26)
// assert.equal(lineToNumber('onerddzfgdnpkjxlbh9twojbtqk'), 12)
// assert.equal(lineToNumber('jjcnine59lgcttxncsix'), 96)
// assert.equal(lineToNumber('ninesevenone76zrtmvdponeprfszns'), 91)
// assert.equal(lineToNumber('bzrxtwocqczcmkdlnjtwor7'), 27)
// assert.equal(lineToNumber('sixjqcgcl973one5eight'), 68)
// assert.equal(lineToNumber('freightwo7three'), 83)
// assert.equal(lineToNumber('dnzdrnthreemlqvrjspl79kfkfrbjm6czkzqvqp'), 36)
// assert.equal(lineToNumber('two7953mftrgpkxjmrpvn'), 23)
// assert.equal(lineToNumber('xone4vqljzqrspsgdhvnsgsptwo4'), 14)
// assert.equal(lineToNumber('2612fvhthree'), 23)
// assert.equal(lineToNumber('one3nine'), 19)
// assert.equal(lineToNumber('8five9onetwo'), 82)
// assert.equal(lineToNumber('fourtwo45sixxkjgdvrpltlnrtdbbpjjmqq'), 46)
// assert.equal(lineToNumber('four1fiveonenine6'), 46)
// assert.equal(lineToNumber('4three4'), 44)
// assert.equal(lineToNumber('qkjpskjglpeightjnc8two'), 82)
// assert.equal(lineToNumber('eight85sixfour'), 84)
// assert.equal(lineToNumber('53fivefive'), 55)
// assert.equal(lineToNumber('lbmqqpdbpnppzzmttmbpkxbl6sixfour'), 64)
// assert.equal(lineToNumber('ninemlm7'), 97)

// assert.equal(lineToNumber('mbvxvl2'), 22)
// assert.equal(lineToNumber('1vpszgjvdbd'), 11)
// assert.equal(lineToNumber('7qd7two3onesevenkkgnnlztzxs'), 77)
// assert.equal(lineToNumber('cqrnn1ninefxpglvtkf1'), 11)
// assert.equal(lineToNumber('7sixvnknzqpnhvsix6tbfnljfoursixrjzqxctmq'), 76)
// assert.equal(lineToNumber('five889four'), 54)
// assert.equal(lineToNumber('5rvsk7tsljtfivefour'), 54)
// assert.equal(lineToNumber('prkhvq61clveight9dcvcfsr'), 69)
// assert.equal(lineToNumber('four6ninenp2'), 42)
// assert.equal(lineToNumber('xoneight2five3fqmc6zrgcbzbzghpvbzt'), 16)
// assert.equal(lineToNumber('sixghxgbjfivesxrth5frzxcjfivegnktshzrpmbdlp'), 65)
// assert.equal(lineToNumber('6prgnxdseven2ggcqhc88'), 68)
// assert.equal(lineToNumber('five46'), 56)
// assert.equal(lineToNumber('4bmvzlbcsggseventhreefivesix66'), 46)
// assert.equal(lineToNumber('pzkljhppcmpnnng4'), 44)
// assert.equal(lineToNumber('ninefivemqnjsmkgtnzzstrq55'), 95)
// assert.equal(lineToNumber('one4lveightqjhjjzmrtwo97sctp'), 17)
// assert.equal(lineToNumber('3vzdmk'), 33)
// assert.equal(lineToNumber('lrzj71215'), 75)
// assert.equal(lineToNumber('three78ddzzmvfxfzsqtkdqtfsnk5'), 35)
// assert.equal(lineToNumber('db7'), 77)
// assert.equal(lineToNumber('deightwofour9eight63foursixcgllm'), 86)
// assert.equal(lineToNumber('123'), 13)
// assert.equal(lineToNumber('sevenninegtphtjkkbhdx6sqbggcbljx4'), 74)
// assert.equal(lineToNumber('8qtk4'), 84)
// assert.equal(lineToNumber('thvml91nngfjgrsfive2three'), 93)
// assert.equal(lineToNumber('17nine92twojkvmfrmpqhtlk'), 12)
// assert.equal(lineToNumber('ninetworcvtjc76'), 96)
// assert.equal(lineToNumber('5jrzpvgchg7tlfdlbfmxj8stb'), 58)
// assert.equal(lineToNumber('3t6sixjtnjxhxnfv'), 36)
// assert.equal(lineToNumber('9f2skxmzgnthreenine'), 99)
// assert.equal(lineToNumber('8sevenonethreeeightsixthree'), 83)
// assert.equal(lineToNumber('csrcdmtmscqvqkpthreepfour86'), 36)
// assert.equal(lineToNumber('threeseveneightfour5zsgfour'), 34)
// assert.equal(lineToNumber('onellbgsvseven9'), 19)
// assert.equal(lineToNumber('rnnkxtbnx1threekbddbpzthreerxcnbcgx'), 13)
// assert.equal(lineToNumber('jbvlsxdxsixxjj65one5fours'), 64)
// assert.equal(lineToNumber('kzsix4zg8fgmzc'), 68)
// assert.equal(lineToNumber('mkfpflcpkd37'), 37)
// assert.equal(lineToNumber('5sixthreefivectltwo94eight'), 58)
// assert.equal(lineToNumber('fponeight86phxr'), 16)
// assert.equal(lineToNumber('278dmxscxb42'), 22)
// assert.equal(lineToNumber('five86'), 56)
// assert.equal(lineToNumber('63jqkh7sixnine1jmqsqtdhpg'), 61)
// assert.equal(lineToNumber('zxchvfnvskctd9'), 99)
// assert.equal(lineToNumber('64sgddnvnm6five37rzhpzlccz4'), 64)
// assert.equal(lineToNumber('69nzlzkrkqt9ninehqrmvklgq234'), 64)
// assert.equal(lineToNumber('qqtc2pdzzddgjrfhcvsbrbstwo4pdl'), 24)
// assert.equal(lineToNumber('ninegjlqdclpmgcjfdqhhsl7n'), 97)
// assert.equal(lineToNumber('voneight6'), 16)
// assert.equal(lineToNumber('onevfqrnvpm9mfkgseightonemrpj'), 11)
// assert.equal(lineToNumber('9twosixfivexz'), 95)
// assert.equal(lineToNumber('1mlbvlninepjvn1onesixfour'), 14)
// assert.equal(lineToNumber('1one33fiveeightfour'), 14)
// assert.equal(lineToNumber('onevsrlmzfivefour11'), 11)
// assert.equal(lineToNumber('5gpfqbtn9sevenninefiveseven'), 57)
// assert.equal(lineToNumber('8six8oner3vxgttfhtlnnine'), 89)
// assert.equal(lineToNumber('qc1kcpnpqdthreeeightwoj'), 18)
// assert.equal(lineToNumber('v8onefive'), 85)
// assert.equal(lineToNumber('8eight56kkpnbzvczmkxtzkjbcm1'), 81)
// assert.equal(lineToNumber('1threegeightcjb5pdpz29'), 19)
// assert.equal(lineToNumber('ttxcmthreekdsxdfxvrclfn4sixfive69'), 39)
// assert.equal(lineToNumber('zgddz389'), 39)
// assert.equal(lineToNumber('2one344nkxtsvf762'), 22)
// assert.equal(lineToNumber('klncdshlrkpfrxflsncnfmtg5'), 55)
// assert.equal(lineToNumber('trvmkbjvreight2kdhxfvlz3ds'), 83)
// assert.equal(lineToNumber('seven57xqrzmcsnjftfthreeonetwofive'), 75)

// twone at the end
// assert.equal(lineToNumber('5five686lvmlgk4twonefmr'), 51)

// oneight
// assert.equal(lineToNumber('2fivedxlntgmgjtwooneightt'), 28)

// assert.equal(lineToNumber('six1khm82xronexqhzjdqzx'), 0)
// assert.equal(lineToNumber('zldbsjcsnine6vkdslrmtnpthree2'), 0)
// assert.equal(lineToNumber('tbbtcl5xnsrjdz'), 0)
// assert.equal(lineToNumber('1pqxgmnc1'), 0)
// assert.equal(lineToNumber('3ninefckfrppvdlmf7'), 0)
// assert.equal(lineToNumber('cprpq7three9twobql'), 0)
// assert.equal(lineToNumber('fivexgjsgvpd12lzvcbpstpsprdvs'), 0)
// assert.equal(lineToNumber('eightone2'), 0)
// assert.equal(lineToNumber('4threeninexhdcxrffive414'), 0)
// assert.equal(lineToNumber('79sxxtpxtpmj'), 0)
// assert.equal(lineToNumber('37nine'), 0)
// assert.equal(lineToNumber('mfmgtz32smkgxgmnk'), 0)
// assert.equal(lineToNumber('68sevenhmchv'), 0)
// assert.equal(lineToNumber('skjxk9shvdrznrrz5onetbdcjmk73'), 0)
// assert.equal(lineToNumber('865seven'), 0)
// assert.equal(lineToNumber('4twofivesixbtqjcjthreeeight'), 0)
// assert.equal(lineToNumber('64fxctcljfsixninedxdbthree'), 0)
// assert.equal(lineToNumber('rgxzttr21vnvgbcfceight91'), 0)
// assert.equal(lineToNumber('jseven422onerzpxvgjpd'), 0)
// assert.equal(lineToNumber('twofkktmpvcb4zngnnpdsixtwokgxcgk'), 0)
// assert.equal(lineToNumber('xhcddkcvjpcb4354'), 0)
// assert.equal(lineToNumber('88eightsevenseven'), 0)
// assert.equal(lineToNumber('2twoqpxtqlccksixthreetwotwo'), 0)
// assert.equal(lineToNumber('vqnlmpsixvpbxdnsfive4'), 0)
// assert.equal(lineToNumber('fourfivefive6one'), 0)
// assert.equal(lineToNumber('7xlkzc4'), 0)
// assert.equal(lineToNumber('17klxs'), 0)
// assert.equal(lineToNumber('snml9'), 0)
// assert.equal(lineToNumber('ninepzvg964hqczmdfvnbvrkngrs'), 0)
// assert.equal(lineToNumber('76nine5twosnm86'), 0)
// assert.equal(lineToNumber('prjrjfxffczhv4six'), 0)
// assert.equal(lineToNumber('eight53twonine'), 0)
// assert.equal(lineToNumber('tkjh2eightjh'), 0)
// assert.equal(lineToNumber('k2zsfdsm'), 0)
// assert.equal(lineToNumber('four1hlxxvgqcgvhcdcjrr68'), 0)
// assert.equal(lineToNumber('onethree4nine844threetwo'), 0)
// assert.equal(lineToNumber('94twonedsn'), 0)
// assert.equal(lineToNumber('2four3five4tgpkrjdmdfrbjddkxv'), 0)
// assert.equal(lineToNumber('3cnsj'), 0)
// assert.equal(lineToNumber('oneninetwo3cpfrdhnrbrd4'), 0)
// assert.equal(lineToNumber('2nfcbffx1qhszkhkmmeightnine8v'), 0)
// assert.equal(lineToNumber('4three6llthreemrpztjb'), 0)
// assert.equal(lineToNumber('53xksczcvmdsixnmxvqcctpv1'), 0)
// assert.equal(lineToNumber('xzhhpr66threeblplpkmktp9pgseven'), 0)
// assert.equal(lineToNumber('seven63twoneb'), 0)
// assert.equal(lineToNumber('9btlntpndseventwovtnplnqldthreenine'), 0)
// assert.equal(lineToNumber('nthreeseven4five'), 0)
// assert.equal(lineToNumber('zpktwone1gjzntpllkghhsqqsix8p'), 0)
// assert.equal(lineToNumber('eightfourlcrkqcjfsheightfive69'), 0)
// assert.equal(lineToNumber('hvkv8'), 0)
// assert.equal(lineToNumber('four93dzrfive9eightthree8'), 0)
// assert.equal(lineToNumber('9fivecfour47threecpcjbf'), 0)
// assert.equal(lineToNumber('pb1one8two'), 0)
// assert.equal(lineToNumber('seven64twofivefoursix'), 0)
// assert.equal(lineToNumber('hgjjjj7mkxztspmzvbdcbbfkone'), 0)
// assert.equal(lineToNumber('mkdmqzfpkvqfcfiveshstxgnrs9fzzdr'), 0)
// assert.equal(lineToNumber('ssddfgcd2three'), 0)
// assert.equal(lineToNumber('xzzrrxm28seven'), 0)
// assert.equal(lineToNumber('1nffqfjtmftwothreeninerqbthmhkhseven'), 0)
// assert.equal(lineToNumber('lkbbgsjmbtpgncfive63'), 0)
// assert.equal(lineToNumber('jddsdrkmhkthreefoursixone1'), 0)
// assert.equal(lineToNumber('6nine5ngdcninemq7xqlsmdkgjf'), 0)
// assert.equal(lineToNumber('eightfhppf3f9jgdvzldxltrgg2'), 0)
// assert.equal(lineToNumber('3nszqpfth9338six'), 0)
// assert.equal(lineToNumber('srmhtvn46five8four'), 0)
// assert.equal(lineToNumber('6qqttwoeightthree'), 0)
// assert.equal(lineToNumber('threedpqxmlghsgls8sixsslthdfzdknmjeight'), 0)
// assert.equal(lineToNumber('rtwone66four2'), 0)
// assert.equal(lineToNumber('six4dt5one1'), 0)
// assert.equal(lineToNumber('xrmlvrfpmtttvppc5'), 0)
// assert.equal(lineToNumber('34fivesixfivesix'), 0)
// assert.equal(lineToNumber('1rnrtkbqlpphqlch52eight'), 0)
// assert.equal(lineToNumber('fourgbr19'), 0)
// assert.equal(lineToNumber('79sixfoureight8'), 0)
// assert.equal(lineToNumber('kdlqxjzdx7mrdqpeightzgdx'), 0)
// assert.equal(lineToNumber('1eight6254dplmqrpkq1'), 0)
// assert.equal(lineToNumber('sevenvqpnd222'), 0)
// assert.equal(lineToNumber('mpddrhlncrp1fivev69znxthree'), 0)
// assert.equal(lineToNumber('87znxjsmsvlzxbfivesevenrgghkbrsdq5'), 0)
// assert.equal(lineToNumber('5rxbkctnsfeightxpbllldgjxqdrd3dmt'), 0)
// assert.equal(lineToNumber('6twog48eightone'), 0)
// assert.equal(lineToNumber('2sixfour'), 0)
// assert.equal(lineToNumber('433onexklbhneightfour'), 0)
// assert.equal(lineToNumber('eight5hjlmdsnzxeight1'), 0)
// assert.equal(lineToNumber('9fvqtc'), 0)
// assert.equal(lineToNumber('ltmcrnhrpqtwo7five9'), 0)
// assert.equal(lineToNumber('six55'), 0)
// assert.equal(lineToNumber('mpsjhvbxmkpppfjhdjlgcrvkzpvds6htl'), 0)
// assert.equal(lineToNumber('jldzmj671vzljbmrjtwo'), 0)
// assert.equal(lineToNumber('rsznrsrtcz2threerk5ggdrtfmktrjjrdpjvvhshhqszzmbzp'), 0)
// assert.equal(lineToNumber('nine53v'), 0)
// assert.equal(lineToNumber('6khbvone'), 0)
// assert.equal(lineToNumber('tvzoneight5khzglntxjgb'), 0)
// assert.equal(lineToNumber('qtgx9zhtrqcnlblvrsngsfkeightninefvlnpjbxsix'), 0)
// assert.equal(lineToNumber('tljmkjbb1kncvqsix9jthkqlkvkztjjbtrbqjxjmrblzzjfive'), 0)
// assert.equal(lineToNumber('eight6l'), 0)
// assert.equal(lineToNumber('47qxgjthreeeightwohp'), 0)
// assert.equal(lineToNumber('lqponeightggj4smzdbzqg86three'), 0)
// assert.equal(lineToNumber('75znine'), 0)
// assert.equal(lineToNumber('nvqgzfx4five'), 0)
// assert.equal(lineToNumber('five8pks78fourdbspf'), 0)
// assert.equal(lineToNumber('seventczx3threeninemlsevenmvntwo'), 0)
// assert.equal(lineToNumber('one59tqqxbjhp'), 0)
// assert.equal(lineToNumber('six5threehgmcnpvone6bsix4'), 0)
// assert.equal(lineToNumber('eightsixckfpcffour4'), 0)

// At first try I got 53551 which was too high. After trying
// out some strings manually I realized that some numbers
// were mixed with each other, e.g. as below:

// one + eight => oneight (16)
// two + one => twone (14)
// three + eight => threeight (0)
// five + eight => fiveight (0)
// seven + nine => sevenine (0)
// eight + two => eightwo (16)
// eight + three => eighthree (0)

// This is a problem for my code since it assumes each number
// is completely separate from the next one.

// Instead of rewriting the code I decided to search/replace
// the following strings:

// oneight -> oneeight
// twone -> twoone
// eightwo -> eighttwo

console.log('result', run('./data.txt'))
