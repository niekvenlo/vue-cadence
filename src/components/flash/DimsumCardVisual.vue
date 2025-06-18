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
      --sticky-tape-color: 170, 100%, 95%;
      --progress-bar-color: 194, 71%, 57%;
      --horizontal-rule-background: repeating-linear-gradient(
          0deg,
          var(--blue-line-color),
          var(--blue-line-color) 1px,
          transparent 1px,
          transparent
        )
        center / 20px 20px;
      --vertical-margin-rule-background: linear-gradient(
        90deg,
        transparent 20%,
        var(--red-line-color) 20.2%,
        transparent 20%
      );
      --neutral-background: linear-gradient(
        to left,
        var(--neutral-card-color),
        var(--neutral-card-color)
      );
      --sticky-tape-color-background: linear-gradient(
        to left,
        hsla(var(--sticky-tape-color), 0.2),
        hsla(var(--sticky-tape-color), 0.2)
      );
      --ruled-background: var(--horizontal-rule-background), var(--vertical-margin-rule-background),
        var(--sticky-tape-color-background), var(--neutral-background);

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

      .sticky-tape {
        position: relative;
        height: 3em;
        .in-front,
        .behind {
          position: absolute;
          top: 0;
          left: 0;
          width: 20ch;
          height: 100%;
          translate: -50%;

          display: flex;
          flex-direction: column;
          justify-content: center;

          box-shadow: var(--low-shadow);
          font-size: 70%;
          line-height: 80%;
          min-height: 4em;
          padding: 0.2em 2em;

          span:nth-of-type(2n) {
            font-style: italic;
          }
          &:empty {
            opacity: 0.1;
          }
        }
        .behind {
          background-color: hsla(119, 71%, 57%, 0.8);
          opacity: 0;
        }
        .in-front {
          /* background-color: hsla(var(--sticky-tape-color), 0.8); */
          --progress: 0%;
          background: linear-gradient(
              to right,
              hsla(var(--progress-bar-color), 0.8) 0%,
              hsla(194, 71%, 57%, 0.8) var(--progress),
              hsla(var(--sticky-tape-color), 0.8) var(--progress),
              hsla(var(--sticky-tape-color), 0.8) 100%
            );
        }
      }

      /* Different phases */
      &.init {
        scale: 0.95;
      }
      &.present-option {
        cursor: pointer;
        &:hover {
          transform: translateY(-1px);
          box-shadow: var(--high-shadow);
        }
        &.tail-end {
          .sticky-tape .in-front {
            --progress: 50%;
          }
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
            transition: transform 1s ease-in;
            transform: translateY(3px) rotate(-2deg);
          }
        }
        &.isClicked:not(.isCorrect) {
          .sticky-tape {
            .behind {
              opacity: 1;
            }
            .in-front {
              transition: transform 1s ease-in;
              transform: translateX(-4px) translateY(50px) rotate(4deg);
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
    }
  }
}
</style>

<template>
  <button class="card" :class="[phase, props]">
    <div class="header">{{ front }}</div>
    <div class="sticky-tape">
      <div class="behind">
        <span v-for="line in correct ?? []" :key="line">{{ line }}</span>
      </div>
      <div class="in-front">
        <span v-for="line in back ?? []" :key="line">{{ line }}</span>
      </div>
    </div>
  </button>
</template>
