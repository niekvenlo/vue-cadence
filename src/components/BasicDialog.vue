<script setup lang="ts">
import { onMounted, onBeforeUpdate, ref } from 'vue'
const props = defineProps<{
  isOpen: boolean
  class?: string
}>()
const emit = defineEmits<{
  (e: 'did-close'): void
}>()

const handleModalOpenness = () => {
  const modal = dialog.value!
  if (props.isOpen) {
    modal.showModal()
  } else {
    modal.close()
  }
}

onMounted(handleModalOpenness)
onBeforeUpdate(handleModalOpenness)

const dialog = ref<HTMLDialogElement>()
</script>

<style>
dialog {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  border: none;
  padding: 0;
  --delay: 0.4s;
  transition:
    transform var(--delay) ease-out,
    display var(--delay) allow-discrete,
    overlay var(--delay) allow-discrete,
    opacity var(--delay);
  opacity: 0;

  &[open] {
    transform: translateX(-50%) translateY(-50%);
    opacity: 1;

    @starting-style {
      opacity: 0;
      transform: translateX(-50%) translateY(-30%);
      @media (prefers-reduced-motion: reduce) {
        transform: translateX(-50%) translateY(-50%);
      }
    }
  }
  @media (max-width: 400px) {
    & {
      padding-top: 3em;
      top: 100%;
    }
    &[open] {
      transform: translateX(-50%) translateY(-100%);
    }
  }
}
::backdrop {
  background: red;
  opacity: 0.3;
}
</style>

<template>
  <dialog :class="props.class" ref="dialog" @close="emit('did-close')" closedby="any">
    <slot>
      <form method="dialog">
        <button>Close</button>
      </form>
    </slot>
  </dialog>
</template>
