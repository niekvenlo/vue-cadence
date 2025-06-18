<script setup lang="ts"></script>

<style>
@property --progress {
  syntax: '<percentage>';
  initial-value: 10%;
  inherits: true;
}


@property --turn {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: true;
}


#ex-view {
  --sticky-tape-color: 50, 50%, 20%;
  --progress-bar-color: 150, 50%, 90%;
  background: linear-gradient(
    to right,
    hsla(var(--sticky-tape-color), 0.8) 0,
    hsla(var(--sticky-tape-color), 0.8) var(--progress),
    hsla(var(--progress-bar-color), 0.8) var(--progress),
    hsla(var(--progress-bar-color), 0.8) 100%
  );

  transition: --progress 1s;

  &:hover {
      --turn: 180deg;
      --progress: 100%;
    }

  h1 {
    transform: rotate(var(--turn));
    transition: --turn 1s;
    
  }
}
</style>

<template>
  <div id="ex-view">
    <h1>Example</h1>
  </div>
</template>
