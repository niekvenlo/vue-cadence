<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { getCurrentEpochDay } from '../utils'
import TaskCardNew from '../components/tasks/TaskCard.vue'
import type { Task } from '@/server/db-access'

const root = import.meta.env.VITE_SERVER_ROOT

const queryClient = useQueryClient()

const emit = defineEmits(['error'])

const fetcher = (verb: 'PATCH' | 'GET', { body, queryKey }: { body?: any; queryKey?: string[] }) =>
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

function sortByNextDayAndCadence(a: Task, b: Task) {
  if (a.nextEpochDay === b.nextEpochDay) {
    return a.cadenceInDays > b.cadenceInDays ? -1 : 1
  }
  return a.nextEpochDay < b.nextEpochDay ? -1 : 1
}
</script>

<style>
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
</style>

<template>
  <TransitionGroup name="list" tag="ul" className="list" v-if="!isPending">
    <TaskCardNew
      v-for="item in tasks?.data ?? []"
      :key="item.id + item.nextEpochDay"
      :task="item"
      @completed="markComplete(item)"
      @updated="updated"
    />
  </TransitionGroup>
</template>
