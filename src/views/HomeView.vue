<script setup lang="ts"></script>

<style>
.home-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: linear-gradient(to right, red, transparent),
    linear-gradient(to bottom, transparent, blue),
    radial-gradient(circle at center, transparent, transparent 30%, #000 40%, transparent 40%);
  h1 {
    font-family: sans-serif;
    font-size: 4em;
    font-weight: bold;
    color: white;
    padding: 0.5em;
  }
}
</style>

<template>
  <div class="home-view">
    <h1>粉罗 Home</h1>
  </div>
</template>
