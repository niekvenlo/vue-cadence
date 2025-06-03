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

const isStopped = ref(false)
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
  display: flex;
  flex-direction: column;
  align-items: start;
  min-width: 20vw;
  max-height: calc(100vh - var(--nav-height));
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
        <h2>misses: {{ misses.length }} hits: {{ hitsCount }}</h2>
        <button @click="isStopped = !isStopped">{{ isStopped ? 'Continue' : 'Stop' }}</button>
        <p v-for="(miss, idx) in [...misses].reverse()" :key="miss.front + idx">
          {{ miss.front }}: {{ miss.back.join(', ') }} {{ miss.isCorrect ? '✅' : '❎' }}
        </p>
      </div>
      <div class="dimsum-cards">
        <DimsumCard
          v-for="(_, idx) in Array.from({ length: 6 })"
          :key="idx"
          :fronts="fronts"
          :backs="backs"
          @miss="(e) => misses.push(e)"
          @hit="hitsCount++"
          :isStopped="isStopped"
          :cardId="['Q', 'W', 'A', 'S', 'Z', 'X'][idx]"
        />
        <div class="misses show-on-small-screens small">
          <h4>misses: {{ misses.length }} hits: {{ hitsCount }}</h4>
          <button @click="isStopped = !isStopped">{{ isStopped ? 'Continue' : 'Stop' }}</button>
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
