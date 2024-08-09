<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from 'src/server/db-access.ts'

const tasks = ref<undefined | Task[]>(undefined)

fetch('http://192.168.2.8:3333/api/v1/getTasks', {})
  .then((response) => response.json())
  .then((json) => {
    tasks.value = json
  })

const markComplete = (taskId: string) => {
  fetch(`http://192.168.2.8:3333/api/v1/completeTask?taskId=${taskId}`, {})
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
      v-for="item in tasks?.filter((t) => t.daysFromNow < 2)"
      @dblclick="markComplete(item.id)"
    >
      <strong>{{ item.title }}</strong>
      <span v-if="item.daysFromNow < 0"> {{ item.daysFromNow }} days overdue </span>
      <span v-else-if="item.daysFromNow === 0">due today</span>
      <span v-else> due in {{ item.daysFromNow }} days </span>
      <span>every {{ item.cadenceInDays }} days</span>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.list {
  overflow: hidden;

  li {
    display: flex;
    gap: 1em;
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
