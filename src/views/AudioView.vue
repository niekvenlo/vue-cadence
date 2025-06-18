<script setup lang="ts">
import { ref } from 'vue'

const isInitiated = ref(false)

const tracks = [
  `/rr/1 - A Hamilton for the Museum.mp3`,
  `/rr/2 - Rocks Rock!.mp3`,
  `/rr/3 - Racism Doesn't Rock.mp3`,
  `/rr/4 - A Spirited Debate.mp3`,
  `/rr/5 - The Rock Cycle.mp3`,
  `/rr/6 - Time for Bed.mp3`,
  `/rr/7 - Cummingtonite.mp3`
]

const aud1 = ref<HTMLAudioElement>()
const name = ref('')

const switchToRandomTrack = () => {
  if (!aud1.value) return
  aud1.value.pause()
  if (Math.random() < 0.3) return
  const randomTrack = tracks[Math.floor(Math.random() * tracks.length)]
  aud1.value.src = randomTrack
  name.value = randomTrack
  aud1.value.currentTime = Math.floor(Math.random() * 40)
  aud1.value.play()

  aud1.value.muted = false
  aud1.value.volume = 1
}

const play = () => {
  isInitiated.value = true
  if (!aud1.value) return
  aud1.value.play()
  aud1.value.muted = true
  aud1.value.volume = 0

  setInterval(() => {
    switchToRandomTrack()
  }, 5000)
}
</script>

<style>
#audio-view {
  button.hero {
    margin: auto;
    font-size: 3em;
    padding: 3em;
  }
  .audio-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 150dvh;
    background: #def;
    &:nth-of-type(2n) {
      background: #ede;
    }
  }
}
</style>

<template>
  <div id="audio-view">
    <button class="hero" v-if="!isInitiated" @click="play">Start show</button>
    <div v-show="isInitiated">
      <div class="audio-block">
        <h1>{{ name }}</h1>
        <audio ref="aud1" src="/rr/1 - A Hamilton for the Museum.mp3" controls />
      </div>
    </div>
  </div>
</template>
