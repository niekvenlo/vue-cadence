<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from 'vue'
const props = defineProps<{
  isOpen: boolean
}>()
const dialog = useTemplateRef('dialog')

const handleModalOpenness = () => {
  if (props.isOpen) {
    dialog.value?.showModal()
  }
}

onMounted(handleModalOpenness)
watch(props, handleModalOpenness)
const emit = defineEmits(['did-close'])
</script>

<style>
dialog {
  top: 40%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  min-width: 30ch;
  min-height: 20ch;
  border: none;
  box-shadow: var(--shadow-elevation-high);
  font-family: sans-serif;
}
::backdrop {
  /* background-image: linear-gradient(45deg, rgb(255, 150, 30), rgb(70, 128, 0)); */
  opacity: 0.75;
}

.x {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  background: unset;
  outline: none;
  background-color: transparent;
  transition: all 0.5s;
  &:active,
  &:focus,
  &:hover {
    transition-delay: 0.5s;
    background-color: red;
    color: white;
  }
  height: 3ch;
  width: 3ch;
  svg {
    transform: translateY(-0.1em);
  }
}
</style>

<template>
  <dialog ref="dialog" @close="emit('did-close')" closedby="any">
    <form method="dialog">
      <button class="x">
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path
            fill="currentColor"
            d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z"
          ></path>
        </svg>
      </button>
    </form>
    <slot></slot>
  </dialog>
</template>
