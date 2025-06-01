<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useKeys } from '@/composables/use-keys'

const props = defineProps<{
  fronts: string[]
  backs: string[][]
  isPaused: boolean
  cardId: string
}>()

const emit = defineEmits(['miss', 'ignored', 'hit'])

const cardCount = ref(-1)
const timeout = ref<NodeJS.Timeout>()
const timeout2 = ref<NodeJS.Timeout>()
const className = ref<'miss' | 'ignored' | 'hit' | ''>('')

const dimsum = computed(() => {
  const numCards = props.fronts.length
  const idx = Math.floor(Math.random() * numCards)
  const randomIdx = Math.floor(Math.random() * (numCards - 1))

  const falseIdx = (idx + 1 + randomIdx) % numCards
  const isCorrect = cardCount.value === -1 ? false : Math.random() < 0.4

  return {
    isCorrect,
    front: props.fronts[idx],
    back: isCorrect ? props.backs[idx] : props.backs[falseIdx]
  }
})

const emitHelper = (type) =>
  !props.isPaused && emit(type, { front: dimsum.value.front, back: dimsum.value.back, isCorrect: dimsum.value.isCorrect })

const nextCard = (isClicked: boolean = false) => {
  clearTimeout(timeout.value)
  clearTimeout(timeout2.value)
  if (props.isPaused) {
    return
  }
  let delay = 0
  if (dimsum.value.isCorrect && !isClicked) {
    emitHelper('miss')
    className.value = 'miss'
    delay = 10000
  } else if (!dimsum.value.isCorrect && isClicked) {
    emitHelper('miss')
    className.value = 'miss'
    delay = 10000
  } else if (dimsum.value.isCorrect && isClicked) {
    emitHelper('hit')
    className.value = 'hit'
    delay = 2000
  } else if (cardCount.value > -1) {
    emitHelper('ignored')
    className.value = 'ignored'
    delay = 4000
  }
  timeout2.value = setTimeout(() => {
    if (props.isPaused) {
      return
    }
    cardCount.value++
    className.value = ''
    const randomTimeWindow = 8000 + Math.random() * 4000
    timeout.value = setTimeout(() => nextCard(), randomTimeWindow)
  }, delay)
}

useKeys((e: KeyboardEvent) => {
  if (e.code !== 'Key' + props.cardId || e.type !== 'keydown') {
    return
  }
  e.preventDefault()
  nextCard(true)
})

watch(
  props,
  () => {
    if (!props.isPaused) {
      nextCard()
    }
  },
  { immediate: true }
)

const handleClick = () => {
  nextCard(true)
}
</script>

<style>
#dimsum-wrapper {
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: hsla(0 0% 100% / 0.4);
    padding: 0.5em;
    font-weight: 600;
    font-size: 2em;
    &.isPaused {
      filter: blur(2px)
    }
    &.miss {
      background-color: red;
      transform: translateY(5px) rotate(1deg);
      transition: background-color 0.5s, transform 0.5s ease-out;
    }
    &.ignored {
      opacity: 0.2;
      transition: opacity 0.5s;
    }
    &.hit {
      background-color: green;
      transform: translateY(-5px) rotate(-0.5deg);
      transition: background-color 0.5s, transform 0.5s ease-out;
    }

    span.back {
      font-size: 80%;
    }
    span.card-id {
      font-size: 1rem;
      font-style: italic;
      opacity: 0.5;
    }
  }
}
</style>

<template>
  <button class="card" :class="[className, {isPaused: props.isPaused}]" @click="handleClick">
    <span>{{ dimsum.front }}</span>
    <span class="back">{{ dimsum.back.join(', ') }}</span>
    <span class="card-id hide-on-small-screens">{{ cardId }}</span>
  </button>
</template>
