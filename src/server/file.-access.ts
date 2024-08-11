import fs from 'fs/promises'

type Phrase = {
  label: string
  parts: string[][]
  isValidateGrammar?: boolean
  isFocusedLearning?: boolean
}
type Phrases = Phrase[]
type Pinyin = Map<string, string>

const phrasesJsonFilePath = 'src/server/data/phrases.json'
const pinyinJsonFilePath = 'src/server/data/pinyin.json'

const readPhrases = async () => JSON.parse(await fs.readFile(phrasesJsonFilePath, 'utf-8'))
const writePhrases = (data: Phrases) =>
  fs.writeFile(phrasesJsonFilePath, JSON.stringify(data, null, 2), 'utf-8')

const readPinyin = async () => JSON.parse(await fs.readFile(pinyinJsonFilePath, 'utf-8'))
const writePinyin = (data: Pinyin) =>
  fs.writeFile(pinyinJsonFilePath, JSON.stringify(data, null, 2), 'utf-8')

export const getLaolun = async () => ({
  phrases: await readPhrases(),
  pinyin: await readPinyin()
})

export const setLaolun = ({ phrases, pinyin }: { phrases: Phrases; pinyin: Pinyin }) => {
  if (pinyin) {
    writePinyin(pinyin)
  }
  if (phrases) {
    writePhrases(phrases)
  }
}
