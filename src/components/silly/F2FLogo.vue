<script setup lang="ts"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Dongle');
.f2flogo {
  --duration: 0.6s;
  flex: 1;
  display: flex;
  flex-direction: row;
  .container {
    display: flex;
    margin: 0.5em;
    width: 100%;
    align-items: center;
    justify-content: safe center;
    container-type: inline-size;
    span {
      color: white;
      font-size: 5em;
      font-family: 'Dongle', sans-serif;
      font-weight: 700;
      transition:
        translate var(--duration),
        rotate var(--duration),
        opacity var(--duration),
        scale var(--duration),
        font-size var(--duration);
      &:nth-of-type(2) {
        opacity: 0.95;
        rotate: 0turn;
      }
      &:nth-of-type(4) {
        opacity: 1;
      }
      @container (max-width: 310px) {
        &:nth-of-type(2) {
          rotate: 0.01turn;
          translate: 0em 0.05em;
          opacity: 0.8;
        }
        &:nth-of-type(4) {
          opacity: 0;
        }
      }
      @container (max-width: 150px) {
        &:nth-of-type(2) {
          rotate: 0.25turn;
          translate: -0.4em 0em;
          opacity: 0;
          scale: 0.5;
        }
        &:nth-of-type(3) {
          rotate: 0.5turn;
          translate: -0.5em 0em;
        }
      }
      @container (max-width: 100px) {
        font-size: 4em;
      }
    }
  }
}
</style>

<template>
  <div class="f2flogo">
    <div class="container">
      <span>F</span>
      <span>2</span>
      <span>F</span>
      <span>.COM</span>
      <!-- <img src="/large.jpg" class="large" />
        <img src="/compact.jpg" class="compact" /> -->
    </div>
  </div>
</template>
