<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ConnectionsEntry } from '@/server/db-access'
import { numIsBetween, toChunk } from '@/utils'

type Color = 'yellow' | 'green' | 'blue' | 'purple'

const root = import.meta.env.VITE_SERVER_ROOT
const HYPHEN = '-'

const error = ref('')
const year = ref<number>()
const month = ref<number>()
const date = ref<number>()

const interval = ref<NodeJS.Timeout>()
const abort = ref()

const data = ref<ConnectionsEntry | null>(null)

// Given found tiles in random order, get the name of the category, if any?
const getGroupName = (fourTiles: string[]) => {
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

const selectedTiles = ref<string[]>([])
const lastDeselectedTiles = ref<string[]>([])
const correctTiles = ref<string[]>([])

const handleGroupCheckClick = (groupTiles: string[]) => {
  const groupName = getGroupName(groupTiles)
  if (!groupName) {
    deselectTiles(groupTiles)
  } else {
    correctTiles.value.push(...groupTiles)
  }
}

const isCorrectGroup = (tiles: string[]) => {
  return correctTiles.value.includes(tiles[0])
}

const isGroup = (color: Color | 'any', tile: string) => {
  const foundIdx = selectedTiles.value.findIndex((t) => t === tile)
  if (color === 'any') {
    return foundIdx !== -1
  } else if (color === 'yellow') {
    return numIsBetween(foundIdx, 0, 4)
  } else if (color === 'green') {
    return numIsBetween(foundIdx, 4, 8)
  } else if (color === 'blue') {
    return numIsBetween(foundIdx, 8, 12)
  } else if (color === 'purple') {
    return numIsBetween(foundIdx, 12, 16)
  }
}

// If there are 6 tiles selected, the first four should be considered locked.
const getLockedIdx = () => Math.floor(selectedTiles.value.length / 4) * 4

// Deselect an intire group at once.
const deselectTile = (tile: string) => {
  selectedTiles.value = selectedTiles.value.filter((t) => t !== tile)
  lastDeselectedTiles.value = [tile]
}
// Deselect an intire group at once.
const deselectTiles = (tiles: string[]) => {
  selectedTiles.value = selectedTiles.value.filter((t) => !tiles.includes(t))
  lastDeselectedTiles.value = tiles
}
// Deselect an intire group at once.
const deselectGroup = (n: number) => {
  lastDeselectedTiles.value = selectedTiles.value.splice(n * 4, 4)
}

// On tile click, we want to cleverly select or deselect tiles.
// 1: If the tile is unselected, we want to select it
// 2: If the tile is selected and `locked`, we want to deselect the group
// it belongs to.
// 3: If the tile is selected and unlocked, we want to deselect it.
const handleTileClick = (tile: string) => {
  if (selectedTiles.value.includes(tile) === false) {
    selectedTiles.value.push(tile)
    return
  }
  const foundIdx = selectedTiles.value.findIndex((t) => t === tile)
  if (foundIdx > getLockedIdx()) {
    deselectTile(tile)
  } else {
    if (!correctTiles.value.includes(selectedTiles.value[foundIdx])) {
      const groupIdx = Math.floor(foundIdx / 4)
      deselectGroup(groupIdx)
    }
  }

  if (selectedTiles.value.slice(getLockedIdx()).includes(tile)) {
    deselectTile(tile)
  }
}

// Fetch new data from the API.
const getTiles = () => {
  if (typeof year.value !== 'number') {
    return
  }
  const params = new URLSearchParams()
  if (year.value && month.value && date.value) {
    params.append('year', year.value.toString())
    params.append('month', month.value.toString())
    params.append('date', date.value.toString())
  }
  fetch(`${root}/api/v1/getNYConn?${params}`, {})
    .then((response) => response.json())
    .then((json) => {
      if (json.error) {
        error.value = json.error
      }
      data.value = json
    })
    .catch((err) => (error.value = err.message))
}

const updateWithServerData = (data: { [key: string]: string } | null) => {
  abort.value?.abort()
  abort.value = new AbortController()
  resetTimer()
  const params = new URLSearchParams()
  let url = `${root}/api/v1/getNYConnSave`
  if (data) {
    Object.keys(data).forEach((key) => {
      params.append(key, data[key])
    })
    url = `${root}/api/v1/updateNYConnSave?${params}`
  }
  fetch(url, { signal: abort.value.signal })
    .then((response) => response.json())
    .then((json) => {
      error.value = json.error
      const { sharedDate, sharedTiles, sharedCorrectTiles } = json
      const [yyyy, mm, dd] = sharedDate.split(HYPHEN)
      year.value = Number(yyyy)
      month.value = Number(mm)
      date.value = Number(dd)
      selectedTiles.value = sharedTiles.split(',').filter((f: string) => f)
      correctTiles.value = sharedCorrectTiles.split(',').filter((f: string) => f)
    })
    .catch((err) => (error.value = err.message))
}

const resetTimer = () => {
  clearTimeout(interval.value)
  interval.value = setTimeout(() => updateWithServerData(null), 1800)
}

watch(
  [year, month, date],
  async () => {
    if (!year.value || !month.value || !date.value) {
      await updateWithServerData(null)
      return
    }
    const leadingZero = (n: number) => n.toString().padStart(2, '0')
    const dateString = [year.value, month.value, date.value].map((n) => leadingZero(n)).join(HYPHEN)
    await updateWithServerData({ sharedDate: dateString, sharedTiles: '', sharedCorrectTiles: '' })
    lastDeselectedTiles.value = []
    getTiles()
  },
  { immediate: true }
)
watch(
  () => selectedTiles.value.toString() + HYPHEN + correctTiles.value.toString(),
  () => {
    if (year.value && month.value && date.value) {
      updateWithServerData({
        sharedTiles: selectedTiles.value.toString(),
        sharedCorrectTiles: correctTiles.value.toString()
      })
    }
  }
)
</script>

<style>
.connections-wrapper {
  padding-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > div {
    max-width: 600px;
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
  gap: 0.1em;
  .selected-group {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 1.5em;
    .tiles {
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
    .groupName {
      height: 2em;
      text-align: center;
      font-weight: bold;
      text-transform: lowercase;
    }
    button {
      height: 2em;
      padding: 0.5em;
      background: hsla(120deg 100% 100% / 40%);
      border: none;
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
  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: min(20vw, 9em);
    aspect-ratio: 1/1;
    border: 0.5px solid hsl(0, 0%, 83%);
    border-radius: 15px;
    color: currentColor;
    transition: translate 0.1s;
    &:hover {
      translate: 0 2px;
    }
    .label {
      max-width: 24vw;
      font-size: min(1.1em, 3vw);
      font-family: sans-serif;
    }
    &.isLong {
      .label {
        transform: scale(90%) rotate(-20deg);
      }
    }
    &.isSelected {
      translate: 0 -5px;
      z-index: 1;
    }
    &.isRecentlyDeselected {
      border-color: black;
    }
    .highlight {
      line-height: 0.5;
      width: 1em;
      aspect-ratio: 1/1;
      border-radius: 50%;
    }
    &.isCorrect {
      .highlight {
        visibility: hidden;
      }
    }
  }
}

.date-pick {
  margin-block: 6em;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  justify-content: center;
  button,
  select {
    border: none;
  }
  button {
    border-radius: 10em;
    background-color: transparent;
    background-image: radial-gradient(
      closest-side,
      hsla(0 0% 0%/0.1) 0%,
      hsla(0 0% 0%/0.1) 30%,
      hsla(0 0% 0%/0) 100%
    );
    font-size: 3em;
  }
  select {
    background: hsla(0 0% 0%/0.1);
    font-size: 2em;
    text-align: center;
  }
}

.isYellowCorrectGroup {
  background-color: hsl(60, 100%, 78%);
}
.isGreenCorrectGroup {
  background-color: hsl(125, 100%, 78%);
}
.isBlueCorrectGroup {
  background-color: hsl(204, 100%, 78%);
}
.isPurpleCorrectGroup {
  background-color: hsl(276, 100%, 78%);
}

.hasYellowDot {
  box-shadow: 0 0 5px 1px hsl(60, 100%, 78%);

  > .highlight {
    background-color: hsl(60, 100%, 50%);
  }
}
.hasGreenDot {
  box-shadow: 0 0 5px 1px hsl(125, 100%, 50%);
  > .highlight {
    background-color: hsl(125, 100%, 50%);
  }
}
.hasBlueDot {
  box-shadow: 0 0 5px 1px hsl(204, 100%, 50%);
  > .highlight {
    background-color: hsl(204, 100%, 50%);
  }
}
.hasPurpleDot {
  box-shadow: 0 0 5px 1px hsl(276, 96.5%, 77.5%);
  .highlight {
    background-color: hsl(276, 96.5%, 77.5%);
  }
}
</style>

<template>
  <div class="connections-wrapper">
    <div>
      <h1 v-if="error">{{ error }}</h1>
      <div class="board">
        <button
          class="tile"
          :class="{
            isLong: tile.split(' ').every((w) => w.length > 9),
            isSelected: isGroup('any', tile),
            isCorrect: correctTiles.includes(tile),
            isYellowCorrectGroup: correctTiles.includes(tile) && isGroup('yellow', tile),
            isGreenCorrectGroup: correctTiles.includes(tile) && isGroup('green', tile),
            isBlueCorrectGroup: correctTiles.includes(tile) && isGroup('blue', tile),
            isPurpleCorrectGroup: correctTiles.includes(tile) && isGroup('purple', tile),
            isRecentlyDeselected: lastDeselectedTiles.includes(tile),
            hasYellowDot: isGroup('yellow', tile),
            hasGreenDot: isGroup('green', tile),
            hasBlueDot: isGroup('blue', tile),
            hasPurpleDot: isGroup('purple', tile)
          }"
          v-for="tile in data?.startingBoard?.flat() ?? []"
          :key="tile"
          @click="handleTileClick(tile)"
        >
          <span class="label">{{ tile }}</span>
          <span class="highlight">{{ isGroup('any', tile) ? ' ' : '' }}</span>
        </button>
      </div>

      <div class="selected">
        <div
          class="selected-group"
          v-for="(group, groupIdx) in toChunk(selectedTiles.slice(0, getLockedIdx()), 4)"
          :key="group.toString()"
          :class="{
            isYellowCorrectGroup: groupIdx === 0,
            isGreenCorrectGroup: groupIdx === 1,
            isBlueCorrectGroup: groupIdx === 2,
            isPurpleCorrectGroup: groupIdx === 3
          }"
        >
          <div class="tiles">
            <span v-for="tile in group" :key="tile">{{ tile }}</span>
          </div>
          <span class="groupName" v-if="isCorrectGroup(group)">{{ getGroupName(group) }}</span>
          <button v-else @click="handleGroupCheckClick(group)">Check Group</button>
        </div>
      </div>

      <div class="date-pick">
        <button @click="year++">+</button>
        <button @click="month++">+</button>
        <button @click="date++">+</button>
        <select v-model="year">
          <option v-for="month in [2025, 2024, 2023]" :key="month">{{ month }}</option>
        </select>
        <select v-model="month">
          <option v-for="month in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" :key="month">
            {{ month }}
          </option>
        </select>
        <select v-model="date">
          <option v-for="date in Array.from({ length: 31 }).map((_, i) => i + 1)" :key="date">
            {{ date }}
          </option>
        </select>
        <button @click="year--">-</button>
        <button @click="month = (12 + month - 1) % 12">-</button>
        <button @click="date--">-</button>
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
