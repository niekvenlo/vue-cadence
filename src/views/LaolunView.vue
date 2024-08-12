<script setup lang="ts">
import { computed, ref } from 'vue'
import { breakPinyinIntoSylables, getTones, makePseudorandomGenerator } from '@/utils'

const root = 'http://192.168.2.14:3333'

type Phrase = {
  label: string
  parts: string[][]
  pickOne: () => [string, string, string][][]
}

const millisecsInHour = 60 * 60 * 1000
const seed = Math.floor(Date.now() / millisecsInHour)
const gen = makePseudorandomGenerator(seed)

const getRandomElement = (arr: any[]) => arr[gen.next().value % arr.length]
const toShuffledPseudoRandom = <T,>(arr: T[] = []): T[] => {
  const copy = [...arr]
  for (let i = arr.length; i > 0; i--) {
    const random = gen.next().value % i
    ;[copy[i], copy[random]] = [copy[random], copy[i]]
  }
  return copy
}

const phrases = ref<undefined | Phrase[]>([])
fetch(`${root}/api/v1/getLaolun`, {})
  .then((response) => response.json())
  .then((json) => {
    const addPinyin = (segment: string) => {
      const segmentPinyinArr = breakPinyinIntoSylables(json.pinyin[segment])
      const segmentTonesArr = getTones(json.pinyin[segment])
      return segment
        .split('')
        .map(
          (hanzi, i) => [hanzi, segmentPinyinArr[i], segmentTonesArr[i]] as [string, string, string]
        )
    }
    phrases.value = (json.phrases as { label: string; parts: string[][] }[]).map((phrase) => ({
      ...phrase,
      pickOne: () => phrase.parts.map((part) => addPinyin(getRandomElement(part)))
    }))
  })

const shuffledPhrases = computed(() => {
  return toShuffledPseudoRandom(phrases.value)
})
</script>

<template>
  <div class="laolun">
    <div className="phrase" v-for="item in shuffledPhrases" :key="item?.label">
      <template :key="character.join()" v-for="character in item?.pickOne()">
        <span class="phrase-segment" :key="hanzi" v-for="[hanzi, pinyin, tone] in character">
          <span class="phrase-pinyin">{{ pinyin }}</span>
          <span class="phrase-tone">{{ tone || '&nbsp;' }}</span>
          <span class="phrase-hanzi">{{ hanzi }}</span>
        </span>
      </template>
      <span class="phrase-segment">
        <span class="phrase-pinyin">.</span>
        <span class="phrase-tone">.</span>
        <span class="phrase-hanzi">。</span>
      </span>
    </div>
  </div>
</template>

<style>
.laolun {
  padding: 1em 0.5em;
  min-height: 100vh;
  font-size: 1.2em;
  line-height: 2em;
  .phrase {
    display: contents;
    .phrase-segment {
      display: inline-flex;
      flex-direction: column;
      .phrase-pinyin {
        font-size: 0.3em;
        opacity: 0.5;
        user-select: none;
      }
      .phrase-tone {
        font-size: 1.2em;
        user-select: none;
        overflow: hidden;
        max-height: 0.6em;
      }
      .phrase-hanzi {
      }
      &:hover .phrase-pinyin {
        transform: scale(2);
        background: hsla(0, 0%, 100%, 0.9);
      }
    }
  }
}
@media (min-width: 1024px) {
  .laolun {
    padding: 1em 2em;
    min-height: 100vh;
    font-size: 1.4em;
  }
}
</style>
