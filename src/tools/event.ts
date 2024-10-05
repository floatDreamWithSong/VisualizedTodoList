import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target:any, event:string, callback:Function) {
  // 如果你想的话，
  // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
export const createCustomEvent = (eventName: string, detail?:any)=>{
  const event = new CustomEvent(eventName, {
    bubbles: true,    // 事件是否冒泡
    cancelable: true, // 事件是否可以取消
  });
  return event;
}
export const dispatchCustomEvent = (element: HTMLElement, eventName: string, detail:any) => {
  const event = createCustomEvent(eventName, detail);
  element.dispatchEvent(event);
}