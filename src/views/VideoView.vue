<script setup lang="ts">
import { ref } from 'vue'

const isInitiated = ref(false)
const playersWrapper = ref<HTMLDivElement>()
const isFullscreen = ref(false)

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
const names = ref(['', '', 'Zulu'])

const switchTrack = () => {
  if (!vid1.value || !vid2.value || !vid3.value) return
  index.value = (index.value + 1) % tracks.length
  playerFocusIndex.value = (playerFocusIndex.value + 1) % 3
  const nextPlayerIndex = (playerFocusIndex.value + 1) % 3

  const player = [vid1, vid2, vid3][playerFocusIndex.value].value
  const nextPlayer = [vid1, vid2, vid3][nextPlayerIndex].value
  if (!player || !nextPlayer) {
    return
  }

  const idx = index.value % tracks.length
  const trackName = tracks[idx]
  nextPlayer.src = `/nato/${trackName}.MP4`
  player.play()
  player.muted = false
  player.volume = 1
  names.value[nextPlayerIndex] = trackName
}

const play = () => {
  isInitiated.value = true
  if (!vid1.value || !vid2.value || !vid3.value || !playersWrapper.value) return

  playersWrapper.value.addEventListener(
    'fullscreenchange',
    () => (isFullscreen.value = document.fullscreenElement !== null)
  )
  playersWrapper.value.requestFullscreen()

  setInterval(() => {
    switchTrack()
  }, 2500)
}
</script>

<style>
@keyframes animate1 {
  0% {
    transform: translateX(50%);
    opacity: 1;
  }
  33% {
    transform: translateX(-50%);
    opacity: 0;
  }
  33.2% {
    transform: translateX(250%);
    opacity: 0;
  }
  66% {
    transform: translateX(150%);
    opacity: 1;
  }
  100% {
    transform: translateX(50%);
    opacity: 1;
  }
}
@keyframes animate2 {
  0% {
    transform: translateX(50%);
    opacity: 1;
  }
  33% {
    transform: translateX(-50%);
    opacity: 1;
  }
  66% {
    transform: translateX(-150%);
    opacity: 0;
  }
  66.2% {
    transform: translateX(150%);
    opacity: 0;
  }
  100% {
    transform: translateX(50%);
    opacity: 1;
  }
}
@keyframes animate3 {
  0% {
    transform: translateX(50%);
    opacity: 1;
  }
  33% {
    transform: translateX(-50%);
    opacity: 1;
  }
  66% {
    transform: translateX(-150%);
    opacity: 1;
  }
  99.8% {
    transform: translateX(-250%);
    opacity: 0;
  }
  100% {
    transform: translateX(50%);
    opacity: 0;
  }
}

#video-view {
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: hsl(269, 100%, 25%);
  button.hero {
    aspect-ratio: 1/1;
    background: #ede;
    border: none;
    border-radius: 50%;
    color: hsl(269, 100%, 25%);
    font-family: sans-serif;
    font-size: 3em;
    margin: auto;
    padding: 2em;
    text-transform: uppercase;
    width: 100%;
    max-width: 500px;
  }
  .players-wrapper {
    overflow: hidden;
  }
  .players {
    display: flex;
    align-items: center;
    background-color: hsl(269, 100%, 25%);

    &.isFullscreen {
      width: 300vw;
      height: 100dvh;
      translate: -30%;
    }

    .video-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      position: relative;

      h1 {
        position: absolute;
        bottom: 1em;
        margin: 0;
        color: hsl(269, 100%, 25%);
        text-shadow:
          -2px -2px 2px white,
          2px 2px 2px white,
          2px -2px 2px white,
          -2px 2px 2px white;
      }
      video {
        height: 90dvh;
      }
      &:nth-of-type(1) {
        animation: 7.5s linear 0s infinite animate1;
      }
      &:nth-of-type(2) {
        animation: 7.5s linear 0s infinite animate2;
      }
      &:nth-of-type(3) {
        animation: 7.5s linear 0s infinite animate3;
      }
    }
  }
}
</style>

<template>
  <div id="video-view">
    <button class="hero" v-if="!isInitiated" @click="play">Launch</button>
    <div class="players-wrapper" ref="playersWrapper">
      <div class="players" :class="{ isFullscreen }" v-show="isInitiated">
        <div class="video-block">
          <h1>{{ names[0] }}</h1>
          <video ref="vid1" src="/nato/Xray.MP4?url" playsinline width="1700" />
        </div>
        <div class="video-block">
          <h1>{{ names[1] }}</h1>
          <video ref="vid2" src="/nato/Yankee.MP4?url" playsinline width="1700" />
        </div>
        <div class="video-block">
          <h1>{{ names[2] }}</h1>
          <video ref="vid3" src="/nato/Zulu.MP4?url" playsinline width="1700" />
        </div>
      </div>
    </div>
  </div>
</template>
