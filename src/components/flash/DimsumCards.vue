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
  () => props.cards?.map((c) => c.filter((_, i) => props.responseIndices.includes(i))) ?? []
)

const isPaused = ref(false)
const misses = ref<{ front: string; back: string[]; isCorrect: boolean }[]>([])
const hitsCount = ref(0)

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
    width: 30vw;
    max-width: 30vw;
    max-height: calc(100vh - var(--nav-height));
    font-size: 1.2em;
    overflow: scroll;
    padding: 1rem;
    h1 {
      font-size: 1.4em;
    }
    .each-miss {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 0.1em 1em;
      max-height: calc(80vh - var(--nav-height));
    }
  }

  .cards {
    width: 50vw;
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
    .cards,
    .misses {
      min-width: 100vw;
      max-width: 100vw;
    }
    .misses {
      padding: 3em;
    }
  }
  &.isPaused {
    .cards {
      scale: 0.9;
      filter: grayscale(80%);
    }
  }
}
</style>

<template>
  <div id="dimsum-wrapper" :class="{ isPaused }">
    <template v-if="promptIdx !== null && backs.length > 0 && backs[0].length > 0">
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
      <div class="misses">
        <button class="black" @click="isPaused = !isPaused">
          {{ isPaused ? 'Continue' : 'Pause' }}
        </button>
        <h1>misses: {{ misses.length }} hits: {{ hitsCount }}</h1>
        <div class="each-miss">
          <p v-for="(miss, idx) in [...misses].reverse()" :key="miss.front + idx">
            {{ miss.isCorrect ? '🟢' : '🟡' }} {{ miss.front }}
            {{ miss.isCorrect ? 'is' : 'is not' }} {{ miss.back.join(', ') }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
