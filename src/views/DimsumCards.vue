<script setup lang="ts">
import { computed } from 'vue'
// import { useKeys } from '@/composables/use-keys'
import { shuffleArray } from '../utils'

const props = defineProps<{
  cards: string[][] | null
  promptIdx: number | null
  responseIndices: number[]
  isOnlyOneColumn: boolean
}>()

const shuffledCards = computed(() => (props.cards ? shuffleArray([...props.cards]) : null))
</script>

<style>
.dimsum-cards {
  transition: height 1s;
  height: calc(100vh - var(--nav-height));
  overflow-y: scroll;
  background: hsl(var(--color-angle), 100%, 30%);
  &:empty {
    height: 0;
  }
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 2em;
    &:nth-of-type(2n) {
      background: hsla(0 0% 0% / 0.1);
    }
  }
}
</style>

<template>
  <div class="dimsum-cards">
    <div v-if="promptIdx !== null && responseIndices.length > 0">
      <div v-for="(_, idx) in cards" class="card">
        <span>{{ cards?.[idx][0] }}</span>
        <span>{{ shuffledCards?.[idx][1] }}</span>
      </div>
    </div>
  </div>
</template>
