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

const modifyDate = (callback: (d: Date) => void) => {
  if (!year.value || !month.value || !date.value) {
    return
  }
  const currentDate = new Date(year.value, month.value - 1, date.value)
  callback(currentDate)
  year.value = currentDate.getFullYear()
  month.value = currentDate.getMonth() + 1
  date.value = currentDate.getDate()
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
.connections-view {
  padding: 1em;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

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
      gap: 0.4em;

      aspect-ratio: 1/1;
      border: 0.5px solid hsl(0, 0%, 83%);
      border-radius: 15px;
      color: currentColor;
      cursor: pointer;
      min-width: min(20vw, 9em);
      transition: translate 0.1s;
      .label {
        font-size: min(1.1em, 3vw);
        font-family: sans-serif;
        max-width: 24vw;
      }
      &.isLong {
        .label {
          transform: scale(90%) rotate(-20deg);
        }
      }
      &.isSelected {
        border-color: hsl(0, 0%, 70%);
        z-index: 1;
      }
      &.isRecentlyDeselected {
        filter: brightness(95%);
      }
      .dot {
        line-height: 0.5;
        width: 1em;
        aspect-ratio: 1/1;
        border-radius: 50%;
      }
      &.isCorrect {
        .dot {
          opacity: 0;
        }
      }
    }
  }

  .selected {
    flex-grow: 1;
    font-size: 1.1em;
    font-family: sans-serif;
    padding: 0.5em;
    max-width: 100ch;
    > div {
      flex-grow: 1;
      padding: 1.5em;
      display: grid;
      grid-template-columns: 1fr max-content;
      grid-template-areas: 'tiles button';
      align-items: center;
      p {
        grid-area: title;
        display: none;
      }
      .tiles {
        grid-area: tiles;
        display: flex;
        flex-wrap: wrap;
        gap: 0.4em 3ch;
      }
      button {
        grid-area: button;
      }
      &.isCorrect {
        grid-template-areas:
          'title'
          'tiles';
        p {
          display: block;
          text-transform: lowercase;
          font-weight: 700;
          font-size: 1.4em;
        }
        button {
          display: none;
        }
      }
    }
  }

  .date-pick {
    margin-top: 6em;
    display: flex;
    justify-content: center;
    width: 100%;
    div {
      flex-grow: 1;
      padding-inline: 1em;
      text-align: center;
      font-size: 2em;
      white-space: nowrap;
    }
    @media (max-width: 600px) {
      flex-direction: column;
    }
  }

  .isYellowCorrectGroup {
    background-color: hsl(45, 100%, 78%);
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
    box-shadow: 0 0 5px 1px hsl(45, 100%, 78%);
    .dot {
      background-color: hsl(45, 100%, 50%);
    }
  }
  .hasGreenDot {
    box-shadow: 0 0 5px 1px hsl(125, 100%, 50%);
    .dot {
      background-color: hsl(125, 100%, 50%);
    }
  }
  .hasBlueDot {
    box-shadow: 0 0 5px 1px hsl(204, 100%, 50%);
    .dot {
      background-color: hsl(204, 100%, 50%);
    }
  }
  .hasPurpleDot {
    box-shadow: 0 0 5px 1px hsl(276, 96.5%, 77.5%);
    .dot {
      background-color: hsl(276, 96.5%, 77.5%);
    }
  }
}
</style>

<template>
  <div class="connections-view">
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
        <span class="dot">{{ isGroup('any', tile) ? ' ' : '' }}</span>
      </button>
    </div>
    <div class="selected">
      <div
        v-for="(group, groupIdx) in toChunk(selectedTiles.slice(0, getLockedIdx()), 4)"
        :key="group.toString()"
        :class="{
          isYellowCorrectGroup: groupIdx === 0,
          isGreenCorrectGroup: groupIdx === 1,
          isBlueCorrectGroup: groupIdx === 2,
          isPurpleCorrectGroup: groupIdx === 3,
          isCorrect: isCorrectGroup(group)
        }"
      >
        <p>{{ getGroupName(group) }}</p>
        <div class="tiles">
          <span v-for="tile in group" :key="tile">{{ tile }}</span>
        </div>
        <button class="light" @click="handleGroupCheckClick(group)">Check Group</button>
      </div>
    </div>
    <div class="date-pick">
      <button class="black" @click="modifyDate((d) => d.setDate(d.getDate() - 1))">
        yesterday
      </button>
      <div>{{ year }} - {{ month }} - {{ date }}</div>
      <button class="black" @click="modifyDate((d) => d.setDate(d.getDate() + 1))">tomorrow</button>
    </div>
    <p>
      {{ data?.name }}
    </p>
  </div>
</template>
