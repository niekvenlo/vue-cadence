<script setup lang="ts">
const onChromebook = import.meta.env.VITE_SERVER_ROOT !== undefined
</script>

<template>
  <nav class="app-navigation">
    <RouterLink to="/">Cadence</RouterLink>
    <p v-if="onChromebook">on chromebook</p>
    <RouterLink to="/laolun">Laolun</RouterLink>
  </nav>
  <RouterView />
</template>

<style>
.app-navigation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  a {
    color: rgb(255, 0, 200);
    font-family: monospace;
    font-weight: 100;
    &.router-link-active {
      color: black;
      text-decoration: none;
      font-weight: 700;
    }
  }
}
</style>
