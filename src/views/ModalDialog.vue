<script setup lang="ts">
import BasicDialog from '@/components/BasicDialog.vue'
const props = defineProps<{
  isOpen: boolean
  title: string
}>()
</script>

<style>
.edit-dialog {
  box-shadow: var(--shadow-elevation-high);

  transition: min-width 0.2s;
  min-width: 400px;
  @media screen and (max-width: 500px) {
    min-width: 100%;
  }
  min-height: 15ch;
}
::backdrop {
  background-image: linear-gradient(100deg, black, white, black);
  opacity: 0.3;
}
.modal-close-x {
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
    transition-delay: 0.1s;
    background-color: hsl(var(--shadow-color));
    color: white;
  }
  height: 2em;
  aspect-ratio: 1/1;
  svg {
    transform: translateY(-0.15em);
    margin: 0.2em;
  }
}
.modal-title {
  padding-left: 1em;
  padding-right: 2em;
  padding-top: 0.5em;
  font-size: 1.1em;
  font-weight: 100;
  color: hsl(var(--dark-shadow-color));
}
.modal-contents {
  padding: 2em 2em 2em 2em;
  width: 100%;
  justify-content: center;
  display: flex;
}
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 1em;
  width: 100%;
  background: hsl(var(--light-color));
  padding-top: 1em;
  padding-bottom: 0.5em;
  button {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    border-width: 0;
    color: #333333;
    cursor: pointer;
    display: inline-block;
    font-family: 'Haas Grot Text R Web', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.9em;
    font-weight: 500;
    line-height: 20px;
    list-style: none;
    margin: 0;
    padding: 10px 12px;
    text-align: center;
    transition: all 200ms;
    vertical-align: baseline;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>

<template>
  <BasicDialog :title="props.title" :isOpen="isOpen" class="edit-dialog">
    <form method="dialog">
      <button class="modal-close-x">
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
    <div class="modal-title">{{ props.title }}</div>
    <div class="modal-contents"><slot name="default"></slot></div>
    <div class="modal-buttons"><slot name="buttons"></slot></div>
  </BasicDialog>
</template>
