<script setup lang="ts">
import { ref } from 'vue'
import ModalDialog from './ModalDialog.vue'
import { getCurrentEpochDay } from '../../utils'
import type { DbTask } from '@/server/db-access'

const props = defineProps<{
  task: DbTask
  isOpen: boolean
  isCreateNew?: boolean
}>()

const emit = defineEmits(['create', 'updated', 'did-close'])

const title = ref(props.task.title)
const daysFromNow = ref(props.task.nextEpochDay - getCurrentEpochDay())
const cadenceInDays = ref(props.task.cadenceInDays)

const save = () => {
  emit(props.isCreateNew ? 'create' : 'updated', {
    ...props.task,
    title: title.value,
    nextEpochDay: daysFromNow.value + getCurrentEpochDay(),
    cadenceInDays: cadenceInDays.value,
    meta: {
      id: props.task.id,
      resource: 'cads'
    }
  })
  if (props.isCreateNew) {
    emit('did-close')
  }
}
</script>

<style>
.previous-value {
  font-weight: 300;
}
</style>

<template>
  <ModalDialog
    :title="`${props.task.title ? 'Editing:' : 'Creating new task'} ${props.task.title}`"
    :isOpen="isOpen"
    class="edit-dialog"
    @didClose="emit('did-close')"
  >
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
    <template #buttons>
      <button @click="save">Save</button> <button @click="emit('did-close')">Cancel</button>
    </template>
  </ModalDialog>
</template>
