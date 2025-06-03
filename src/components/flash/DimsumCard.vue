<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useKeys } from '@/composables/use-keys'

const props = defineProps<{
  fronts: string[]
  backs: string[][]
  isStopped: boolean
  cardId: string
}>()

const emit = defineEmits(['miss', 'ignored', 'hit'])

const isDelayed = ref(true)
const cardCount = ref(-1)
const timeout = ref<NodeJS.Timeout>()
const timeout2 = ref<NodeJS.Timeout>()
const className = ref<'miss' | 'ignored' | 'hit' | ''>('')

setTimeout(() => {
  nextCard()
  isDelayed.value = false
}, Math.random() * 6000)

const dimsum = computed(() => {
  if (isDelayed.value) {
    return {}
  }
  cardCount.value // accessing to force rerender
  const numCards = props.fronts.length
  const idx = Math.floor(Math.random() * numCards)
  const randomIdx = Math.floor(Math.random() * (numCards - 1))

  const falseIdx = (idx + 1 + randomIdx) % numCards
  const isCorrect = Math.random() < 0.4

  return {
    isCorrect,
    front: props.fronts[idx],
    back: isCorrect ? props.backs[idx] : props.backs[falseIdx]
  }
})

const emitHelper = (type: 'miss' | 'hit' | 'ignored') =>
  emit(type, {
    front: dimsum.value.front,
    back: dimsum.value.back,
    isCorrect: dimsum.value.isCorrect
  })

const nextCard = (isClicked: boolean = false) => {
  clearTimeout(timeout.value)
  clearTimeout(timeout2.value)
  if (props.isStopped) {
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
    if (props.isStopped) {
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

watch(props, () => {
  if (!props.isStopped) {
    nextCard()
  }
})

const handleClick = () => {
  nextCard(true)
}
</script>

<style>
#dimsum-wrapper {
  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: hsl(60, 86.2%, 82.9%);
    padding: 0.5em;
    font-weight: 600;
    font-size: 2em;
    border: none;
    will-change: transform;
    color: currentColor;
    font-family: sans-serif;
    &.isStopped {
      filter: blur(1px);
    }
    &.miss {
      background-color: red;
      transform: translateY(5px) rotate(1deg);
      transition:
        background-color 0.5s,
        transform 0.5s ease-out;
    }
    &.ignored {
      opacity: 0.2;
      transition: opacity 0.5s ease-out;
    }
    &.hit {
      background-color: green;
      transform: translateY(-5px) rotate(-0.5deg);
      transition:
        background-color 0.5s,
        transform 0.5s ease-out;
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
  <span v-if="isDelayed" class="placeholder"></span>
  <button
    v-else
    class="card"
    :class="[className, { isStopped: props.isStopped }]"
    @click="handleClick"
  >
    <span>{{ dimsum.front }}</span>
    <span class="back">{{ dimsum.back.join(', ') }}</span>
    <span class="card-id hide-on-small-screens">{{ cardId }}</span>
  </button>
</template>
