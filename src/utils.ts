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
