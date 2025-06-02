<script setup lang="ts">
import { ref } from 'vue'
import ModalDialog from './ModalDialog.vue'
import type { Task } from '@/server/db-access'

const root = import.meta.env.VITE_SERVER_ROOT

const props = defineProps<{
  task: Task
  isOpen: boolean
}>()

const emit = defineEmits(['updated'])

const title = ref(props.task.title)
const daysFromNow = ref(props.task.daysFromNow)
const cadenceInDays = ref(props.task.cadenceInDays)

const save = () => {
  emit('updated', {
    title: title.value,
    daysFromNow: daysFromNow.value,
    cadenceInDays: cadenceInDays.value,
    id: props.task.id
  })
  console.log('modal')
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
            (previously: {{ props.task.daysFromNow }})
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
