<script setup lang="ts">
import { onBeforeUnmount, ref, unref, watch, type MaybeRef } from 'vue'
import { useKeys } from '@/composables/use-keys'

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

const dimsum = ref<{ front: string; back: string[]; isCorrect: boolean }>()

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

useKeys((e: KeyboardEvent) => {
  if (e.code == 'Key' + props.cardId && e.type !== 'keydown') {
    e.preventDefault()
    handleClick()
  }
})

const genNewDimSum = () => {
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
}
</script>

<style>
#dimsum-wrapper {
  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    scale: 0.8;

    rotate: -5deg;
    &:nth-of-type(2n) {
      rotate: 10deg;
    }
    &:nth-of-type(3n - 2) {
      rotate: -10deg;
    }
    background: black;
  }
  button.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    --background-color: hsl(60, 86.2%, 82.9%);
    background-color: var(--background-color);
    padding: 0.5em;
    font-weight: 600;
    font-size: 2em;
    border: none;
    will-change: transform;
    color: currentColor;
    font-family: sans-serif;
    cursor: default;
    transform-origin: center;
    box-shadow:
      0 1px 1px hsl(0deg 0% 0% / 0.075),
      0 2px 2px hsl(0deg 0% 0% / 0.075),
      0 4px 4px hsl(0deg 0% 0% / 0.075),
      0 8px 8px hsl(0deg 0% 0% / 0.075);
    @media not (hover) {
      .card-id {
        display: none;
      }
    }
    .front-and-back {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &.init {
      scale: 0.8;
      rotate: -2deg;
      &:nth-of-type(2n) {
        rotate: 3deg;
      }
      &:nth-of-type(3n - 2) {
        rotate: -4deg;
      }
    }
    &.present-option {
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        box-shadow:
          0 1px 1px hsl(0deg 0% 0% / 0.075),
          0 2px 2px hsl(0deg 0% 0% / 0.075),
          0 4px 4px hsl(0deg 0% 0% / 0.075),
          0 8px 8px hsl(0deg 0% 0% / 0.075),
          0 16px 16px hsl(0deg 0% 0% / 0.075);
      }
      transition:
        rotate 0.5s,
        scale 0.5s;
      background-image: linear-gradient(
        to right,
        hsla(0, 0%, 0%, 0.1) 0%,
        hsla(0, 0%, 0%, 0.1) 50%,
        hsla(0, 0%, 0%, 0) 51%,
        hsla(0, 0%, 0%, 0) 100%
      );
      background-size: 200% 100%;
      background-position: 100% 0;
      &.tail-end {
        transition:
          rotate 0.5s,
          scale 0.5s,
          background-position 2s linear;
        background-position: 0 0;
      }
    }
    &.reveal-outcome,
    &.refractory-phase,
    &.invisible-phase {
      background-image: linear-gradient(hsla(0, 0%, 0%, 0.1));
      transition:
        background-color 0.1s ease-in-out,
        transform 0.1s ease-in-out,
        translateY 0.1s ease-in-out,
        opacity 1s ease-in-out;

      /* Miss */
      &.isClicked,
      &.isCorrect {
        transform: translateY(5px) rotate(2deg);
        --background-color: hsl(7, 71%, 57%);
      }
      /* Hit */
      &.isCorrect.isClicked {
        transform: translateY(-5px) rotate(-1deg);
        --background-color: hsl(119, 71%, 57%);
      }
    }
    &.refractory-phase {
      opacity: 0.2;
    }
    &.invisible-phase {
      opacity: 0;
    }
    .back {
      font-size: 70%;
      display: flex;
      flex-direction: column;
      span:nth-of-type(2n) {
        font-style: italic;
      }
    }
    .card-id {
      font-size: 1rem;
      font-style: italic;
      opacity: 0.5;
      text-align: left;
      width: 100%;
    }
  }
}
</style>

<template>
  <button
    class="card"
    :class="[phase, { isClicked, isCorrect: dimsum?.isCorrect, isPaused: props.isPaused }]"
    @click="handleClick"
  >
    <div class="front-and-back">
      <div>{{ dimsum?.front }}</div>
      <div class="back">
        <span v-for="line in dimsum?.back ?? []" :key="line">{{ line }}</span>
      </div>
    </div>
  </button>
</template>
