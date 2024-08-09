<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from 'src/server/db-access.ts'

const tasks = ref<undefined | Task[]>(undefined)

fetch('http://192.168.2.8:3333/api/v1/getTasks', {})
  .then((response) => response.json())
  .then((json) => {
    tasks.value = json
  })
</script>

<template>
  <li :key="item.id" v-for="item in tasks">
    {{ item.title }}
  </li>
</template>

<style scoped></style>
