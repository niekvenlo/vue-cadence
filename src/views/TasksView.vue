<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from 'src/server/db-access.ts'

const root = import.meta.env.VITE_SERVER_ROOT || 'http://192.168.2.14:3333'

const tasks = ref<undefined | Task[]>(undefined)

fetch(`${root}/api/v1/getTasks`, {})
  .then((response) => response.json())
  .then((json) => {
    tasks.value = json
  })

const markComplete = (taskId: string) => {
  fetch(`${root}/api/v1/completeTask?taskId=${taskId}`, {})
    .then((response) => response.json())
    .then((json) => {
      tasks.value = json
    })
}
</script>

<template>
  <TransitionGroup name="list" tag="ul" className="list">
    <li
      :key="item.id"
      v-for="item in tasks"
      @dblclick="markComplete(item.id)"
      :style="{
        opacity: Math.max(0.1, 1 / Math.max(0, item.daysFromNow + 1)),
        fontWeight: 700 - 100 * item.daysFromNow,
        color: item.daysFromNow < 0 ? 'orange' : 'inherit'
      }"
    >
      <span>{{ item.title }}</span>
      <span>|</span>
      <span v-if="item.daysFromNow < 0">{{ item.daysFromNow }} days overdue </span>
      <span v-else-if="item.daysFromNow === 0">due today</span>
      <span v-else>due in {{ item.daysFromNow }} days</span>
      <span>every {{ item.cadenceInDays }} days</span>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.list {
  overflow: hidden;
  font-family: monospace;

  li {
    display: flex;
    gap: 2em;
    padding: 1em;
  }

  .list-move, /* apply transition to moving elements */
  .list-enter-active,
  .list-leave-active {
    transition: all 1s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }

  /* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
  .list-leave-active {
    position: absolute;
  }
}
</style>
