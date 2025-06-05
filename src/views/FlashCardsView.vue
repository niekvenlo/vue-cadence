<script setup lang="ts">
import { computed, ref } from 'vue'
import BasicDialog from '@/components/BasicDialog.vue'
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
  --color-angle: 50deg;
  #flash-cards {
    --nav-height: 64px;
  }
  #data-entry-wrapper {
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
            padding: 1em 0 1em calc(1em + 20ch);
            align-items: center;
            justify-content: center;
            color: hsl(62, 100%, 57%);
            background-color: hsl(0, 46%, 14%);
            font-family: monospace;
            caret-color: hsl(112, 100%, 57%);
            font-size: 1rem;
            &::placeholder {
              color: hsl(112, 100%, 57%);
              transform: translateX(-20ch);
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

    <div id="data-entry-wrapper">
      <div v-if="error" class="error">{{ error }}</div>
      <div class="top-bar">
        <h1>{{ isDimsumView ? 'dim sum' : 'standard' }} style</h1>
        <div>
          <button class="black" @click="isDimsumView = !isDimsumView">
            Switch to {{ isDimsumView ? 'standard flash cards' : 'dim sum' }}
          </button>
          <button v-if="cards" class="black" @click="reset">Clear current cards</button>
        </div>
      </div>
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
              placeholder="> please paste here"
            />
          </label>
          <button class="dismiss" @click="cards = []">Dismiss</button>
        </div>
      </BasicDialog>
      <div v-if="cards !== null && cards.length">
        <h2>{{ cards.length }} entries.</h2>
        <p v-if="promptIdx === null" class="explanation">
          You need to choose a column to use as your flashcard 'front' side.
        </p>
        <p v-else-if="!isOnlyOneColumn" class="explanation">
          Now that you have selected the 'front', you may also choose which columns to use as your
          flashcard 'back' side. (Without a back side, you can only use standard flash cards.)
        </p>
        <table>
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
