<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  fronts: string[]
  backs: string[][]
}>()

const emit = defineEmits(['miss', 'ignored', 'hit'])

const cardCount = ref(-1)
const timeout = ref<NodeJS.Timeout>()
const className = ref<'miss' | 'ignored' | 'hit' | ''>('')

const dimsum = computed(() => {
  const numCards = props.fronts.length
  const idx = Math.floor(Math.random() * numCards)
  const falseIdx = Math.floor(idx + Math.random() * (numCards - 1)) % numCards
  const isCorrect = cardCount.value === -1 ? false : Math.random() < 0.4

  return {
    isCorrect,
    front: props.fronts[idx],
    back: isCorrect ? props.backs[idx] : props.backs[falseIdx]
  }
})

const emitHelper = (type) => emit(type, { front: dimsum.value.front, back: dimsum.value.back })

const nextCard = (isClicked: boolean = false) => {
  clearTimeout(timeout.value)
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
    delay = 3000
  } else if (cardCount.value > -1) {
    emitHelper('ignored')
    className.value = 'ignored'
    delay = 5000
  }
  setTimeout(() => {
    cardCount.value++
    className.value = ''
  }, delay)
  const randomTimeWindow = 10000 + Math.random() * 5000 + Math.random() * 5000
  timeout.value = setTimeout(() => nextCard(), randomTimeWindow)
}

nextCard()

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
    background: hsla(0 0% 100% / 0.4);
    padding: 0.5em;
    font-weight: 600;
    font-size: 2em;
    transition: opacity 0.2s;

    /* cursor: not-allowed; */
    &.isCorrect {
      /* cursor: default; */
    }
    &.miss {
      background: red;
    }
    &.ignored {
      opacity: 0.2;
    }
    &.hit {
      background: green;
    }

    span.back {
      font-size: 80%;
    }
  }
}
</style>

<template>
  <button class="card" :class="className" @click="handleClick">
    <span>{{ dimsum.front }}</span>
    <span class="back">{{ dimsum.back.join(', ') }}</span>
  </button>
</template>
