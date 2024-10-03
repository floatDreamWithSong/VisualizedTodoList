import { ref} from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {

  const queryDarkMode = () => {
    const lastModifiedRes = window.localStorage.getItem('isDarkMode')
    if (lastModifiedRes === undefined) {
      const queryRes = window.matchMedia('(prefers-color-scheme: dark)').matches
      window.localStorage.setItem('isDarkMode', queryRes + '')
      return queryRes
    }
    return lastModifiedRes === 'true';
  }
  const isDarkMode = ref<boolean>(queryDarkMode())
  const switchMode = () => {
    isDarkMode.value = !isDarkMode.value
    window.localStorage.setItem('isDarkMode', isDarkMode.value+'')
  }
  return { switchMode, isDarkMode }
})
