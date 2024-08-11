<script setup lang="ts">
import { makePseudorandomGenerator } from '@/utils'
import { computed, ref } from 'vue'

const root = 'http://192.168.2.14:3333'

type Phrase = {
  label: string
  parts: string[][]
}

const phrases = ref<undefined | Phrase[]>(undefined)
const pinyin = ref<undefined | Map<string, string>>(undefined)

fetch(`${root}/api/v1/getLaolun`, {})
  .then((response) => response.json())
  .then((json) => {
    phrases.value = json.phrases
    pinyin.value = json.pinyin
  })

const gen = makePseudorandomGenerator(new Date().getHours())
const randomElement = (arr: any[]) => arr[gen.next().value % arr.length]

const shuffledPhrases = computed(() =>
  [...(phrases.value || [])].sort(() => (gen.next().value < gen.next().value ? -1 : 1))
)
</script>

<template>
  <div class="laolun">
    <div className="phrase" v-for="item in shuffledPhrases" :key="item.label">
      <template v-for="part in item.parts" :key="part.flat().join()">
        {{ randomElement(part) }}
      </template>
      。
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .laolun {
    padding: 1em 2em;
    min-height: 100vh;
    /* display: flex;
    flex-direction: column;
    flex-wrap: wrap; */
    font-size: 1.4em;
    line-height: 3em;
    gap: 1em;
    .phrase {
      display: contents;
    }
  }
}
</style>
