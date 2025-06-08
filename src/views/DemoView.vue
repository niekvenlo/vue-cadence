<script setup lang="ts">
// import { ref, watch } from 'vue'
</script>

<style>
.demo-view {
  --duration: 0.5s;
  background: #ede;
  height: 200vh;
  padding-top: 10em;
  display: flex;
  justify-content: center;
  .box {
    position: relative;
    background: #ded;
    height: 85vmin;
    width: 85vmin;
  }
  .explore,
  .sepanta,
  .lisa,
  .profile {
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
    height: 80vmin;
    transition:
      scale var(--duration) var(--duration) ease-in-out,
      translate var(--duration) var(--duration) ease-in-out,
      height var(--duration) var(--duration),
      width var(--duration) var(--duration),
      opacity var(--duration) var(--duration);
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
    translate: 19vmin 16.2vmin;
    height: 60vmin;
  }
  .lisa {
    scale: 0.31;
    translate: 37vmin -14.8vmin;
    height: 65vmin;
  }
  .profile {
    scale: 0.88;
    translate: 25vmin 3vmin;
    opacity: 0;
  }
  .box:hover {
    .lisa {
      scale: 1;
      height: 70vmin;
      width: 36.2vmin;
      translate: 43vmin 10vmin;
      &::before {
        opacity: 1;
      }
    }
  }
  .box:hover {
    .explore {
      translate: 42vmin 5vmin;
    }
    .profile {
      translate: 2vmin -2vmin;
      opacity: 1;
      scale: 0.95;
    }
    .sepanta {
      scale: 1;
      height: 70vmin;
      width: 36.2vmin;
      translate: 43vmin 10vmin;
      &::before {
        opacity: 1;
        transition: opacity var(--duration) var(--duration);
      }
    }
  }
}
</style>

<template>
  <div class="demo-view">
    <div class="box" tabindex="1">
      <div class="profile"></div>
      <div class="explore"></div>
      <div class="sepanta"></div>
      <div class="lisa"></div>
    </div>
  </div>
</template>
