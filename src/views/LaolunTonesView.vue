<script setup lang="ts">
import { computed, ref } from 'vue'
import { breakPinyinIntoSylables, getTones } from '@/utils'

const root =
  import.meta.env.VITE_SERVER_ROOT || 'http://62.131.229.29:3333' || 'http://192.168.2.14:3333'

type Phrase = {
  label: string
  parts: string[][]
  pickOne: () => [string, string, string][][]
}

const pinyinArray = ref<undefined | [string, string, string][]>()
fetch(`${root}/api/v1/getLaolun`, {})
  .then((response) => response.json())
  .then((json) => {
    pinyinArray.value = Object.entries(json.pinyin)
      .filter((o) => o[0].length === 2)
      .map((o) => [
        o[0],
        o[1],
        getTones(o[1] as string)
          .map((f) => f || '__')
          .join('')
      ]) as [string, string, string][]
  })

const names: Record<string, string> = {
  '◌̄': 'maybe',
  '◌̌': 'uhm',
  '◌́': 'ask',
  '◌̀': 'state',
  __: 'none'
}

const options = Object.keys(names)
  .map((k) => Object.keys(names).map((l) => `${k}${l}`))
  .flat()
</script>

<template>
  <div class="laolun">
    <template v-for="tonesstring in options">
      <template v-if="tonesstring[0] !== '_'">
        <h1>
          {{ tonesstring }}
          {{ names[tonesstring.split('').slice(0, 2).join('')] }}
          {{ names[tonesstring.split('').slice(2, 4).join('')] }}
        </h1>
        <span
          class="xxx"
          :key="hanzi"
          v-for="[hanzi, pinyin] of pinyinArray?.filter((o) => o[2] === tonesstring)"
        >
          {{ hanzi }}
        </span>
      </template>
    </template>
  </div>
</template>

<style>
.laolun {
  h1 {
    font-size: 1.2em;
    &:not(:first-of-type) {
      padding-top: 2em;
    }
  }
  padding: 1em 0.5em;
  min-height: 100vh;
  font-size: 1.2em;
  line-height: 2em;
  .xxx {
    padding-inline: 1ch;
  }
}

@media (prefers-color-scheme: dark) {
  .laolun {
    color: white;
    background: black;
  }
}
</style>
