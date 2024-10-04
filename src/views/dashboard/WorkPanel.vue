<script setup lang="ts">
import {useCounterStore} from '@/stores/counter';
import {useTodayStore} from '@/stores/today';
import {useMouse} from '@/tools/mouse';
import {onBeforeMount, onBeforeUnmount, onMounted, ref} from 'vue';
import { useEventListener } from '../../tools/event';

const canvas = ref<HTMLCanvasElement>();
let canvasWidth = 0,canvasHeight = 0,canvasRootHeight=0;
let ctx: CanvasRenderingContext2D;
const mousePositionX = ref(0);
const mousePositionY = ref(0);
let last = 0;
function handleMouseMove(event: MouseEvent) {
  const cur = new Date().getTime();
  const der = cur - last;
  if (der < 16) {
    return
  }
  last = cur;
  const rect = (canvas.value as HTMLCanvasElement).getBoundingClientRect();
  mousePositionX.value = (event.clientX - rect.left)*2 // 鼠标相对于元素左边的偏移
  mousePositionY.value = (event.clientY - rect.top)*2
  
}

let previousTimeStamp: number= 0;
function startCanvas(){
  const ratio = 2;
  const _canvas = canvas.value as HTMLCanvasElement;
  _canvas.width =  (_canvas.parentElement as HTMLElement).offsetWidth * ratio;
  canvasWidth = _canvas.width;
  _canvas.height = _canvas.width/4;
  canvasHeight = _canvas.height
  _canvas.addEventListener('wheel',function(e:WheelEvent){
    e.preventDefault()
    canvasRootHeight+=e.deltaY*0.15
  })
  _canvas.style.width = canvasWidth/ratio + 'px', _canvas.style.height = canvasHeight/ratio + 'px'
  ctx = (canvas.value?.getContext('2d')) as  CanvasRenderingContext2D;
  ctx.scale(1,1)
  window.requestAnimationFrame(loop)
}
function getRelativeTime(milscs:number){
  const hour = Math.floor(milscs / 3600000);
  milscs -= hour * 3600000;
  const min = Math.floor(milscs/60000);
  milscs -= min*60000;
  const s = Math.floor(milscs / 1000);
  return {
    h:hour,
    m:min,
    s:s
  }
}
function loop(timestamp: number) {
  if (timestamp-previousTimeStamp > 16) {
    Draw()
    previousTimeStamp = timestamp;
  }
  
  window.requestAnimationFrame(loop);
}
function Draw(){
  ctx.clearRect(0,0,canvasWidth,canvasHeight)
  drawBackGround(ctx);
  ctx.fillStyle = 'red'
  ctx.fillRect(mousePositionX.value,0,1,canvasHeight)
  ctx.font = '28px sans-serif'
  const t = getRelativeTime((mousePositionX.value/canvasWidth)*3600000*24)
  ctx.fillText(`${t.h}:${t.m}:${t.s}`,mousePositionX.value,mousePositionY.value)
  ctx.fillStyle = '#007755'
  ctx.fillRect(timePosition.value * canvasWidth,0,1,canvasHeight)
  drawTransaction(ctx);
}

function drawBackGround(ctx:CanvasRenderingContext2D){
  const div = canvasWidth/24;
  ctx.fillStyle = 'gray'
  ctx.font = '24px sans-serif'
  for(let i=0;i<24;i++){
    const w = div*i
    ctx.fillRect(w,0,1,canvasHeight)
    ctx.fillText(`${i}h`,w,canvasHeight)
  }
}
function drawTransaction(ctx:CanvasRenderingContext2D){
  ctx.font = `28px sans-serif`
  let t =[-1]
  todayData.forEach((i,id)=>{

  let row = 0
  let resolved = false;
    ctx.fillStyle = i.bgColor
    const h = 40
    const rx= i.getRelativeData().start*canvasWidth,w = i.getRelativeData().length*canvasWidth
    const ed = rx+w;
    console.log(i,':',t,rx,ed)
    for(let i=0;i<t.length;i++){
      if(t[i]<rx){
        t[i] = ed;
        row = i
        console.log(id,t[i],rx)
        resolved = true
        break;
      }
    }
    console.log(resolved)
    if(!resolved){
      console.log(row);
      row = t.length;
      t.push(ed);
    }
    const ry = row*h+canvasRootHeight+row
    if(i.getRelativeData().start< timePosition.value && i.getRelativeData().end > timePosition.value){
      ctx.fillStyle = '#007755'
    }else if(rx<mousePositionX.value && rx+w>mousePositionX.value){
      ctx.fillStyle = 'red'
    }
    ctx.fillRect(rx,ry,w,h);
    ctx.fillStyle = i.color
    ctx.fillText(i.content,rx,ry+h*0.7,w)
  })
}
const timePosition = ref(0)
let timeRel = 0
function timeCursor() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const _d = startOfDay.getTime()
  const d = new Date().getTime();
  timeRel = d - _d;
  timePosition.value = timeRel / (24 * 3600000)
}

const a = setInterval(timeCursor, 1000);
onMounted(() => {
  startCanvas()
})
onBeforeUnmount(() => {
  clearInterval(a);
})
const todayData = useTodayStore().todayData
const theme = useCounterStore()
const checked = ref('today')
const isOptionPanelOpen = ref(false)
const sectionList = [{
  text: 'today'
}, {
  text: 'this week'
}, {
  text: 'this month'
}, {
  text: 'this year'
}]
</script>
<template>
  <div class="w-full h-full p-2  rounded-lg shadow-md overflow-y-scroll flex-col"
       :class="(theme.isDarkMode?'text-slate-200 bg-black/15':'text-slate-800 bg-white/25')">
    <div id="tool-bar">
      <div id="select-container"
           class="relative text-center cursor-pointer w-32 border-1 border-slate-200 rounded-lg transition duration-300 ease hover:border-slate-400 shadow-sm"
           :class="(theme.isDarkMode?'bg-white/5 text-slate-200':'bg-white/40 text-slate-700')+' '+(isOptionPanelOpen?'rounded-t-lg rounded-b-none':'rounded-lg')">
        <div id="time-section"
             @click="(isOptionPanelOpen = !isOptionPanelOpen)"
             class="p-1.5 pl-2 text-center bg-transparent ">
          {{ checked }}
          <i class="bi-caret-down-fill p-1"></i>
        </div>
        <ul v-show="isOptionPanelOpen" class="absolute w-full rounded-b-lg backdrop-blur-lg z-20"
            :class="theme.isDarkMode?'bg-white/5 text-slate-200':'bg-white/40 text-slate-700'">
          <li v-for="(i,id) in sectionList.filter(item=>item.text!=checked) "
              class="py-0.5 px-1.5 w-full  rounded-sm custom-slidein transition-all"
              :class="theme.isDarkMode?'hover:bg-white/20':'hover:bg-slate-400/40'"
              :style="{animationDelay:`${id*0.1}s`}"
              :key="i.text"
              @click.stop="(checked=i.text ), (isOptionPanelOpen = !isOptionPanelOpen)"
          >{{ i.text }}
          </li>
        </ul>
      </div>
    </div>


    <div id="canvas-box" class=" shadow-sm w-full p-2 mt-4 rounded-lg">
      <canvas @mousemove="handleMouseMove" class="bg-transparent" id="canvas" ref="canvas">Your device is not support canvas</canvas>
    </div>
    <div class="w-full bg-black h-full flex-1">

    </div>
  </div>
</template>
<style scoped>
.custom-slidein {
  animation: cs-slidein ease-in-out .25s forwards;
  transform: translateX(20px);
  opacity: 0;
}

@keyframes cs-slidein {
  0% {
    transform: translateX(20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
