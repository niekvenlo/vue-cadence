<script setup lang="ts">
import { ref } from 'vue'
import ModalDialog from './ModalDialog.vue'
import type { Task } from '@/server/db-access'

const props = defineProps<{ task: Task }>()
const emit = defineEmits(['completed'])

const isSelected = ref(false)
const isEditing = ref(false)
</script>

<style>
.task-list-card {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1vw;
  padding-block: 0.5em;
  font-family: sans-serif;
  background: hsl(var(--light-color));
  &:nth-child(2n) {
    background: white;
  }

  &.isDueToday {
    color: rgb(50, 32, 0);
  }
  &.isOverdue {
    color: rgb(144, 93, 0);
  }
  .title {
    font-size: 1.1em;
    padding-inline: 1em;
  }
  .due,
  .every,
  button {
    font-size: 0.9em;
  }
  button {
    text-transform: capitalize;
    padding: 0;
  }
}
</style>

<template>
  <li
    className="task-list-card"
    @dblclick="emit('completed')"
    :style="{
      opacity: Math.max(0.1, 1 / Math.max(0, props.task.daysFromNow + 1)),
      fontWeight: 700 - 100 * Math.max(0, props.task.daysFromNow)
    }"
  >
    <ModalDialog :isOpen="isEditing" @didClose="isEditing = false"
      ><div>This is the content</div>
    </ModalDialog>
    <div class="title" @click="isSelected = !isSelected">{{ props.task.title }}</div>
    <template v-if="isSelected">
      <button>complete</button>
      <button @click="isEditing = true">edit</button>
    </template>
    <template v-else>
      <span class="due" v-if="props.task.daysFromNow < 0"
        >{{ -props.task.daysFromNow }} days <span class="hide-on-small-screens">overdue</span>
      </span>
      <span class="due" v-else-if="props.task.daysFromNow === 0">due today</span>
      <span class="due" v-else
        >due in {{ props.task.daysFromNow }} <span class="hide-on-small-screens">days</span></span
      >
      <span class="every"
        >every {{ props.task.cadenceInDays }} <span class="hide-on-small-screens">days</span></span
      >
    </template>
  </li>
</template>
