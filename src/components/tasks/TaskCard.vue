<script setup lang="ts">
import { computed, ref } from 'vue'
import { getCurrentEpochDay } from '../../utils'
import EditModal from './EditModal.vue'
import type { Task } from '@/server/db-access'

const props = defineProps<{ task: Task }>()
const emit = defineEmits(['completed', 'updated'])

const isSelected = ref(false)
const isEditing = ref(false)

const daysFromNow = computed(() => props.task.nextEpochDay - getCurrentEpochDay())

const completed = () => {
  emit('completed')
  isEditing.value = false
  isSelected.value = false
}

const updated = (task: Task) => {
  emit('updated', task)
  isEditing.value = false
  isSelected.value = false
}
</script>

<style>
#tasksview {
  .task-list-card {
    --background-color: hsl(var(--light-color));
    height: 4.5em;
    background: var(--background-color);
    scroll-snap-align: start;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1vw;
    padding-block: 0.5em;
    padding-inline: 1em;
    font-family: sans-serif;
    &:nth-child(2n) {
      --background-color: white;
    }

    &.isDueToday {
      /* color: hsl(113, 85%, 18%); */
      background-image: linear-gradient(90deg, var(--background-color), hsl(161, 100%, 94%));
    }
    &.isOverdue {
      /* color: hsl(49, 100%, 22%); */
      background-image: linear-gradient(90deg, var(--background-color), hsl(45, 100%, 94%));
    }
    &.isSelected {
      --background-color: hsl(var(--light-accent-color));
      &:nth-child(2n) {
        --background-color: hsl(var(--lighter-accent-color));
      }
    }
    .title {
      display: flex;
      align-items: center;
      font-size: 1.2em;
      border: none;
      background: unset;
      color: currentColor;
      text-align: left;
    }
    .complete-edit {
      display: flex;
      flex-direction: row;
      justify-content: end;
      gap: 0.5em;
      margin-left: -3em;
      backdrop-filter: blur(2px);
    }
    .due-every {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-weight: 400;
      border: none;
      background: unset;
      color: currentColor;
      @media only screen and (min-width: 600px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2em;
        align-items: center;
      }
    }
    .due,
    .every {
      font-size: 0.9em;

      .due,
      .every {
        text-align: right;
      }
    }
  }
}
</style>

<template>
  <li
    class="task-list-card"
    :class="{
      isSelected,
      isOverdue: daysFromNow < 0,
      isDueToday: daysFromNow === 0
    }"
    :style="{
      opacity: Math.max(0.3, 1 / Math.max(0, daysFromNow + 1)),
      fontWeight: 700 - 100 * Math.max(0, daysFromNow)
    }"
  >
    <EditModal
      :task="props.task"
      :isOpen="isEditing"
      @didClose="isEditing = false"
      @updated="updated"
    />
    <button class="title" @click="isSelected = !isSelected">{{ props.task.title }}</button>
    <template v-if="isSelected">
      <div class="complete-edit">
        <button class="light" @click="isEditing = true">edit</button>
        <button class="light" @click="completed">complete</button>
      </div>
    </template>
    <template v-else>
      <button class="due-every" @click="isSelected = true" tabindex="-1">
        <span class="due" v-if="daysFromNow < 0"
          >{{ -daysFromNow }} days <span class="hide-on-small-screens">overdue</span>
        </span>
        <span class="due" v-else-if="daysFromNow === 0">due today</span>
        <span class="due" v-else
          >due in {{ daysFromNow }} <span class="hide-on-small-screens">days</span></span
        >
        <span class="every"
          >every {{ props.task.cadenceInDays }}
          <span class="hide-on-small-screens">days</span></span
        >
      </button>
    </template>
  </li>
</template>
