<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  breakPinyinIntoSylables,
  getPseudoRandomElement,
  getPseudoRandomNumber,
  getTones,
  toChunk,
  toShuffledPseudoRandom
} from '@/utils'

const root =
  import.meta.env.VITE_SERVER_ROOT || 'http://62.131.229.29' || 'http://192.168.2.14:3333'

type Phrase = {
  label: string
  parts: string[][]
  pickOne: () => [string, string, string][][]
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
    const intermediateValue = json.phrases as { label: string; parts: string[][] }[]
    const selectedPhrases = [
      ...toShuffledPseudoRandom(
        intermediateValue.filter((_, idx, arr) => getPseudoRandomNumber(arr.length - idx) < 10)
      ),
      ...toShuffledPseudoRandom(
        intermediateValue.filter((_, idx, arr) => getPseudoRandomNumber(arr.length - idx) < 10)
      )
    ]
    phrases.value = selectedPhrases.map((phrase) => ({
      ...phrase,
      pickOne: () => phrase.parts.map((part) => addPinyin(getPseudoRandomElement(part)))
    }))
  })

const shuffledPhrases = computed(() => toChunk(phrases.value || [], 20))
</script>

<template>
  <div class="laolun">
    {{ phrases?.length }}
    <div class="page" :key="chunk[0]?.label" v-for="(chunk, index) of shuffledPhrases">
      <p class="page-number">
        <span>第 {{ index + 1 }} 页</span>
      </p>
      <div class="phrase" v-for="item in chunk" :key="item?.label">
        <template v-for="characters in item?.pickOne()">
          <span class="character" :key="hanzi" v-for="[hanzi, pinyin, tone] in characters">
            <span class="phrase-pinyin">{{ pinyin || '&nbsp;' }}</span>
            <span class="phrase-tone">{{ tone || '&nbsp;' }}</span>
            <span class="phrase-hanzi">{{ hanzi }}</span>
          </span>
        </template>
        <span class="character full-stop">
          <span class="phrase-pinyin">.</span>
          <span class="phrase-tone">.</span>
          <span class="phrase-hanzi">。</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style>
.laolun {
  padding: 1em 0.5em;
  min-height: 100vh;
  font-size: 1.2em;
  line-height: 2em;
  .page-number {
    display: flex;
    justify-content: flex-end;
    opacity: 0.7;
  }
  .phrase {
    display: flex;
    justify-content: center;
    .character {
      display: inline-flex;
      flex-direction: column;
      /* align-items: center; */
      .phrase-pinyin {
        font-size: 0.3em;
        opacity: 0.5;
        user-select: none;
      }
      .phrase-tone {
        font-size: 1.2em;
        user-select: none;
        overflow: hidden;
        max-height: 0.63em;
      }
      .phrase-hanzi {
      }
      &:hover .phrase-pinyin {
        transform: scale(2);
        background: hsla(0, 0%, 100%, 0.9);
      }
      &.full-stop {
        padding-inline-end: 1em;
      }
    }
  }
}
@media (prefers-color-scheme: dark) {
  .laolun {
    color: white;
    background: black;
    .phrase .character:hover .phrase-pinyin {
      background: hsla(0, 0%, 0%, 0.9);
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
