<script setup lang="ts"></script>

<template>
  <div class="app-wrapper">
    <nav class="app-navigation">
      <RouterLink to="/tasks">tasks</RouterLink>
      <RouterLink to="/flash" class="hide-on-small-screens">flash</RouterLink>
      <RouterLink to="/laolun">laolun</RouterLink>
      <RouterLink to="/connections">conn</RouterLink>
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
  border-bottom: 0.5px hsl(var(--shadow-color)) solid;
  box-shadow: 0.5px 1px 1px hsl(var(--shadow-color));
  a {
    color: rgb(59, 59, 55);
    font-family: 'Wotfard', sans-serif;
    font-weight: 100;
    text-decoration: none;
    padding: 0.8em;
    text-transform: capitalize;
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
