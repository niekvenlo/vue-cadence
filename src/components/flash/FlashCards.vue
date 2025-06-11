<script setup lang="ts">
import { ref } from 'vue'
import { useKeys } from '@/composables/use-keys'
import UpArrow from '../UpArrow.vue'

const props = defineProps<{
  cards: string[][] | null
  promptIdx: number | null
  responseIndices: number[]
  isOnlyOneColumn: boolean
}>()
// TODO: Fix bug: showCardIdx is not reset when new cards are loaded, which
// means the idx could exceed the number of cards.
const showCardIdx = ref(0)

const isBackRevealed = ref(false)

useKeys((e: KeyboardEvent) => {
  const allowedKeyCodes = [
    'Space',
    'ArrowRight',
    'ArrowLeft',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5'
  ]
  if (allowedKeyCodes.includes(e.code) === false) {
    return
  }
  e.preventDefault()
  if (e.code === 'Space') {
    isBackRevealed.value = e.type === 'keydown'
    return
  }
  if (e.type === 'keyup') {
    if (e.code === 'ArrowRight') {
      showNextCard()
    }
    if (e.code === 'ArrowLeft') {
      showPreviousCard()
    }
    if (e.code.startsWith('Digit') && props.promptIdx) {
      console.log({
        front: props.cards?.[showCardIdx.value]?.[props.promptIdx],
        rank: e.code.slice(-1)
      })
    }
  }
})

const showPreviousCard = () => {
  showCardIdx.value =
    (showCardIdx.value + (props.cards?.length ?? 0) - 1) % (props.cards?.length ?? 0)
}

const showNextCard = () => {
  showCardIdx.value = (showCardIdx.value + 1) % (props.cards?.length ?? 0)
}
</script>

<style>
.flashcard {
  display: grid;
  grid-template-rows: 5fr 3fr 1fr;

  width: 100%;
  transition: height 1s;
  text-align: center;
  height: calc(100vh - var(--nav-height));
  &:has(.front:empty) {
    padding-block: 0;
    height: 0;
    .buttons {
      display: none;
    }
  }
  &:has(.back:empty) {
    grid-template-rows: 7fr 1fr 1fr;
  }
  .front,
  .back {
    display: flex;
    flex-direction: column;
    color: hsl(231, 23%, 22%);
    div {
      &:nth-of-type(2n) {
        color: hsl(0, 23%, 22%);
        font-style: italic;
      }
    }
  }
  .front {
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--color-angle), 100%, 50%);
    font-size: 4em;
  }
  .back {
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--color-angle), 100%, 41%);
    font-size: 3em;
    div {
      visibility: hidden;
    }
    &.isBackRevealed {
      div {
        visibility: visible;
      }
    }
  }
  .buttons {
    background: hsl(var(--color-angle), 100%, 16%);
    display: flex;
    overflow: hidden;
    button {
      color: white;
      text-transform: lowercase;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5em;
      width: 50%;
      border: none;
      background: none;
      &:hover {
        background: hsl(var(--color-angle), 100%, 10%);
        svg {
          will-change: translate;
          translate: 10px;
          transition: translate 1s ease-in-out;
        }
        &:nth-of-type(1) svg {
          translate: -10px;
        }
      }
      &:nth-of-type(1) svg {
        transform: rotateZ(-90deg);
      }
      &:nth-of-type(2) svg {
        transform: rotateZ(90deg);
      }
    }
  }
}
</style>

<template>
  <div class="flashcard">
    <div class="front">
      {{ promptIdx === null ? null : cards?.[showCardIdx][promptIdx || 0] }}
    </div>
    <div
      class="back"
      :class="{ isBackRevealed }"
      @mouseover="isBackRevealed = true"
      @mouseout="isBackRevealed = false"
    >
      <div v-for="idx in responseIndices" :key="idx">
        {{ cards?.[showCardIdx][idx] }}
      </div>
    </div>
    <div class="buttons">
      <button @click="showPreviousCard"><UpArrow /></button>
      <button @click="showNextCard"><UpArrow /></button>
    </div>
  </div>
</template>
