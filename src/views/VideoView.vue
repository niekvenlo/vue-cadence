<script setup lang="ts">
import { computed, ref } from 'vue'

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

const vid1 = ref<HTMLVideoElement>()

const name = computed(() => tracks[index.value])

const switchToRandomTrack = () => {
  if (!vid1.value) return
  index.value++
  if (index.value >= tracks.length) {
    index.value = 0
  }
  vid1.value.src = `/nato/${tracks[index.value]}.MP4`
  vid1.value.play()

  vid1.value.muted = false
  vid1.value.volume = 1
}

const play = () => {
  isInitiated.value = true
  if (!vid1.value) return
  vid1.value.play()
  vid1.value.muted = true
  vid1.value.volume = 0

  setInterval(() => {
    switchToRandomTrack()
  }, 2000)
}
</script>

<style>
#video-view {
  button.hero {
    margin: auto;
    font-size: 3em;
    padding: 3em;
    background: #ede;
    border: none;
    margin: 0.1em;
  }
  .video-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: #def;
    video {
      height: 70dvh;
    }
  }
}
</style>

<template>
  <div id="video-view">
    <button class="hero" v-if="!isInitiated" @click="play">Start show</button>
    <div v-show="isInitiated">
      <div class="video-block">
        <h1>{{ name }}</h1>
        <video ref="vid1" src="/rr/1 - A Hamilton for the Museum.mp3" controls />
      </div>
    </div>
  </div>
</template>
