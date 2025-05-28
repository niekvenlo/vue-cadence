export const getCurrentEpochDay = () => Math.floor(Date.now() / 8.64e7)

export function* makePseudorandomGenerator(seed = Date.now(), max = Infinity): Generator<number> {
  let value = seed
  while (true) {
    value = (value * 16807) % 2147483647
    yield value % max
  }
}

const accents: Record<string, string> = {
  ǎ: '◌̌',
  ě: '◌̌',
  ǐ: '◌̌',
  ǔ: '◌̌',
  ǒ: '◌̌',

  ā: '◌̄',
  ē: '◌̄',
  ī: '◌̄',
  ō: '◌̄',
  ū: '◌̄',

  à: '◌̀',
  è: '◌̀',
  ì: '◌̀',
  ò: '◌̀',
  ù: '◌̀',

  á: '◌́',
  í: '◌́',
  é: '◌́',
  ó: '◌́',
  ú: '◌́',

  ǚ: '◌̌',
  ǜ: '◌̀',

  '': ''
}
export const getTones = (string: string = '') => {
  return string
    .split(/[-'abcdfghjklmnpqrstvwxyz]|\s/)
    .filter((d) => d)
    .map((d) => d.replace(/\w/g, ''))
    .map((d) => accents[d] || '')
}
export const breakPinyinIntoSylables = (string: string = '') => {
  return string.split(/[-]|[']|\s/).filter((d) => d)
}

export const breakRawPinyin = (string = '') =>
  string
    .replace(/([aieouǎěǐǔǒāēīōūàèìòùáíéóúǚǜ])([bcdfghjklmpqstvwxyz])/g, '$1-$2')
    .replace(/(n)([bcdfhjklmnpqstwxyz])/g, '$1-$2')
    .replace(/(r)([fhlmpqsyz])/g, '$1-$2') //
    .replace(/(ng)([abcdfgjklmnpqstuwxyz])/g, '$1-$2')
    .replace(/([?,])/g, ' $1 ')

export function toChunk<T>(array: T[], size: number): T[][] {
  const chunks: any[] = []
  for (let i = 0; i < array.length; i = i + size) {
    chunks.push(array.slice(i, i + size).filter((o) => o))
  }
  return chunks
}

const millisecsInHour = 60 * 60 * 1000
const seed = Math.floor(Date.now() / (millisecsInHour * 3))
const gen = makePseudorandomGenerator(seed)

export const getPseudoRandomElement = (arr: any[]) => arr[gen.next().value % arr.length]
export const toShuffledPseudoRandom = <T>(arr: T[] = []): T[] => {
  const copy = [...arr]
  for (let i = arr.length; i > 0; i--) {
    const random = gen.next().value % i
    ;[copy[i], copy[random]] = [copy[random], copy[i]]
  }
  return copy.filter((o) => o)
}

export const getPseudoRandomNumber = (limit: number) => gen.next().value % limit

export const shuffleArray = (array: any[]) => {
  let currentIndex = array.length
  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}

export const numIsBetween = (num: number, low: number, high: number) => {
  return num >= low && num < high
}
