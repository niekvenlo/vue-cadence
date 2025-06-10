<script setup lang="ts">
import { computed, ref } from 'vue'
import FlashCards from '@/components/flash/FlashCards.vue'
import DimSumCards from '@/components/flash/DimsumCards.vue'
import { shuffleArray } from '../utils'

const cards = ref<string[][] | null>(null)
const error = ref<string>('')
const promptIdx = ref<number | null>(null)
const responseIndices = ref<number[]>([])

const isOnlyOneColumn = computed(() => cards.value?.[0].length === 1)

const isDimsumView = ref(true)

const locallyStored = localStorage.getItem('flash-cards')
if (locallyStored) {
  cards.value = JSON.parse(locallyStored)
}

const reset = () => {
  cards.value = null
  error.value = ''
  promptIdx.value = null
  responseIndices.value = []
  localStorage.removeItem('flash-cards')
}

const handlePaste = (event: ClipboardEvent) => {
  const pastedText = event.clipboardData?.getData('text') // || window.clipboardData.getData("text");
  if (pastedText === undefined) {
    error.value = 'Could not read from clipboard'
    setTimeout(() => (error.value = ''), 2000)
    return
  }
  const arrays = pastedText.split(/\n/).map((line) => line.split(/\t/))
  if (arrays.length < 2) {
    error.value = 'Could not parse pasted data into cards'
    setTimeout(() => (error.value = ''), 2000)
    return
  }
  error.value = ''
  cards.value = shuffleArray(arrays)
  localStorage.setItem('flash-cards', JSON.stringify(cards.value))
  if (arrays[0].length < 2) {
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
</script>

<style>
#flash-cards-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  --color-angle: 50deg;

  #data-entry-wrapper {
    min-height: 100vh;
    .error {
      padding: 1em;
      background: darkred;
      color: white;
    }
    .top-bar {
      display: flex;
      justify-content: space-between;
      h1 {
        text-transform: capitalize;
        flex-grow: 1;
      }
      div {
        flex-grow: 1;
        display: flex;
        button {
          padding-inline: 1em;
        }
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      th,
      td {
        padding-inline: 2vw;
        color: hsl(231, 23%, 22%);
        &:nth-of-type(2n) {
          color: hsl(0, 23%, 22%);
          font-style: italic;
        }
      }
      thead,
      tr:nth-of-type(2n) {
        text-align: left;
        background-color: hsl(60, 86.2%, 82.9%);
        button {
          width: max-content;
        }
      }
    }
  }
  h2 {
    text-align: right;
    padding-right: 1em;
  }
  .explanation {
    padding: 8em 2em;
    font-size: 1.2em;
    max-width: 70ch;
    margin: auto;
    div {
      position: relative;
      &:focus-within::before {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        content: 'Paste here';
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        font-family: sans-serif;
        font-size: 10vmin;
        color: hsl(269, 100%, 25%);
        text-shadow: white 0px 0px 3px;
        pointer-events: none;
      }
    }
    textarea {
      color: transparent;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      flex-grow: 1;
      width: 100%;
      height: 100%;
      aspect-ratio: 2/1;
      &:focus {
        background-size: cover;
        background-image: radial-gradient(circle at center center, #1a8fe5, #e4e4ed),
          repeating-radial-gradient(
            circle at center center,
            hsl(269, 100%, 95%),
            hsl(269, 100%, 95%),
            22px,
            transparent 34px,
            transparent 22px
          );
        background-blend-mode: multiply;
        background-color: #e4e4ed;
      }
    }
  }
}
</style>

<template>
  <div id="flash-cards-wrapper">
    <div id="flash-cards">
      <DimSumCards
        v-if="isDimsumView && !isOnlyOneColumn"
        :cards="cards"
        :promptIdx="promptIdx"
        :responseIndices="responseIndices"
        :isOnlyOneColumn="isOnlyOneColumn"
      ></DimSumCards>
      <FlashCards
        v-else
        :cards="cards"
        :promptIdx="promptIdx"
        :responseIndices="responseIndices"
        :isOnlyOneColumn="isOnlyOneColumn"
      ></FlashCards>
    </div>

    <div id="data-entry-wrapper">
      <div class="top-bar">
        <h1>{{ isDimsumView ? 'dim sum' : 'standard' }} style</h1>
        <div>
          <button class="black" @click="isDimsumView = !isDimsumView">
            Switch to {{ isDimsumView ? 'standard flash cards' : 'dim sum' }}
          </button>
          <button v-if="cards" class="black" @click="reset">
            Forget current {{ cards.length }} cards
          </button>
        </div>
      </div>
      <div class="explanation" v-if="cards === null">
        <h2>Step 1</h2>
        <p>You'll need to copy/paste some data from a table or a spreadsheet.</p>
        <div>
          <textarea
            @paste="handlePaste"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </div>
      </div>
      <div class="explanation" v-else-if="promptIdx === null">
        <h2>Step 2</h2>
        <p>You need to choose a column to use as your flashcard 'front' side.</p>
        <p v-if="!isDimsumView">
          (Since you have selected standard style, when you make your choice, the cards will
          automatically scroll into view.)
        </p>
      </div>
      <div class="explanation" v-else-if="isOnlyOneColumn">
        <h2>Step 3</h2>
        <p>The data you've pasted only has one column, so you can only use standard flash cards.</p>
      </div>
      <div class="explanation" v-else>
        <h2>Step 3</h2>
        <p>You may also choose which columns to use as your flashcard 'back' side.</p>
        <p>
          (Dimsum style requires a back side. Without a back side, you can only use standard flash
          cards.)
        </p>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <table cellpadding="0" v-if="cards !== null">
        <thead>
          <th v-for="(column, idx) in cards[0]" :key="column">
            <button
              v-if="idx !== promptIdx && !responseIndices.includes(idx)"
              class="light"
              @click="() => handleColumnSelection(idx)"
            >
              {{
                promptIdx === null
                  ? 'Use this column for the front'
                  : 'Use this column for the back'
              }}
            </button>
            <p v-else-if="idx === promptIdx">Front</p>
            <p v-else>Back</p>
          </th>
        </thead>
        <tr v-for="card in cards" :key="card[0]">
          <td v-for="column in card" :key="column">{{ column }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
