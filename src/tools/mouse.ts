import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse(target:any) {
  const x = ref(0)
  const y = ref(0)

  useEventListener(target, 'mousemove', (event:MouseEvent) => {
    x.value = event.offsetX
    y.value = event.offsetY
    console.log(x.value, y.value)
  })

  return { x }
}