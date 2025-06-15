<script setup lang="ts">
import { computed, ref } from 'vue'
import FlashCards from '@/components/flash/FlashCards.vue'
import DimSumCards from '@/components/flash/DimsumCards.vue'
import { shuffleArray } from '../utils'

const dummyCards = {
  Amsterdam: 'The Netherlands',
  'Kuala Lumpur': 'Malaysia',
  Tehran: 'Iran',
  Beijing: 'China',
  Paris: 'France',
  Lima: 'Peru',
  Rabat: 'Morocco'
}
const cards = ref<string[][] | null>(null)
const error = ref<string>('')
const promptIdx = ref<number | null>(null)
const responseIndices = ref<number[]>([])
const numberOfColumns = computed(() => cards.value?.[0].length ?? 0)
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

  table.yellow {
    width: 100%;
    border-collapse: collapse;
    th {
      height: 6em;
    }
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
    &.dummy-data {
      th {
        height: unset;
      }
    }
  }

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
        width: 50%;
        text-align: center;
        margin-top: 0.5em;
        margin-bottom: 0;
      }
      div {
        flex-grow: 1;
        display: flex;
        button {
          padding-inline: 1em;
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
    p {
      margin: 0.7lh;
    }
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
        color: hsl(60, 86.2%, 82.9%);
        text-shadow: black 0px 0px 3px;
        pointer-events: none;
      }
    }
    textarea {
      color: transparent;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      background-attachment: fixed;
      flex-grow: 1;
      width: 100%;
      height: 100%;
      aspect-ratio: 2/1;
      &:focus {
        background-size: cover;
        background-image: repeating-radial-gradient(
          circle at center center,
          hsla(69, 100%, 90%, 0.5),
          hsla(0, 100%, 90%, 0.5),
          22px,
          transparent 34px,
          transparent 22px
        );
      }
    }
  }
}
</style>

<template>
  <div id="flash-cards-wrapper">
    <div id="flash-cards">
      <DimSumCards
        v-if="isDimsumView && numberOfColumns > 1"
        :cards="cards"
        :promptIdx="promptIdx"
        :responseIndices="responseIndices"
        :isOnlyOneColumn="numberOfColumns === 1"
      ></DimSumCards>
      <FlashCards
        v-else
        :cards="cards"
        :promptIdx="promptIdx"
        :responseIndices="responseIndices"
        :isOnlyOneColumn="numberOfColumns === 1"
      ></FlashCards>
    </div>

    <div id="data-entry-wrapper">
      <div class="top-bar">
        <h1>{{ isDimsumView ? 'Dim Sum cards' : 'Basic flash cards' }}</h1>
        <div>
          <button class="black" @click="isDimsumView = !isDimsumView">
            Switch to {{ isDimsumView ? 'basic flash' : 'dim sum' }} cards
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
        <p>
          Here's an example table. You can try selecting, copying and then pasting this into the box
          above.
        </p>
        <p>
          Avoid copying the header, or you'll get a card with "City" on the front, and "Country" on
          the back.
        </p>
        <table cellpadding="0" class="yellow dummy-data">
          <thead>
            <tr>
              <th>City</th>
              <th>Country</th>
            </tr>
          </thead>
          <tr v-for="[city, country] in Object.entries(dummyCards)" :key="country">
            <td>{{ city }}</td>
            <td>{{ country }}</td>
          </tr>
        </table>
      </div>
      <div class="explanation" v-else-if="promptIdx === null">
        <h2>Step 2</h2>
        <p>You have {{ cards.length }} cards! (And your browser should remember these for you.)</p>
        <p>
          Flashcards usually have two sides. You'll need at least one to get started. You need to
          choose a column to use as your flashcard 'front' side.
        </p>
        <p>(To load different cards, you can hit the "Forget cards" button at the top.)</p>
        <p v-if="!isDimsumView">
          (Since you have selected standard style, when you make your choice, the cards will
          automatically scroll into view.)
        </p>
      </div>
      <div class="explanation" v-else-if="numberOfColumns < 2">
        <h2>Step 3</h2>
        <p>The data you've pasted only has one column, so you can only use standard flash cards.</p>
        <p>(To load different cards, you can hit the "Forget cards" button at the top.)</p>
      </div>
      <div class="explanation" v-else-if="responseIndices.length < 1">
        <h2>Step 3</h2>
        <p>You may also choose which columns to use as your flashcard 'back' side.</p>
        <p>
          A back side is not required for standard flash cards. You can simply look at the fronts of
          these cards and check if you know them.
        </p>
        <p>To use the dimsum cards, you do need to choose at least one 'back' side column.</p>
        <p v-if="isDimsumView">Choose a back column if you want to use dim sum cards.</p>
        <p v-else>
          For basic flash cards, you can use the forward/back buttons to navigate, or use the
          left/right arrow keys on your keyboard.
        </p>
      </div>
      <div class="explanation" v-else-if="isDimsumView">
        <h2>Step 4</h2>
        <p>
          You have selected a back column, which means we can begin with dimsum cards.
          <span v-if="numberOfColumns - 1 > responseIndices.length"
            >(But feel free to add other columns.)</span
          >
        </p>
        <p>
          If you press 'Start' above, the game begins. You'll be shown several flashcards, but only
          some of them will be correct.
        </p>
        <p>
          Click or touch the correct cards before the time runs out. If you select an incorrect
          card, or if you miss a correct card, it'll turn red.
        </p>
        <p>Don't worry about your score. But if it seems too hard, maybe start with fewer cards.</p>
      </div>
      <div class="explanation" v-else>
        <h2>Step 4</h2>
        <p>Your flashcards are ready.</p>
        <p>
          You can use the forward/back buttons to navigate, or use the left/right arrow keys on your
          keyboard.
        </p>
        <p>Hover over the bottom part of the page to reveal the back.</p>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <table cellpadding="0" v-if="cards !== null" class="yellow">
        <thead>
          <tr>
            <th v-for="(column, idx) in cards[0]" :key="column">
              <button
                v-if="idx !== promptIdx && !responseIndices.includes(idx)"
                class="light"
                @click="() => handleColumnSelection(idx)"
              >
                {{ promptIdx === null ? 'Use column for front' : 'Use column for back' }}
              </button>
              <p v-else-if="idx === promptIdx">Front</p>
              <p v-else>Back</p>
            </th>
          </tr>
        </thead>
        <tr v-for="card in cards" :key="card[0]">
          <td v-for="column in card" :key="column">{{ column }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
