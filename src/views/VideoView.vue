<script setup lang="ts">
import { ref } from 'vue'

const isInitiated = ref(false)

const tracks = [
  `Alpha`,
  `Bravo`,
  `Charlie`,
  `Delta`,
  `Echo`,
  `Foxtrot`,
  `Golf`,
  `Hotel`,
  `India`,
  `Juliet`,
  `Kilo`,
  `Lima`,
  `Mike`,
  `November`,
  `Oscar`,
  `Papa`,
  `Quebec`,
  `Romeo`,
  `Sierra`,
  `Tango`,
  `Uniform`,
  `Victor`,
  `Whiskey`,
  `Xray`,
  `Yankee`,
  `Zulu`
]

const index = ref(-1)
const playerFocusIndex = ref(1)

const vid1 = ref<HTMLVideoElement>()
const vid2 = ref<HTMLVideoElement>()
const vid3 = ref<HTMLVideoElement>()
const names = ref(['', '', ''])

const getVideoIdx = () => {
  return index.value % tracks.length
}

const switchTrack = () => {
  if (!vid1.value || !vid2.value || !vid3.value) return
  index.value = (index.value + 1) % tracks.length
  playerFocusIndex.value = (playerFocusIndex.value + 1) % 3

  const player = [vid1, vid2, vid3][playerFocusIndex.value].value
  if (!player) {
    return
  }
  const trackName = tracks[getVideoIdx()]
  player.src = `/nato/${trackName}.MP4`
  player.play()
  player.muted = false
  player.volume = 1
  names.value[playerFocusIndex.value] = trackName
}

const play = () => {
  isInitiated.value = true
  if (!vid1.value || !vid2.value || !vid3.value) return

  setInterval(() => {
    switchTrack()
  }, 3000)
}
</script>

<style>
@keyframes animate1 {
  0% {
    /* pushes the sun down past the viewport */
    transform: translateX(0%);
  }
  33% {
    /* returns the sun to its default position */
    transform: translateX(-100%);
  }
  33.2% {
    /* returns the sun to its default position */
    transform: translateX(200%);
  }
  66% {
    /* returns the sun to its default position */
    transform: translateX(100%);
  }
  100% {
    /* returns the sun to its default position */
    transform: translateX(0%);
  }
}
@keyframes animate2 {
  0% {
    /* returns the sun to its default position */
    transform: translateX(0%);
  }
  33% {
    /* returns the sun to its default position */
    transform: translateX(-100%);
  }
  66% {
    /* returns the sun to its default position */
    transform: translateX(-200%);
  }
  66.2% {
    /* returns the sun to its default position */
    transform: translateX(100%);
  }
  100% {
    /* pushes the sun down past the viewport */
    transform: translateX(0%);
  }
}
@keyframes animate3 {
  0% {
    /* returns the sun to its default position */
    transform: translateX(0%);
  }
  33% {
    /* returns the sun to its default position */
    transform: translateX(-100%);
  }
  66% {
    /* returns the sun to its default position */
    transform: translateX(-200%);
  }
  99.8% {
    /* pushes the sun down past the viewport */
    transform: translateX(-300%);
  }
  100% {
    /* returns the sun to its default position */
    transform: translateX(0%);
  }
}

#video-view {
  button.hero {
    margin: auto;
    font-size: 3em;
    padding: 3em;
    background: #ede;
    border: none;
    margin: 0.1em;
    width: 100%;
  }
  .players {
    display: flex;

    clip-path: polygon(65% 39%, 52% 68%, 61% 99%, 0 100%, 0 0, 50% 0);

    .video-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      background: #def;
      video {
        height: 70dvh;
        aspect-ratio: 1/2;
      }
      &.hasFocus {
        background: #ada;
      }
      &:nth-of-type(1) {
        animation: 9s linear 0s infinite animate1;
      }
      &:nth-of-type(2) {
        animation: 9s linear 0s infinite animate2;
      }
      &:nth-of-type(3) {
        animation: 9s linear 0s infinite animate3;
      }
    }
  }
}
</style>

<template>
  <div id="video-view">
    <button class="hero" v-if="!isInitiated" @click="play">Start show</button>
    <div class="players" v-show="isInitiated">
      <div class="video-block" :class="{ hasFocus: playerFocusIndex % 3 === 0 }">
        <h1>{{ names[0] }}</h1>
        <video ref="vid1" src="/rr/1 - A Hamilton for the Museum.mp3" />
      </div>
      <div class="video-block" :class="{ hasFocus: playerFocusIndex % 3 === 1 }">
        <h1>{{ names[1] }}</h1>
        <video ref="vid2" src="/rr/1 - A Hamilton for the Museum.mp3" />
      </div>
      <div class="video-block" :class="{ hasFocus: playerFocusIndex % 3 === 2 }">
        <h1>{{ names[2] }}</h1>
        <video ref="vid3" src="/rr/1 - A Hamilton for the Museum.mp3" />
      </div>
    </div>
  </div>
</template>
