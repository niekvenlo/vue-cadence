<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const box = ref<HTMLDivElement>()
const ts = ref(Date.now())
const isExpanded = ref(false)
const scrollHandler = ref(() => {
  if (Date.now() - ts.value < 30) {
    return
  }
  ts.value = Date.now()
  const scrollFromTop = box.value?.getBoundingClientRect().top ?? 0
  isExpanded.value = scrollFromTop < 80
})

onMounted(() =>
  document.querySelector('.app-page')?.addEventListener('scroll', scrollHandler.value)
)
onUnmounted(() =>
  document.querySelector('.app-page')?.removeEventListener('scroll', scrollHandler.value)
)
</script>

<style>
.demo-view {
  --duration: 0.6s;
  height: 400vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: hsl(269, 100%, 25%);
  h1 {
    font-family: sans-serif;
    font-size: 4em;
    font-weight: bold;
    color: white;
    padding-top: 8em;
  }
  .box {
    position: relative;
    height: 100vmin;
    width: 100vmin;
  }
  .explore,
  .sepanta,
  .lisa,
  .profile {
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
    height: 90vmin;
    transition:
      scale var(--duration) ease-in-out,
      translate var(--duration) ease-in-out,
      height var(--duration),
      width var(--duration),
      opacity var(--duration);
  }
  .explore {
    aspect-ratio: 1/2.1;
    background-image: url('/empty_explore.png');
    will-change: translate scale;
  }
  .sepanta,
  .lisa,
  .profile {
    height: 100%;
    width: 45%;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      max-height: 100%;
      background-size: contain;
      background-position: bottom;
      background-repeat: no-repeat;
      opacity: 0;
      transition: opacity var(--duration);
    }
  }
  .sepanta {
    background-image: url('/Sepanta_noUI.png');
    &::before {
      background-image: url('/Post_UI_Sepanta.png');
    }
  }
  .lisa {
    background-image: url('/Lisa_noUI.png');
    &::before {
      background-image: url('/post_UI_Lisa.png');
    }
  }
  .profile {
    background-image: url('/Lisa_profile.png');
    width: 47%;
  }
  .explore {
    translate: 25vmin 3vmin;
  }
  .sepanta {
    scale: 0.63;
    translate: 19vmin 18vmin;
    height: 70vmin;
    width: 40vmin;
  }
  .lisa {
    height: 71vmin;
    scale: 0.31;
    translate: 38vmin -16vmin;
    width: 44vmin;
  }
  .profile {
    opacity: 0;
    scale: 0.9;
    translate: 22vmin -2vmin;
  }
  .box.isExpanded {
    .explore {
      translate: 53vmin 7vmin;
    }
    .profile {
      opacity: 1;
      scale: 0.9;
      translate: 3vmin -2vmin;
    }
    .sepanta::before,
    .lisa::before {
      opacity: 1;
      transition: opacity var(--duration) var(--duration);
    }
    .sepanta {
      height: 79vmin;
      scale: 1;
      translate: 54vmin 12vmin;
      width: 41vmin;
    }
    .lisa {
      height: 79vmin;
      scale: 1;
      translate: 54vmin 12vmin;
      width: 41vmin;
      &:hover {
        opacity: 0;
      }
    }
  }
}
</style>

<template>
  <div class="demo-view">
    <h1>F2F demo</h1>
    <div class="box" :class="{ isExpanded }" ref="box">
      <div class="profile"></div>
      <div class="explore"></div>
      <div class="sepanta"></div>
      <div class="lisa"></div>
    </div>
  </div>
</template>
