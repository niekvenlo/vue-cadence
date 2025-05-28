<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ConnectionsEntry } from '@/server/db-access'
import { toChunk } from '@/utils'
const root = import.meta.env.VITE_SERVER_ROOT || 'http://192.168.2.14:3333'

const error = ref('')
const year = ref(2024)
const month = ref(10)
const date = ref(2)

const data = ref<ConnectionsEntry | null>(null)

const checkTiles = (fourTiles: string[]) => {
  if (!data.value) {
    return
  }
  let category = ''
  Object.entries(data.value.board).forEach(([categoryName, { members: categoryAnswers }]) => {
    if (categoryAnswers.every((answer) => fourTiles.includes(answer))) {
      category = categoryName
    }
  })
  return category
}

type Color = 'yellow' | 'green' | 'blue' | 'purple'

const selectedTiles = ref<string[]>([])
const lastDeselectedTiles = ref<string[]>([])

const isGroup = (color: Color | 'any', tile: string) => {
  if (color === 'any') {
    return selectedTiles.value.slice(0, 16).includes(tile)
  }
  if (color === 'yellow') {
    return selectedTiles.value.slice(0, 4).includes(tile)
  }
  if (color === 'green') {
    return selectedTiles.value.slice(4, 8).includes(tile)
  }
  if (color === 'blue') {
    return selectedTiles.value.slice(8, 12).includes(tile)
  }
  if (color === 'purple') {
    return selectedTiles.value.slice(12, 16).includes(tile)
  }
}

const getImmutableIdx = () => Math.floor(selectedTiles.value.length / 4) * 4

const deselectGroup = (n: number) => {
  lastDeselectedTiles.value = selectedTiles.value.splice(n * 4, 4)
}
const handleTileClick = (tile: string) => {
  if (selectedTiles.value.includes(tile) === false) {
    selectedTiles.value.push(tile)
    return
  }
  const foundIdx = selectedTiles.value.findIndex((t) => t === tile)
  const immutableIdx = Math.floor(selectedTiles.value.length / 4) * 4
  if (foundIdx > getImmutableIdx()) {
    selectedTiles.value = selectedTiles.value.filter((t) => t !== tile)
  } else {
    if (foundIdx < 4) {
      return deselectGroup(0)
    }
    if (foundIdx < 8) {
      return deselectGroup(1)
    }
    if (foundIdx < 12) {
      return deselectGroup(2)
    }

    return deselectGroup(3)
  }

  if (selectedTiles.value.slice(immutableIdx).includes(tile)) {
    selectedTiles.value = selectedTiles.value.filter((t) => t !== tile)
  }
}

const showAnswers = ref<string[]>([])

const checkGroupIdx = (idx: number) => {
  const inThisGroup = selectedTiles.value.slice(idx * 4, idx * 4 + 4)
  const groupName = checkTiles(inThisGroup)
  if (groupName) {
    if (showAnswers.value.includes(groupName) === false) {
      showAnswers.value?.push(groupName)
    }
  } else {
    deselectGroup(idx)
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
  padding-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > div {
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
}

.show-answers {
  strong {
    text-transform: capitalize;
  }
  div {
    display: flex;
    gap: 1em;
  }
}

.selected {
  display: flex;
  flex-direction: column;
  .selected-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.3em;
    div {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 2em;
      justify-content: center;
      align-items: center;
      span {
        text-wrap: none;
      }
    }
    button {
      padding: 1em 0.5em;
    }
  }
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
  gap: 0.5em;
  padding: 0.5em;
  perspective: 1000px;
  perspective-origin: 50% 0%;
  .tile {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: min(20vw, 9em);
    aspect-ratio: 1/1;
    border: 0.5px solid hsl(0, 0%, 83%);
    border-radius: 15px;
    /* background-color: hsl(0, 0%, 93%); */
    transform: rotateX(25deg);
    transition: translate 0.1s;
    &:hover {
      translate: 0 2px;
    }
    &.isLong {
      font-size: 70%;
      span {
        transform: rotate(-20deg);
      }
    }
    &.isSelected {
      translate: 0 -5px;
      box-shadow: 0 0 5px 1px hsl(303, 100%, 76%);
      z-index: 1;
    }
    &.isRecentlyDeselected {
      border-color: black;
    }
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
  select {
    font-size: 2em;
  }
}

.isYellowGroup {
  background-color: hsl(60, 100%, 78%);
}
.isGreenGroup {
  background-color: hsl(125, 100%, 78%);
}
.isBlueGroup {
  background-color: hsl(204, 100%, 78%);
}
.isPurpleGroup {
  background-color: hsl(276, 100%, 78%);
}
</style>

<template>
  <div class="conn-wrapper">
    <div>
      <div
        class="show-answers"
        :class="{
          isYellowGroup: idx === 0,
          isGreenGroup: idx === 1,
          isBlueGroup: idx === 2,
          isPurpleGroup: idx === 3
        }"
        v-for="(answer, idx) in showAnswers"
        :key="answer"
      >
        <strong>{{ answer }}</strong>
        <div>
          <span v-for="tile in data?.board[answer].members" :key="tile">{{ tile }}</span>
        </div>
      </div>
      <div class="board">
        <button
          class="tile"
          :class="{
            isLong: tile.length > 9,
            isSelected: isGroup('any', tile),
            isYellowGroup: isGroup('yellow', tile),
            isGreenGroup: isGroup('green', tile),
            isBlueGroup: isGroup('blue', tile),
            isPurpleGroup: isGroup('purple', tile),
            isRecentlyDeselected: lastDeselectedTiles.includes(tile)
          }"
          v-for="tile in data?.startingBoard?.flat() ?? []"
          :key="tile"
          @click="handleTileClick(tile)"
        >
          <span>{{ tile }}</span>
        </button>
      </div>

      <div class="selected">
        <div
          class="selected-group"
          v-for="(group, groupIdx) in toChunk(selectedTiles.slice(0, getImmutableIdx()), 4)"
          :key="group.toString()"
          :class="{
            isYellowGroup: groupIdx === 0,
            isGreenGroup: groupIdx === 1,
            isBlueGroup: groupIdx === 2,
            isPurpleGroup: groupIdx === 3
          }"
        >
          <div>
            <span v-for="tile in group" :key="tile">{{ tile }}</span>
          </div>
          <button @click="checkGroupIdx(groupIdx)">Check Group</button>
        </div>
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
          <option v-for="date in Array.from({ length: 30 }).map((_, i) => i + 1)" :key="date">
            {{ date }}
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
  </div>
</template>
