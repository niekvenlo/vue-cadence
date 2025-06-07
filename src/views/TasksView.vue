<script setup lang="ts">
import { ref } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { getCurrentEpochDay } from '../utils'
import TaskCardNew from '../components/tasks/TaskCard.vue'
import type { DbTask, Task } from '@/server/db-access'
import EditModal from '@/components/tasks/EditModal.vue'

const root = import.meta.env.VITE_SERVER_ROOT

const queryClient = useQueryClient()

const emit = defineEmits(['error'])

const creatingTask = ref<DbTask>({
  title: '',
  cadenceInDays: 5,
  nextEpochDay: getCurrentEpochDay() + 5,
  id: ''
})
const isCreating = ref(false)

const fetcher = (
  verb: 'GET' | 'PATCH' | 'POST',
  { body, queryKey }: { body?: any; queryKey?: string[] }
) =>
  fetch(`${root}/api/v2/freeform${verb === 'GET' ? '/cads' : ''}`, {
    method: verb.toUpperCase(),
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.error) {
        emit('error', json)
        return null
      }
      if (queryKey) {
        queryClient.setQueryData(queryKey, json)
      }
      return json
    })
    .catch((err) => {
      emit('error', err)
      throw new Error('Fetcher failed to fetch')
    })

const { data: tasks, isPending } = useQuery({
  queryKey: ['cads'],
  queryFn: () => fetcher('GET', {}),
  select: (d: any) => ({ ...d, data: d.data.sort(sortByNextDayAndCadence) })
})

const patchTask = useMutation({
  mutationFn: (task: Task) => fetcher('PATCH', { body: task, queryKey: ['cads'] })
})

const markComplete = (task: Task) => {
  const patch = { ...task, nextEpochDay: getCurrentEpochDay() + task.cadenceInDays }
  patchTask.mutate(patch)
}

const updated = (task: Task) => {
  patchTask.mutate(task)
}

const postTask = useMutation({
  mutationFn: (task: Task) =>
    fetcher('POST', {
      body: task,
      queryKey: ['cads']
    })
})

function sortByNextDayAndCadence(a: Task, b: Task) {
  if (a.nextEpochDay === b.nextEpochDay) {
    return a.cadenceInDays > b.cadenceInDays ? -1 : 1
  }
  return a.nextEpochDay < b.nextEpochDay ? -1 : 1
}
</script>

<style>
#tasksview {
  .list {
    padding: 0;
    padding-top: 2px;
    height: calc(100vh - 70px);
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    will-change: position;
    .list-move,
    .list-enter-active,
    .list-leave-active {
      transition: all 0.3s ease-out;
      width: 100%;
      background: white !important;
    }

    .list-enter-from,
    .list-leave-to {
      opacity: 0 !important;
    }

    .list-leave-active {
      position: absolute;
    }
  }
  .edit-modal {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    height: 100%;
    gap: 1em;
    justify-content: space-evenly;
    max-width: 400px;
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
  <div id="tasksview">
    <TransitionGroup name="list" tag="ul" className="list" v-if="!isPending">
      <TaskCardNew
        v-for="item in tasks?.data ?? []"
        :key="item.id + item.nextEpochDay"
        :task="item"
        @completed="markComplete(item)"
        @updated="updated"
        @create="postTask.mutate({ title: 'r' } as Task)"
      />
    </TransitionGroup>
    <button v-if="!isCreating" class="floating-corner" @click="isCreating = true">Add task</button>
    <EditModal
      isCreateNew
      :task="creatingTask"
      :isOpen="isCreating"
      @didClose="isCreating = false"
      @create="postTask.mutate"
    />
  </div>
</template>
