<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ConnectionsEntry } from '@/server/db-access'
const root = import.meta.env.VITE_SERVER_ROOT || 'http://192.168.2.14:3333'

const error = ref('')
const year = ref(2024)
const month = ref(10)
const date = ref(2)
const data = ref<ConnectionsEntry | null>(null)
const answers = computed(() => {
  const output: { name: string; members: string[]; m: string }[] = []
  Object.entries(data.value?.board ?? []).forEach(
    (entry) =>
      (output[entry[1].level] = {
        name: entry[0],
        members: entry[1].members,
        m: entry[1].members.sort().join(', ')
      })
  )

  return output
})

const selection = ref<string[]>([])
const correct = ref<{ name: string; tiles: string[] }[]>([])

const toggleSelection = (tile: string) => {
  if (selection.value.includes(tile)) {
    selection.value = selection.value.filter((t) => t !== tile)
  } else if (selection.value.length < 4) {
    selection.value.push(tile)
  }
}

const trySelectedGroup = () => {
  const selected = selection.value.sort().join(', ')
  for (let i = 0; i < 4; i++) {
    if (answers.value[i].m === selected) {
      correct.value.push({ name: answers.value[i].name, tiles: [...selection.value] })
      selection.value = []
    }
  }
}

const getTiles = () => {
  fetch(`${root}/api/v1/getNYConn?year=${year.value}&month=${month.value}&date=${date.value}`, {})
    .then((response) => response.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err.message))
}
watch([year, month, date], getTiles, { immediate: true })
</script>

<style>
.conn-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
}
.correct-group {
  padding: 2em;
  p {
    font-weight: 700;
  }
  div {
    display: flex;
    gap: 2em;
  }
  &:nth-of-type(1) {
    background: hsl(351, 100%, 70%);
  }
  &:nth-of-type(2) {
    background: hsl(61, 100%, 70%);
  }
  &:nth-of-type(3) {
    background: hsl(189, 100%, 70%);
  }
  &:nth-of-type(4) {
    background: hsl(108, 100%, 70%);
  }
}
.board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0.2em;
  padding: 0.5em;
}
.tile {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: min(20vw, 9em);
  aspect-ratio: 1/1;
  border-radius: 15px;
  background-color: hsl(0, 0%, 93%);
  &.isLong {
    font-size: 70%;
    span {
      transform: rotate(-20deg);
    }
  }
  &.isSelected {
    background-color: hsl(67, 20%, 75%);
  }
  &.isCorrect {
    background: rgb(67, 65, 69);
  }
}
.try-button {
  width: 100%;
  padding: 2em;
  background:
  &:disabled {
    background-color: hsl(0, 0%, 50%);
    opacity: 0.3;
  }
}
.date-pick {
  display: flex;
  flex-direction: row;
}
</style>

<template>
  <div class="conn-wrapper">
    <div class="correct-group" v-for="group in correct" :key="group.name">
      <p>{{ group.name }}</p>
      <div>
        <span v-for="tile in group.tiles" :key="tile">{{ tile }}</span>
      </div>
    </div>
    <div v-if="correct.length < 4">
      <div class="board">
        <div
          class="tile"
          :class="{
            isLong: tile.length > 9,
            isSelected: selection.includes(tile),
            isCorrect: correct.some((c) => c.tiles.includes(tile))
          }"
          v-for="tile in data?.startingBoard?.flat() ?? []"
          :key="tile"
          @click="toggleSelection(tile)"
        >
          <span>{{ tile }}</span>
        </div>
      </div>
      <button class="try-button" @click="trySelectedGroup" :disabled="selection.length !== 4">
        Try selected group
      </button>
    </div>
    <div class="date-pick">
      <select v-model="year">
        <option v-for="month in [2025, 2024]" :key="month">{{ month }}</option>
      </select>
      <select v-model="month">
        <option v-for="month in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" :key="month">
          {{ month }}
        </option>
      </select>
      <select v-model="date">
        <option v-for="month in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]" :key="month">
          {{ month }}
        </option>
      </select>
    </div>
    <p>
      {{ data?.name }}
    </p>
    <p>
      {{ data?.lastUpdated }}
    </p>
  </div>
</template>
