<script setup lang="ts">
import { ref } from 'vue'
import { useKeys } from '@/composables/use-keys'
import BasicDialog from '@/components/BasicDialog.vue'
import { shuffleArray } from '../utils'

const cards = ref<string[][] | null>(null)
const error = ref<string>('')
const promptIdx = ref<number | null>(null)
const responseIndices = ref<number[]>([])
const showCardIdx = ref(0)
const isBackRevealed = ref(false)
const isOnlyOneColumn = ref(false)

const reset = () => {
  cards.value = null
  error.value = ''
  promptIdx.value = null
  responseIndices.value = []
  showCardIdx.value = 0
}

useKeys((e: KeyboardEvent) => {
  const allowedKeyCodes = [
    'Space',
    'ArrowRight',
    'ArrowLeft',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5'
  ]
  if (allowedKeyCodes.includes(e.code) === false) {
    return
  }
  e.preventDefault()
  if (e.code === 'Space') {
    isBackRevealed.value = e.type === 'keydown'
    return
  }
  if (e.type === 'keyup') {
    if (e.code === 'ArrowRight') {
      showNextCard()
    }
    if (e.code === 'ArrowLeft') {
      showPreviousCard()
    }
    if (e.code.startsWith('Digit') && promptIdx.value) {
      console.log({
        front: cards.value?.[showCardIdx.value]?.[promptIdx.value],
        rank: e.code.slice(-1)
      })
    }
  }
})

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
  cards.value = shuffleArray(arrays)
  if (arrays[0].length < 2) {
    isOnlyOneColumn.value = true
    promptIdx.value = 0
  }
}

const handleColumnSelection = (idx: number) => {
  if (promptIdx.value === null) {
    promptIdx.value = idx
    return
  }
  responseIndices.value = [...new Set([...responseIndices.value, idx])]
}

const showPreviousCard = () => {
  showCardIdx.value =
    (showCardIdx.value + (cards.value?.length ?? 0) - 1) % (cards.value?.length ?? 0)
  isBackRevealed.value = false // useless
}

const showNextCard = () => {
  showCardIdx.value = (showCardIdx.value + 1) % (cards.value?.length ?? 0)
  isBackRevealed.value = false // useless
}
</script>

<style>
#flashwrapper {
  --color-angle: 50deg;
}
.error {
  padding: 1em;
  background: black;
  color: white;
}
dialog.paste-modal {
  box-shadow: var(--shadow-elevation-high);
  .input-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    height: 100%;
    padding: 3em;

    opacity: 0.2;

    &:focus-within {
      opacity: 1;
    }
    label {
      display: flex;
      flex-direction: column;
      font-size: 1.5em;
      text-align: center;
      font-weight: 100;
      font-family: sans-serif;
      transition: font-size 0.3s;
      flex-grow: 1;

      textarea {
        display: flex;
        border-radius: 0.3em;
        flex-grow: 1;
        height: 20vh;
        padding: 1em;
        align-items: center;
        justify-content: center;
        color: hsl(62, 100%, 57%);
        background-color: hsl(0, 46%, 14%);
        font-family: monospace;
        font-size: 1rem;
        &::placeholder {
          color: hsl(112, 100%, 57%);
        }
        outline: none;
      }
    }
    .dismiss {
      width: 100%;
      padding: 1em;
    }
  }
}

table {
  width: 100%;
  border-collapse: collapse;
  td {
    text-align: center;
    color: hsl(231, 23%, 22%);
    &:nth-of-type(2n) {
      color: hsl(0, 23%, 22%);
      font-style: italic;
    }
  }
  thead,
  tr:nth-of-type(2n) {
    background-color: rgb(249, 249, 174);
  }
  button {
    width: 100%;
    padding-top: 2em;
    border: none;
    background-color: hsl(var(--color-angle), 80%, 70%);
    cursor: pointer;
    text-transform: uppercase;
    font-size: 0.9em;
  }
}

.flashcard {
  --nav-height: 64px;
  display: grid;
  grid-template-rows: 5fr 3fr 1fr;

  width: 100%;
  transition: height 1s;
  text-align: center;
  height: calc(100vh - var(--nav-height));
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
    display: flex;
    flex-direction: column;
    color: hsl(231, 23%, 22%);
    div {
      &:nth-of-type(2n) {
        color: hsl(0, 23%, 22%);
        font-style: italic;
      }
    }
  }
  .front {
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--color-angle), 100%, 50%);
    font-size: 4em;
  }
  .back {
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--color-angle), 100%, 41%);
    font-size: 3em;
    div {
      visibility: hidden;
    }
    &.isBackRevealed {
      div {
        visibility: visible;
      }
    }
  }
  .buttons {
    background: hsl(var(--color-angle), 100%, 16%);
    display: flex;
    overflow: hidden;
    font-size: 8em;
    line-height: 0.6;
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
  <div id="flashwrapper">
    <div class="flashcard">
      <div class="front">
        {{ promptIdx === null ? null : cards?.[showCardIdx][promptIdx || 0] }}
      </div>
      <div
        class="back"
        :class="{ isBackRevealed }"
        @mouseover="isBackRevealed = true"
        @mouseout="isBackRevealed = false"
      >
        <div v-for="idx in responseIndices" :key="idx">
          {{ cards?.[showCardIdx][idx] }}
        </div>
      </div>
      <div class="buttons" @click="showNextCard">
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <BasicDialog :isOpen="cards === null" class="paste-modal">
      <div class="input-modal">
        <label
          ><p>Please paste your data into the field</p>
          <p>(Ctrl + P / Cmd + P)</p>

          <textarea
            @paste="handlePaste"
            autofocus
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            placeholder="> please paste here ▌"
          />
        </label>
        <button class="dismiss" @click="cards = []">Dismiss</button>
      </div>
    </BasicDialog>
    <div v-if="cards !== null && cards.length">
      <p v-if="promptIdx === null">
        You need to choose a column to use as your flashcard 'front' side.
      </p>
      <p v-else-if="!isOnlyOneColumn">
        You may also choose which columns to use as your flashcard 'back' side. (Optional)
      </p>
      <table>
        <thead>
          <th v-for="(column, idx) in cards[0]" :key="column">
            <button
              v-if="idx !== promptIdx && !responseIndices.includes(idx)"
              @click="() => handleColumnSelection(idx)"
            >
              {{ promptIdx === null ? 'Use as front' : 'Use as back' }}
            </button>
            <p v-else-if="idx === promptIdx">Front</p>
            <p v-else>Back</p>
          </th>
        </thead>
        <tr v-for="card in cards" :key="card[0]">
          <td v-for="column in card" :key="column">{{ column }}</td>
        </tr>
      </table>
      <button v-if="cards" @click="reset">Clear current cards</button>
    </div>
  </div>
</template>
