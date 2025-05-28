<script setup lang="ts">
import { ref } from 'vue'
import TaskCardNew from './TaskCardNew.vue'
import type { Task } from '@/server/db-access'

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

<style>
.list {
  padding: 0;
  padding-top: 2px;
  height: calc(100vh - 70px);
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease-out;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0 !important;
  }

  .list-leave-active {
    position: absolute;
  }
}
</style>

<template>
  <TransitionGroup name="list" tag="ul" className="list">
    <TaskCardNew
      v-for="item in tasks"
      :key="item.id"
      :task="item"
      @completed="markComplete(item.id)"
    />
  </TransitionGroup>
</template>
