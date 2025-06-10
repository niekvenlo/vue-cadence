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
    return
  }
  const arrays = pastedText.split(/\n/).map((line) => line.split(/\t/))
  if (arrays.length < 2) {
    error.value = 'Could not parse pasted data into cards'
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
  #paste-here {
    flex-grow: 1;
    display: flex;
    width: 100%;
    height: 100%;
    position: absolute;

    textarea {
      background-position: center;
      background-image: url('/flash-instructions-1.png');
      background-size: contain;
      background-repeat: no-repeat;
      flex-grow: 1;
      width: 100%;
      height: 100%;
      &:focus {
        background-size: cover;
        background-image: radial-gradient(
            circle at center,
            transparent,
            transparent 40%,
            white 50%,
            white 100%
          ),
          url('/flash-instructions-2.png');
      }
    }

    &::after {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      content: 'Ctrl-V';
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      font-family: sans-serif;
      font-size: 20vmin;
      color: hsl(269, 100%, 25%);
      text-shadow: white 3px 3px 3px;
      pointer-events: none;
    }

    &:focus-within::after {
      content: 'Ctrl-P';
      color: hsl(269, 100%, 75%);
      text-shadow: black 3px 3px 3px;
    }
  }
  #data-entry-wrapper {
    min-height: 100vh;
    .error {
      padding: 1em;
      background: black;
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
        background-color: hsl(60, 86.2%, 82.9%);
      }
    }
  }
  h2 {
    text-align: right;
  }
  .explanation {
    padding-top: 2em;
    font-size: 1.2em;
    max-width: 70ch;
    margin: auto;
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

    <div id="paste-here" v-if="cards === null">
      <textarea @paste="handlePaste" autocorrect="off" autocapitalize="off" spellcheck="false" />
    </div>
    <div id="data-entry-wrapper" v-else>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="top-bar" v-if="cards !== null">
        <h1>{{ isDimsumView ? 'dim sum' : 'standard' }} style</h1>
        <div>
          <button class="black" @click="isDimsumView = !isDimsumView">
            Switch to {{ isDimsumView ? 'standard flash cards' : 'dim sum' }}
          </button>
          <button v-if="cards" class="black" @click="reset">Clear current cards</button>
        </div>
      </div>
      <div v-if="cards.length">
        <h2>{{ cards.length }} entries.</h2>
        <p v-if="promptIdx === null" class="explanation">
          You need to choose a column to use as your flashcard 'front' side.
        </p>
        <p v-else-if="!isOnlyOneColumn" class="explanation">
          Now that you have selected the 'front', you may also choose which columns to use as your
          flashcard 'back' side. (Without a back side, you can only use standard flash cards.)
        </p>
        <table cellpadding="0">
          <thead>
            <th v-for="(column, idx) in cards[0]" :key="column">
              <button
                v-if="idx !== promptIdx && !responseIndices.includes(idx)"
                class="black"
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
      </div>
    </div>
  </div>
</template>
