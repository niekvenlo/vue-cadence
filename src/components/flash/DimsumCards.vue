<script setup lang="ts">
import type { log } from 'console'
import { computed, ref } from 'vue'
import DimsumCard from './DimsumCard.vue'

const props = defineProps<{
  cards: string[][] | null
  promptIdx: number | null
  responseIndices: number[]
  isOnlyOneColumn: boolean
}>()

const fronts = computed(() => props.cards?.map((c) => c[props.promptIdx]) ?? [])
const backs = computed(
  () => props.cards?.map((c) => c.filter((_, i) => props.responseIndices.includes(i))) ?? []
)

const misses = ref([])
const hitsCount = ref(0)


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
}
.dimsum-cards {
  flex-grow: 1;
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
      <div class="misses">
        misses: {{ Math.max(0, misses.length - 6) }} hits: {{ hitsCount }}
        <p v-for="miss in misses">{{ miss.front }}: {{ miss.back.join(', ') }}</p>
      </div>
      <div class="dimsum-cards">
        <DimsumCard
          v-for="i in Array.from({ length: 6 })"
          :fronts="fronts"
          :backs="backs"
          @miss="(e) => misses.push(e)"
          @hit="hitsCount++"
        />
      </div>
    </template>
  </div>
</template>
