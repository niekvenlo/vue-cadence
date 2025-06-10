<script setup lang="ts">
import { ref } from 'vue'

const root = import.meta.env.VITE_SERVER_ROOT

const isAuthorised = ref(true)
const tokenName = ref('')
const errors = ref<Map<string, any>>(new Map())

const handleError = (err: any) => {
  const name = err.error || err.message
  clearTimeout(errors.value.get(name)?.timerId)
  const timerId = setTimeout(() => errors.value.delete(name), 3000)
  errors.value.set(name, { ...err, timerId })
  if (name === `Not recognised`) {
    isAuthorised.value = false
  }
}

const requestToken = () =>
  fetch(`${root}/api/v2/tokens?pw=${tokenName.value}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json.error)
      isAuthorised.value = !json.error
    })
    .catch((err) => {
      handleError(err)
    })

requestToken()
</script>

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

.unauthorised {
  background: orange;
  height: 100vh;
  div {
    flex-grow: 1;
    height: 70vh;
    display: flex;
    flex-direction: column;
    gap: 1em;
    justify-content: center;
    align-items: center;
    input {
      font-size: 4em;
      text-align: center;
      border: none;
      background-color: transparent;
      outline: none;
    }
  }
}

.app-page {
  flex-grow: 1;
  overflow: scroll;
}

.errors {
  display: flex;
  flex-direction: column;
  p {
    padding: 1em;
    background-image: linear-gradient(to bottom right, hsl(0, 61%, 36%), hsl(0, 61%, 30%));
    color: white;
    font-weight: 500;
  }
}
</style>

<template>
  <div class="unauthorised" v-if="!isAuthorised && $route.fullPath !== '/flash'">
    <div>
      <h1>Who are you?</h1>
      <input type="text" v-model="tokenName" />
      <button class="black" @click="requestToken">I'm cool</button>
    </div>
  </div>
  <div class="app-wrapper" v-else>
    <nav class="app-navigation" v-if="isAuthorised">
      <RouterLink to="/tasks">任务</RouterLink>
      <RouterLink to="/flash" @click="isAuthorised = true" class="hide-on-small-screens"
        >卡</RouterLink
      >
      <RouterLink to="/laolun">劳伦</RouterLink>
      <RouterLink to="/demo">示范</RouterLink>
      <RouterLink to="/connections">连接</RouterLink>
    </nav>
    <div class="app-page">
      <RouterView @error="handleError" />
    </div>
    <div class="errors" v-if="[...errors.keys()].length">
      <p v-for="message in errors.keys()" :key="message">
        {{ message }}
      </p>
    </div>
  </div>
</template>
