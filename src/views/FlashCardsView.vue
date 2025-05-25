<script setup lang="ts">
import { ref } from 'vue'

const cards = ref<string[][] | null>(null)
const error = ref<string>('')
const promptIdx = ref<number | null>(null)
const responseIdx = ref<number | null>(null)
const showCardIdx = ref(0)
const isBackRevealed = ref(false)

const handlePaste = (event: ClipboardEvent) => {
  const pastedText = event.clipboardData?.getData('text') // || window.clipboardData.getData("text");
  if (pastedText === undefined) {
    error.value = 'Could not read from clipboard'
    return
  }
  const arrays = pastedText.split(/\n/).map((line) => line.split(/\t/))
  if (arrays.length < 2) {
    error.value = 'Could not parse pasted data into cards'
    return
  }
  error.value = ''
  cards.value = arrays
  if (arrays[0].length < 2) {
    promptIdx.value = 0
  }
}

const handleColumnSelection = (idx: number) => {
  if (promptIdx.value === null) {
    promptIdx.value = idx
    return
  }
  if (responseIdx.value === null) {
    responseIdx.value = idx
  }
}

const showNextCard = () => {
  showCardIdx.value = (showCardIdx.value + 1) % (cards.value?.length ?? 0)
  isBackRevealed.value = false
}
</script>

<style>
.error {
  padding: 1em;
  background: black;
  color: white;
}
.input {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-grow: 1;
  textarea {
    --nav-height: 64px;
  }
}
table {
  width: 100%;
  border-collapse: collapse;
}
table th:nth-of-type(2n),
table td:nth-of-type(2n) {
  background: #ffe;
}
.flashcard {
  --nav-height: 64px;
  --color-angle: 50deg;
  display: grid;
  grid-template-rows: 5fr 3fr 1fr;

  width: 100%;
  transition: height 2s;
  text-align: center;
  height: calc(90vh - var(--nav-height));
  &.fullHeight {
    height: calc(100vh - var(--nav-height));
  }
  &:has(.front:empty) {
    padding-block: 0;
    height: 0;
    .buttons {
      display: none;
    }
  }
  &:has(.back:empty) {
    grid-template-rows: 7fr 1fr 1fr;
  }
  .front,
  .back {
    font-size: 3em;
  }
  .front {
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--color-angle), 100%, 50%);
  }
  .back {
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--color-angle), 100%, 41%);
  }
  .buttons {
    background: hsl(var(--color-angle), 100%, 16%);
    display: flex;
    * {
      color: white;
      text-transform: lowercase;
      font-size: 1.5em;
      flex-grow: 1;
      border: none;
      background: none;
      &:hover {
        background: hsl(var(--color-angle), 100%, 10%);
      }
    }
  }
}
</style>

<template>
  <div
    class="flashcard"
    :class="{ fullHeight: (cards?.[0].length ?? 0) < 2 || responseIdx !== null }"
  >
    <div class="front">
      {{ promptIdx === null ? null : cards?.[showCardIdx][promptIdx] }}
    </div>
    <div class="back" @click="isBackRevealed = true">
      {{ responseIdx === null ? null : cards?.[showCardIdx][responseIdx] }}
    </div>
    <div class="buttons" @click="showNextCard">
      <button>Don't know</button>
      <button>Kinda don't</button>
      <button>Kinda do</button>
      <button>Got it</button>
    </div>
  </div>

  <div v-if="error" class="error">{{ error }}</div>
  <div v-if="cards === null" class="input">
    <p>Please paste your data into the field</p>
    <textarea @paste="handlePaste" autofocus />
  </div>
  <div v-else>
    <p v-if="promptIdx === null">
      You need to choose a column to use as your flashcard 'front' side.
    </p>
    <p v-else-if="responseIdx === null">
      You may also choose a column to use as your flashcard 'back' side. (Optional)
    </p>
    <table v-if="responseIdx === null">
      <thead>
        <th v-for="(column, idx) in cards[0]" :key="column">
          <button
            v-if="promptIdx === null || responseIdx === null"
            @click="() => handleColumnSelection(idx)"
          >
            {{ promptIdx === null ? 'Use as front' : 'Use as back' }}
          </button>
        </th>
      </thead>
      <tr v-for="card in cards" :key="card[0]">
        <td v-for="column in card" :key="column">{{ column }}</td>
      </tr>
    </table>
    <button v-if="cards" @click="cards = null">Clear current cards</button>
  </div>
</template>
