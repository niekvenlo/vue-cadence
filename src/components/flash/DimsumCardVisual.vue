<script setup lang="ts">
// import { onBeforeUnmount, ref, unref, watch } from 'vue'
// import type { MaybeRef } from 'vue'

const props = defineProps<{
  back: string[]
  correct: string[]
  front: string
  isClicked?: boolean
  isCorrect?: boolean
  isPaused?: boolean
  phase: string
}>()
</script>

<style>
#dimsum-wrapper {
  background: white;
  .cards {
    flex-grow: 1;
    margin: auto;
    height: 80dvmin;
    width: 80dvmin;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 1em;
    padding: 1em;
    transition:
      scale 0.3s,
      filter 0.3s;

    button.card {
      --blue-line-color: hsla(222, 63%, 77%, 0.9);
      --red-line-color: hsla(10, 63%, 77%, 0.9);
      --neutral-card-color: hsl(60, 86.2%, 90%);
      --ruled-background: repeating-linear-gradient(
            0deg,
            var(--blue-line-color),
            var(--blue-line-color) 1px,
            transparent 1px,
            transparent
          )
          center / 20px 20px,
        linear-gradient(90deg, transparent 20%, var(--red-line-color) 20.2%, transparent 20%),
        linear-gradient(to left, hsla(var(--sticky-tape-color), 0.2), var(--neutral-card-color)),
        linear-gradient(to left, var(--neutral-card-color));

      --high-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075), 0 2px 2px hsl(0deg 0% 0% / 0.075),
        0 4px 4px hsl(0deg 0% 0% / 0.075), 0 8px 8px hsl(0deg 0% 0% / 0.075),
        0 16px 16px hsl(0deg 0% 0% / 0.075);
      --medium-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075), 0 2px 2px hsl(0deg 0% 0% / 0.075),
        0 4px 4px hsl(0deg 0% 0% / 0.075), 0 8px 8px hsl(0deg 0% 0% / 0.075);
      --low-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075), 0 2px 2px hsl(0deg 0% 0% / 0.075);

      display: flex;
      aspect-ratio: 5/3;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      background: var(--ruled-background);
      --sticky-tape-color: 170, 100%, 95%;
      border: none;
      box-shadow: var(--medium-shadow);
      cursor: default;
      color: currentColor;
      padding: 0.5em;
      font-family: sans-serif;
      font-size: 1.7em;
      font-weight: 400;
      will-change: transform;
      position: relative;
      transform-origin: center;
      transition:
        rotate 0.5s,
        scale 0.5s;
      &.init {
        scale: 0.95;
      }
      &.present-option {
        cursor: pointer;
        &:hover {
          transform: translateY(-1px);
          box-shadow: var(--high-shadow);
        }
        &::after {
          background-color: transparent;
          transition: background-color 1s;
          content: '';
          position: absolute;
          pointer-events: none;
          width: 100%;
          height: 100%;
        }

        &.tail-end::after {
          background-color: rgba(0, 204, 255, 0.3);
        }
      }
      &.reveal-outcome,
      &.refractory-phase,
      &.invisible-phase {
        transition:
          background-color 0.1s ease-in-out,
          transform 0.1s ease-in-out,
          translateY 0.1s ease-in-out,
          opacity 1s ease-in-out;
        box-shadow: var(--low-shadow);

        /* Hit */
        &.isCorrect.isClicked {
          --sticky-tape-color: 119, 71%, 57%;
        }

        /* Miss */
        &.isClicked:not(.isCorrect),
        &.isCorrect:not(.isClicked) {
          --sticky-tape-color: 7, 71%, 57%;
          .sticky-tape {
            position: relative;
            transform: translateY(-3px) rotate(-2deg);
          }
        }
        &.isClicked:not(.isCorrect) {
          .sticky-tape {
            transition: transform 1s ease-in;
            transform: translateY(50px) rotate(2deg);
            &::before {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              content: attr(data-correct);
              opacity: 1;
              font-size: 0.8em;
              transform: translateY(-50px) rotate(-2deg);
            }
          }
        }
      }
      &.refractory-phase {
        opacity: 0.2;
      }
      &.invisible-phase {
        opacity: 0;
      }
      .header {
        font-size: 1.1em;
        text-shadow:
          -2px -2px 2px var(--neutral-card-color),
          2px 2px 2px var(--neutral-card-color),
          2px -2px 2px var(--neutral-card-color),
          -2px 2px 2px var(--neutral-card-color);
      }
      .sticky-tape {
        background-color: hsla(var(--sticky-tape-color), 0.8);
        font-size: 70%;
        line-height: 80%;
        min-height: 4em;
        padding: 0.2em 2em;

        display: flex;
        flex-direction: column;
        justify-content: center;

        span:nth-of-type(2n) {
          font-style: italic;
        }
        box-shadow: var(--low-shadow);
        &:empty {
          opacity: 0.1;
        }
        &::before {
          color: transparent;
          opacity: 0;

          display: flex;
          align-items: center;
          justify-content: center;
          color: rgb(27, 94, 27);

          transition:
            color 0.1s,
            opacity 10s;
        }
      }
    }
  }
}
</style>

<template>
  <button class="card" :class="[phase, props]">
    <div class="header">{{ front }}</div>
    <div class="sticky-tape" :data-correct="isCorrect ? null : correct.join(',')">
      <span v-for="line in back ?? []" :key="line">{{ line }}</span>
    </div>
  </button>
</template>
