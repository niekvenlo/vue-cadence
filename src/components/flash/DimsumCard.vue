<script setup lang="ts">
import { onBeforeUnmount, ref, unref, watch } from 'vue'
import type { MaybeRef } from 'vue'
import DimsumCardVisual from './DimsumCardVisual.vue'

const props = defineProps<{
  fronts: string[]
  backs: string[][]
  isPaused: boolean
  cardId: string
}>()

const emit = defineEmits(['miss', 'hit'])

function usePhase(
  phases: MaybeRef<{ [name: string]: MaybeRef<number> }>,
  { initialDelay, getIsPaused }: { initialDelay: number; getIsPaused: () => boolean }
) {
  const TICK_STEP = 50 // ms
  const phase = ref('init') // exported
  const countdown = ref(initialDelay)
  watch(phase, () => {
    // setTimeout allows us to make last-minute changes to phase value.
    setTimeout(() => {
      const newCountdown = unref(unref(phases)[phase.value])
      countdown.value = newCountdown
    }, 150)
  })

  const timer = ref<NodeJS.Timeout>()

  onBeforeUnmount(() => clearTimeout(timer.value))
  timer.value = setInterval(() => {
    if (!unref(getIsPaused())) {
      countdown.value -= TICK_STEP
    }
    if (countdown.value <= 0) {
      const phasesInOrder = Object.keys(unref(phases))
      const idx = phasesInOrder.findIndex((p) => p === phase.value)
      const nextIdx = (idx + 1) % phasesInOrder.length
      phase.value = phasesInOrder[nextIdx]
      countdown.value = unref(unref(phases)[phase.value])
    }
  }, TICK_STEP)
  return phase
}

const revealLingerDelay = ref(0)
const phases = ref<{ [name: string]: MaybeRef<number> }>({
  'present-option': 5000,
  'present-option tail-end': 2000,
  'reveal-outcome': revealLingerDelay,
  'refractory-phase': 2000,
  'invisible-phase': 3000
})

const phase = usePhase(phases, {
  getIsPaused: () => props.isPaused,
  initialDelay: Math.floor(Math.random() * 8000)
})

const dimsum = ref<{ front: string; back: string[]; correct: string[]; isCorrect: boolean }>()

const isClicked = ref(false)

watch(phase, () => {
  if (phase.value === 'present-option') {
    isClicked.value = false
    dimsum.value = genNewDimSum()
  }
  if (phase.value === 'reveal-outcome') {
    revealOutcome()
  }
})

const revealOutcome = () => {
  if (!dimsum.value) {
    return
  }
  const isCorrectActionTaken = isClicked.value === dimsum.value.isCorrect
  if (isCorrectActionTaken) {
    if (isClicked.value) {
      emit('hit', {
        front: dimsum.value.front,
        back: dimsum.value.back,
        isCorrect: dimsum.value.isCorrect
      })
      revealLingerDelay.value = 1000 // no need to linger
    }
  } else {
    emit('miss', {
      front: dimsum.value.front,
      back: dimsum.value.back,
      isCorrect: dimsum.value.isCorrect
    })
    revealLingerDelay.value = 10000 // let's linger
  }
}

const handleClick = () => {
  if (!props.isPaused && phase.value.startsWith('present-option')) {
    phase.value = 'reveal-outcome'
    isClicked.value = true
  }
}

const genNewDimSum = () => {
  const numCards = props.fronts.length
  const idx = Math.floor(Math.random() * numCards)
  const randomIdx = Math.floor(Math.random() * (numCards - 1))

  const falseIdx = (idx + 1 + randomIdx) % numCards
  const isCorrect = Math.random() < 0.4

  return {
    isCorrect,
    front: props.fronts[idx],
    back: isCorrect ? props.backs[idx] : props.backs[falseIdx],
    correct: props.backs[idx]
  }
}
</script>

<style></style>

<template>
  <DimsumCardVisual
    :phase="phase"
    :isClicked="isClicked"
    :isCorrect="dimsum?.isCorrect"
    :isPaused="props.isPaused"
    :front="dimsum?.front ?? ''"
    :back="dimsum?.back ?? []"
    :correct="dimsum?.correct ?? []"
    @click="handleClick"
  ></DimsumCardVisual>
</template>
