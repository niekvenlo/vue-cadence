<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  cards: string[][] | null
  promptIdx: number | null
  responseIndices: number[]
  isOnlyOneColumn: boolean
}>()

const fiftyDimsum = computed(() => {
  if (!props.cards || props.promptIdx === null || !props.responseIndices.length) {
    return []
  }
  const numCards = props.cards.length
  return Array.from({ length: 50 }).map(() => {
    const isCorrect = Math.random() < 0.4
    const idx = Math.floor(Math.random() * numCards)
    const falseIdx = Math.floor(idx + Math.random() * (numCards - 1)) % numCards
    return {
      isCorrect,
      front: props.cards?.[idx][props.promptIdx ?? 0] || '',
      back: props.cards?.[isCorrect ? idx : falseIdx][1] || ''
    }
  })
})
</script>

<style>
#dimsum-wrapper {
  display: flex;
  justify-content: center;
  background: hsl(var(--color-angle), 100%, 30%);
}
.dimsum-cards {
  flex-grow: 1;
  max-width: 800px;
  transition: height 1s;
  height: calc(100vh - var(--nav-height));
  overflow-y: scroll;
  
  &:empty {
    height: 0;
  }
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
  padding: 1em;
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: hsla(0 0% 100% / 0.4);
    padding: 0.5em;
    font-weight: 600;
    font-size: 2em;

    cursor: not-allowed;
    &.isCorrect {
      cursor: default;
    }
  }
}
</style>

<template>
  <div id="dimsum-wrapper">
    <div class="dimsum-cards">
      <div
        class="card"
        :class="{ isCorrect: dimsum.isCorrect }"
        v-for="dimsum in fiftyDimsum"
        :key="dimsum.front + dimsum.back"
      >
        <span>{{ dimsum.front }}</span>
        <span>{{ dimsum.back }}</span>
      </div>
    </div>
  </div>
</template>
