import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
  const switchMode = ()=>{
    isDarkMode.value = !isDarkMode.value;
  }
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { switchMode, isDarkMode }
})
