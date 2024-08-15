<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '@/server/db-access'
import TaskCard from './TaskCard.vue'

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
  <TransitionGroup name="list" tag="ul" className="tasks-list">
    <TaskCard
      :task="item"
      :key="item.id"
      v-for="item in tasks"
      @completed="markComplete(item.id)"
    />
  </TransitionGroup>
</template>

<style>
.tasks-list {
  overflow: hidden;
  font-family: monospace;
  padding: 0;

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
