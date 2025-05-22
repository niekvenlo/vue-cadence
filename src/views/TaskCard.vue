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
    const max = 90
    const distance = Math.min(max * 1.1, Math.abs(distanceX.value))
    transform.value = `translateX(${distance}px)`
    willComplete.value = distance > max
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
    @dblclick="emit('completed')"
    :style="{
      opacity: isSwiping ? 1 : Math.max(0.1, 1 / Math.max(0, props.task.daysFromNow + 1)),
      fontWeight: 700 - (100 * Math.max(0, props.task.daysFromNow))
    }"
  >
    <div
      ref="el"
      class="task-list-card-inner"
      :class="{
        isSwiping,
        willComplete,
        didComplete,
        isOverdue: props.task.daysFromNow < 0,
        isDueToday: props.task.daysFromNow === 0
      }"
      :style="{ transform }"
    >
      <span>{{ props.task.title }}</span>
      <span>|</span>
      <span v-if="props.task.daysFromNow < 0">{{ -props.task.daysFromNow }} days overdue </span>
      <span v-else-if="props.task.daysFromNow === 0">due today</span>
      <span v-else>due in {{ props.task.daysFromNow }} days</span>
      <span>every {{ props.task.cadenceInDays }} days</span>
    </div>
  </li>
</template>

<style scoped>
.task-list-card {
  display: flex;
  flex-direction: column;
  height: 7em;
  @media (min-width: 800px) {
    height: 4.5em;
  }
  position: relative;
  user-select: none;
  max-width: calc(100vw - 5em);
  background: #fff;

  .task-list-card-inner {
    display: flex;
    flex-direction: column;
    gap: 0em 2em;
    position: absolute;
    padding: 1em;
    border-radius: 0.3em;
    transition: background-color 0.5s ease-in-out;
    span:nth-of-type(2) {
      display: none;
    }
    span:nth-of-type(3),
    span:nth-of-type(4) {
      padding-left: 2ch;
    }
    &.isDueToday {
      color: rgb(50, 32, 0);
    }
    &.isOverdue {
      color: rgb(144, 93, 0);
    }
    &.isSwiping {
      background: #fff;
      --shadow-color: 0deg 0% 63%;
      box-shadow:
        0.6px 0.1px 0.7px hsl(var(--shadow-color) / 0.36),
        1.9px 0.4px 2.2px -0.8px hsl(var(--shadow-color) / 0.36),
        4.8px 1.1px 5.5px -1.7px hsl(var(--shadow-color) / 0.36),
        11.8px 2.7px 13.6px -2.5px hsl(var(--shadow-color) / 0.36);
    }
    &.willComplete {
      background: black;
      color: white;
    }
    &.didComplete {
      background: green;
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
