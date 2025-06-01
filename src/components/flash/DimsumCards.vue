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
  justify-content: center;
  align-items: center;
  background: hsl(var(--color-angle), 100%, 30%);
  height: calc(100vh - var(--nav-height));
  transition:
    height 1s,
    padding 1s;
  &:empty {
    height: 0;
    padding: 0;
  }
}
.misses {
  max-height: 70vh;
  overflow: scroll;
  &.small {
    height: 10vh;
    max-height: 10vh;
    font-size: 1.3em;
  }
}
.dimsum-cards {
  flex-grow: 1;
  height: 100%;
  max-width: 800px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 1em;
  padding: 1em;
  overflow-y: scroll;
}
</style>

<template>
  <div id="dimsum-wrapper">
    <template v-if="promptIdx !== null && backs.length > 0 && backs[0].length > 0">
      <div class="misses hide-on-small-screens">
        misses: {{ Math.max(0, misses.length - 6) }} hits: {{ hitsCount }}
        <p v-for="(miss, idx) in misses" :key="miss.front + idx">
          {{ miss.front }}: {{ miss.back.join(', ') }} {{ miss.isCorrect ? '✅' : '❎' }}
        </p>
        <button @click="isPaused = !isPaused">{{ isPaused ? 'Continue' : 'Pause' }}</button>
      </div>
      <div class="dimsum-cards">
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
        <div class="misses show-on-small-screens small">
          misses: {{ Math.max(0, misses.length - 6) }} hits: {{ hitsCount }}
        </div>
        <div class="misses show-on-small-screens small">
          <p v-for="(miss, idx) in [...misses].reverse()" :key="miss.front + idx">
            {{ miss.front }}: {{ miss.back.join(', ') }} {{ miss.isCorrect ? '✅' : '❎' }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
