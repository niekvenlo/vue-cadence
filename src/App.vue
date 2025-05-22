<script setup lang="ts"></script>

<template>
  <div class="app-wrapper">
    <nav class="app-navigation">
      <RouterLink to="/">Cadence</RouterLink>
      <RouterLink to="/tasks">Tasks</RouterLink>
      <RouterLink to="/laolun">Laolun</RouterLink>
      <RouterLink to="/laolun/tones">Tones</RouterLink>
    </nav>
    <div class="app-page">
      <RouterView />
    </div>
  </div>
</template>

<style>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
}
.app-navigation {
  min-height: 4em;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-bottom: 0.5px hsl(220deg 60% 50% / 0.7) solid;
  box-shadow: 0.5px 1px 1px hsl(220deg 60% 50% / 0.7);
  a {
    color: rgb(59, 59, 55);
    font-family: 'Wotfard', sans-serif;
    font-weight: 100;
    text-decoration: none;
    padding: 0.8em;
    &.router-link-active {
      transition: transform 0.1s;
      font-family: Georgia, sans-serif;
      color: black;
      background: unset;
      text-decoration: none;
      font-weight: 700;
      transform: scale(1.5);
      cursor: default;
      text-transform: uppercase;
    }
  }
}

.app-page {
  flex-grow: 1;
  overflow: scroll;
}
</style>
