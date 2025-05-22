<script setup lang="ts">
import { ref } from 'vue'
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

<template>
  <TransitionGroup name="list" tag="ul" className="tasks-list">
    <li
      v-for="item in tasks"
      :key="item.id"
      class="task-list-card"
      :class="{
        isOverdue: item.daysFromNow < 0,
        isDueToday: item.daysFromNow === 0
      }"
      @dblclick="markComplete(item.id)"
    >
      <span class="title">{{ item.title }}</span>
      <span class="due" v-if="item.daysFromNow < 0"
        >{{ -item.daysFromNow }} days <span class="hide-on-small-screens">overdue</span>
      </span>
      <span class="due" v-else-if="item.daysFromNow === 0">due today</span>
      <span class="due" v-else
        >due in {{ item.daysFromNow }} <span class="hide-on-small-screens">days</span></span
      >
      <span class="every"
        >every {{ item.cadenceInDays }} <span class="hide-on-small-screens">days</span></span
      >
    </li>
  </TransitionGroup>
</template>

<style>
.tasks-list {
  background: #eee;
  overflow: hidden;
  font-family: sans-serif;
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
.task-list-card {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;

  &.isDueToday {
    color: rgb(50, 32, 0);
  }
  &.isOverdue {
    color: rgb(144, 93, 0);
  }
}
@media screen and (max-width: 600px) {
  .hide-on-small-screens {
    display: none;
  }
}
</style>
