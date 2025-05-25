import { onMounted, onUnmounted } from 'vue'

/*
 * Very badly named
 */

export function useKeys(handler: (e: KeyboardEvent) => void) {
  onMounted(() => {
    window.addEventListener('keydown', handler)
    window.addEventListener('keyup', handler)
  })
  onUnmounted(() => {
    window.removeEventListener('keydown', handler)
    window.removeEventListener('keyup', handler)
  })
}
