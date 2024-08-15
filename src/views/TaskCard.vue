<script setup lang="ts">
import { ref } from 'vue'
import { usePointerSwipe } from '@vueuse/core'
import type { Task } from '@/server/db-access'

const props = defineProps<{ task: Task }>()
const emit = defineEmits(['completed'])

const el = ref()
const transform = ref('')
const willComplete = ref(false)
const didComplete = ref(false)
const { isSwiping, distanceX } = usePointerSwipe(el, {
  disableTextSelect: false,
  onSwipe() {
    if (distanceX.value > 0) {
      return
    }
    const distance = Math.abs(distanceX.value)
    transform.value = `translateX(${distance}px)`
    willComplete.value = distance > 100
  },
  onSwipeEnd() {
    transform.value = ''
    if (willComplete.value === true) {
      didComplete.value = true
      setTimeout(() => {
        didComplete.value = false
        willComplete.value = false
        transform.value = ''
      }, 2000)
      emit('completed')
    }
  }
})
</script>

<template>
  <li
    className="task-list-card"
    ref="el"
    @dblclick="emit('completed')"
    :style="{
      opacity: isSwiping ? 1 : Math.max(0.1, 1 / Math.max(0, props.task.daysFromNow + 1)),
      fontWeight: 700 - 100 * props.task.daysFromNow,
      color: props.task.daysFromNow < 0 ? 'orange' : 'inherit'
    }"
  >
    <div
      class="task-list-card-inner"
      :style="{ transform, background: willComplete ? (didComplete ? 'green' : 'red') : 'inherit' }"
    >
      <span>{{ props.task.title }}</span>
      <span>|</span>
      <span v-if="props.task.daysFromNow < 0">{{ -props.task.daysFromNow }} days overdue </span>
      <span v-else-if="props.task.daysFromNow === 0">due today</span>
      <span v-else>due in {{ props.task.daysFromNow }} days</span>
      <span>every {{ props.task.cadenceInDays }} days</span>
      <span>{{ willComplete ? 'complete' : '' }}</span>
    </div>
  </li>
</template>

<style scoped>
.task-list-card {
  display: flex;
  flex-direction: column;
  height: 7em;
  @media (min-width: 800px) {
    height: 3em;
  }
  position: relative;
  user-select: none;
  max-width: calc(100vw - 10em);

  .task-list-card-inner {
    display: flex;
    flex-direction: column;
    gap: 0em 2em;
    position: absolute;
    padding: 1em 3em;
    border-radius: 3em;
    transition: all 0.2s ease-in-out;
    span:nth-of-type(2) {
      display: none;
    }
    span:nth-of-type(3),
    span:nth-of-type(4) {
      padding-left: 2ch;
    }

    @media (min-width: 800px) {
      flex-direction: row;
      span:nth-of-type(2) {
        display: inline;
      }
      span:nth-of-type(3),
      span:nth-of-type(4) {
        padding-left: 0;
      }
    }
  }
}
</style>
