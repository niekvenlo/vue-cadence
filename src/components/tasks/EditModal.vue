<script setup lang="ts">
import { ref } from 'vue'
import ModalDialog from './ModalDialog.vue'
import { getCurrentEpochDay } from '../../utils'
import type { Task } from '@/server/db-access'

const props = defineProps<{
  task: Task
  isOpen: boolean
}>()

const emit = defineEmits(['updated'])

const title = ref(props.task.title)
const daysFromNow = ref(props.task.nextEpochDay - getCurrentEpochDay())
const cadenceInDays = ref(props.task.cadenceInDays)

const save = () => {
  emit('updated', {
    ...props.task,
    title: title.value,
    nextEpochDay: daysFromNow.value + getCurrentEpochDay(),
    cadenceInDays: cadenceInDays.value
  })
}
</script>

<style>
.previous-value {
  font-weight: 300;
}
</style>

<template>
  <ModalDialog :title="`Editing: ${props.task.title}`" :isOpen="isOpen" class="edit-dialog">
    <div class="edit-modal" v-if="isOpen">
      <label>
        Title
        <input type="text" v-model="title" />
      </label>
      <label>
        <span>
          Days from now
          <span class="previous-value" v-if="daysFromNow !== props.task.daysFromNow">
            (previously: {{ props.task.nextEpochDay - getCurrentEpochDay() }})
          </span>
        </span>
        <input type="number" v-model="daysFromNow" />
      </label>
      <label>
        <span>
          Cadence in days
          <span class="previous-value" v-if="cadenceInDays !== props.task.cadenceInDays">
            (previously: {{ props.task.cadenceInDays }})
          </span>
        </span>
        <input type="number" v-model="cadenceInDays" />
      </label>
    </div>
    <template #buttons> <button @click="save">Save</button> <button>Cancel</button> </template>
  </ModalDialog>
</template>
