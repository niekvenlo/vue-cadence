<script setup lang="ts">
import { ref } from 'vue'
import { useKeys } from '@/composables/use-keys'
import BasicDialog from '@/components/BasicDialog.vue'
import { shuffleArray } from '../utils'

const cards = ref<string[][] | null>(null)
const error = ref<string>('')
const promptIdx = ref<number | null>(null)
const responseIdx = ref<number | null>(null)
const showCardIdx = ref(0)
const isBackRevealed = ref(false)
const isOnlyOneColumn = ref(false)

useKeys((e: KeyboardEvent) => {
  if (e.code !== 'Space') {
    return
  }
  e.preventDefault()
  isBackRevealed.value = e.type === 'keydown'
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
dialog.paste-modal {
  box-shadow: var(--shadow-elevation-high);
  .input-modal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 3em;
    label {
      font-size: 1.5em;
      text-align: center;
      font-weight: 100;
      font-family: sans-serif;
      transition: font-size 0.3s;

      textarea {
        border-radius: 3em;
        display: flex;
        height: 6em;
        width: 10em;
        align-items: center;
        justify-content: center;
        color: transparent;
      }
    }
    /* &:focus-within {
      label {
        font-size: 2em;
      }
    } */
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
    color: transparent;
    &.isBackRevealed {
      color: currentColor;
    }
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
  <div class="flashcard" :class="{ fullHeight: isOnlyOneColumn || responseIdx !== null }">
    <div class="front">
      {{ promptIdx === null ? null : cards?.[showCardIdx][promptIdx || 0] }}
    </div>
    <div class="back" :class="{ isBackRevealed }" @click="isBackRevealed = true">
      {{ responseIdx === null ? null : cards?.[showCardIdx][responseIdx || 0] }}
    </div>
    <div class="buttons" @click="showNextCard">
      <button>Don't know</button>
      <button>Kinda don't</button>
      <button>Kinda do</button>
      <button>Got it</button>
    </div>
  </div>

  <div v-if="error" class="error">{{ error }}</div>
  <BasicDialog :isOpen="cards === null" class="paste-modal">
    <div class="input-modal">
      <label
        >Please paste your data into the field (Ctrl + P / Cmd + P)

        <textarea
          @paste="handlePaste"
          autofocus
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </label>
    </div>
    <button @click="cards = []">Dismiss</button>
  </BasicDialog>
  <div v-if="cards !== null && cards.length">
    <p v-if="promptIdx === null">
      You need to choose a column to use as your flashcard 'front' side.
    </p>
    <p v-else-if="responseIdx === null && !isOnlyOneColumn">
      You may also choose a column to use as your flashcard 'back' side. (Optional)
    </p>
    <table>
      <thead v-if="responseIdx === null && !isOnlyOneColumn">
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
