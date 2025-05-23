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
  height: 4em;
  scroll-snap-align: start;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1vw;
  padding-block: 0.5em;
  padding-inline: 1em;
  font-family: sans-serif;
  background: hsl(var(--light-color));
  &:nth-child(2n) {
    background: white;
  }

  &.isDueToday {
    color: rgb(17, 87, 7);
  }
  &.isOverdue {
    color: rgb(144, 93, 0);
  }
  &.isSelected {
    background: hsl(var(--light-accent-color));
    &:nth-child(2n) {
      background: hsl(var(--lighter-accent-color));
    }
  }
  .title {
    display: flex;
    align-items: center;
    font-size: 1.1em;
  }
  .complete-edit {
    display: flex;
    flex-direction: row;
    gap: 1em;
  }
  .due-every {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media only screen and (min-width: 600px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2em;
    }
  }
  .due,
  .every,
  .edit,
  .complete {
    font-size: 0.9em;
  }
  .due,
  .every {
    text-align: right;
  }
  .edit,
  .complete {
    background-color: rgba(0, 0, 0, 0.1);
    text-transform: capitalize;
    padding: 0;
    border-radius: 8px;
    border-width: 0;
    color: #333333;
    cursor: pointer;
    display: inline-block;
    font-family: 'Haas Grot Text R Web', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.9em;
    font-weight: 500;
    margin: 0;
    padding: 10px 12px;
    text-align: center;
    transition: all 200ms;
    vertical-align: baseline;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  .edit-modal {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1em;
    justify-content: space-evenly;
    label {
      display: flex;
      flex-direction: column;
    }
  }
  label {
    font-size: 0.9em;
    color: #222;
    input {
      font-size: 1.1em;
      font-weight: 500;
      padding: 0.2em 1em;
      outline: none;
      &:focus {
        box-shadow: var(--shadow-elevation-outline);
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
      isOverdue: props.task.daysFromNow < 0,
      isDueToday: props.task.daysFromNow === 0
    }"
    :style="{
      opacity: Math.max(0.3, 1 / Math.max(0, props.task.daysFromNow + 1)),
      fontWeight: 700 - 100 * Math.max(0, props.task.daysFromNow)
    }"
  >
    <ModalDialog :isOpen="isEditing" @didClose="isEditing = false">
      <template #title>Editing: {{ props.task.title }}</template>
      <div class="edit-modal" v-if="isEditing">
        <label>
          Title
          <input type="text" :value="props.task.title" />
        </label>
        <label>
          Days from now
          <input type="number" :value="props.task.daysFromNow" />
        </label>
        <label>
          Cadence in days
          <input type="number" :value="props.task.cadenceInDays" />
        </label>
      </div>
      <template #buttons><button>Save</button> <button>Delete</button></template>
    </ModalDialog>
    <div class="title" @click="isSelected = !isSelected">{{ props.task.title }}</div>
    <template v-if="isSelected">
      <div class="complete-edit">
        <button class="complete" @click="emit('completed')">complete</button>
        <button class="edit" @click="isEditing = true">edit</button>
      </div>
    </template>
    <template v-else>
      <div class="due-every" @click="isSelected = true">
        <span class="due" v-if="props.task.daysFromNow < 0"
          >{{ -props.task.daysFromNow }} days <span class="hide-on-small-screens">overdue</span>
        </span>
        <span class="due" v-else-if="props.task.daysFromNow === 0">due today</span>
        <span class="due" v-else
          >due in {{ props.task.daysFromNow }} <span class="hide-on-small-screens">days</span></span
        >
        <span class="every"
          >every {{ props.task.cadenceInDays }}
          <span class="hide-on-small-screens">days</span></span
        >
      </div>
    </template>
  </li>
</template>
