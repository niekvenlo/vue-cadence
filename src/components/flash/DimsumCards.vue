<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DimsumCard from './DimsumCard.vue'

const props = defineProps<{
  cards: string[][] | null
  promptIdx: number | null
  responseIndices: number[]
  isOnlyOneColumn: boolean
}>()

const fronts = computed(() => props.cards?.map((c) => c[props.promptIdx ?? 0]) ?? [])
const backs = computed(
  () =>
    props.cards?.map((c) => {
      const b: string[] = []
      props.responseIndices.forEach((idx) => b.push(c[idx]))
      return b
    }) ?? []
)

const isPaused = ref(true)
const misses = ref<{ front: string; back: string[]; isCorrect: boolean }[]>([])
const hitsCount = ref(0)

const togglePause = () => {
  if (isPaused.value) {
    setTimeout(() => (isPaused.value = false), 300)
  } else {
    isPaused.value = true
  }
}

const resetCounters = () => {
  misses.value = []
  hitsCount.value = 0
}

watch(
  () => props.cards,
  () => {
    misses.value = []
    hitsCount.value = 0
  }
)
</script>

<style>
#dimsum-wrapper {
  display: flex;
  background: hsl(var(--color-angle), 100%, 30%);
  height: calc(100vh - var(--nav-height));
  max-width: 100vw;
  transition:
    height 1s,
    padding 1s;
  &:empty {
    height: 0;
    padding: 0;
  }
  .misses {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;
    width: 30vw;
    max-width: 30vw;
    max-height: calc(100vh - var(--nav-height) - 1em);
    overflow: scroll;
    & > div {
      width: 100%;
    }
    h1 {
      font-size: 1.6em;
      padding: 1em;
      display: flex;
      flex-wrap: wrap;
      gap: 0 1em;
    }
    .each-miss {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 0.1em 1em;
      padding: 1em;
      max-height: calc(80vh - var(--nav-height) - 5.2em);
      overflow-x: scroll;
      p {
        width: 40ch;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: sans-serif;
        font-style: italic;
        span {
          font-style: normal;
          font-family: serif;
          font-size: 1.2em;
        }
      }
    }
  }

  .cards-and-top-buttons {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .cards {
    width: 100%;
    flex-grow: 1;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 1em;
    padding: 1em;
    overflow-y: scroll;
    transition:
      scale 0.3s,
      filter 0.3s;
  }
  @media (orientation: portrait) {
    overflow: scroll;
    .cards-and-top-buttons,
    .misses {
      min-width: 100vw;
      max-width: 100vw;
    }
  }
  &.isPaused {
    .cards {
      scale: 0.9;
      filter: grayscale(40%);
    }
  }
}
</style>

<template>
  <div id="dimsum-wrapper" :class="{ isPaused }">
    <template v-if="promptIdx !== null && backs.length > 0 && backs[0].length > 0">
      <div class="cards-and-top-buttons">
        <button class="black" @click="togglePause">
          {{ isPaused ? 'Start' : 'Pause' }}
        </button>
        <div class="cards">
          <DimsumCard
            v-for="(_, idx) in Array.from({ length: 6 })"
            :key="idx"
            :fronts="fronts"
            :backs="backs"
            @miss="(e) => misses.push(e)"
            @hit="hitsCount++"
            :isPaused="isPaused"
            :cardId="['Q', 'W', 'A', 'S', 'Z', 'X'][idx]"
          />
        </div>
      </div>

      <div class="misses">
        <div>
          <button class="black" :disabled="misses.length === 0" @click="resetCounters">
            Clear
          </button>
          <h1>
            <span>misses: {{ misses.length }} </span><span>hits: {{ hitsCount }}</span>
          </h1>
        </div>
        <div>
          <div class="each-miss">
            <p v-for="(miss, idx) in [...misses].reverse()" :key="miss.front + idx">
              {{ miss.isCorrect ? '🟢' : '🟡' }} <span>{{ miss.front }}</span>
              {{ miss.isCorrect ? 'is' : 'is not' }} <span>{{ miss.back.join(', ') }}</span>
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
