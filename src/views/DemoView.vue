<script setup lang="ts">
import SepantaLisa from '@/components/silly/SepantaLisa.vue'
import FLogo from '@/components/silly/F2FLogo.vue'
import DimsumCardVisual from '@/components/flash/DimsumCardVisual.vue'
</script>

<style>
.demo-view {
  height: 400vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  background-color: #4f42c6;

  h1 {
    color: white;
    font-family: 'Montserrat', sans-serif;
    text-transform: uppercase;
  }

  & > div {
    min-height: 70dvh;
    &:nth-of-type(2n) {
      --background-color: #4f42c6;
      background-color: var(--background-color);
      opacity: 0.8;
      background-image:
        linear-gradient(135deg, var(--background-color) 25%, transparent 25%),
        linear-gradient(225deg, var(--background-color) 25%, transparent 25%),
        linear-gradient(45deg, var(--background-color) 25%, transparent 25%),
        linear-gradient(315deg, var(--background-color) 25%, #ffffff55 25%);
      background-position:
        10px 0,
        10px 0,
        0 0,
        0 0;
      background-size: 20px 20px;
      background-repeat: repeat;
    }
  }

  #dimsum-wrapper {
    width: 100%;
    background: unset;
  }
}
</style>

<template>
  <div class="demo-view">
    <h1>Silly things</h1>

    <div :style="{ width: '100%' }">
      <div :style="{ width: '100%', display: 'flex', flexFlow: 'row wrap' }">
        <FLogo />
        <FLogo />
        <FLogo />
      </div>
      <div :style="{ width: '100%', display: 'flex', flexFlow: 'row wrap' }">
        <FLogo />
        <FLogo />
      </div>
      <div :style="{ width: '100%', display: 'flex', flexFlow: 'row wrap' }">
        <FLogo />
      </div>
    </div>

    <div>
      <SepantaLisa />
    </div>

    <div id="dimsum-wrapper">
      <div class="cards">
        <DimsumCardVisual
          front="Example"
          :correct="['w', 's']"
          :back="['Back example']"
          is-correct
          is-clicked
          phase="present-option"
        /><DimsumCardVisual
          front="Example"
          :correct="['w', 's']"
          :back="['Back example']"
          is-correct
          is-clicked
          phase="present-option tail-end"
        /><DimsumCardVisual
          front="Example"
          :correct="['w', 's']"
          :back="['Back example']"
          is-correct
          is-clicked
          phase="reveal-outcome"
        /><DimsumCardVisual
          front="Example"
          :correct="['w', 's']"
          :back="['Back example']"
          is-clicked
          phase="reveal-outcome"
        /><DimsumCardVisual
          front="Example"
          :correct="['w', 's']"
          :back="['Back example']"
          phase="reveal-outcome"
        /><DimsumCardVisual
          :correct="['w', 's']"
          front="Example"
          :back="['Back example , Back example ,Back example Back example']"
          is-clicked
          phase="refractory-phase"
        />
      </div>
    </div>
  </div>
</template>
