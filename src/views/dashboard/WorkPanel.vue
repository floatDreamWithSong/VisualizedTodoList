<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import { useTodayStore } from '@/stores/today';
import { useMouse } from '@/tools/mouse';
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
const canvas = ref();
const mousePosition = ref({ x: 0});
let last = 0;
function handleMouseMove(event:MouseEvent) {
    const cur = new Date().getTime();
    const der = cur - last;
    if(der<16){
        return
    }
    last = cur;
  const rect = canvas.value.getBoundingClientRect();
  mousePosition.value = {
    x: event.clientX - rect.left, // 鼠标相对于元素左边的偏移
  };
}
const timePosition = ref(0)
function timeCursor(){
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const _d = startOfDay.getTime()
    const d = new Date().getTime();
    timePosition.value = (d-_d)/(24*36000)
}
const a = setInterval(timeCursor,1000);
onBeforeUnmount(()=>{
    clearInterval(a);
})
const todayData = useTodayStore().todayData
const theme = useCounterStore()
const checked = ref('today')
const isOptionPanelOpen = ref(false)
const sectionList = [{
    text:'today'
},{
    text:'this week'
},{
    text:'this month'
},{
    text:'this year'
}]
</script>
<template>
<div class="w-full h-full p-2  rounded-lg shadow-md overflow-y-scroll" :class="(theme.isDarkMode?'text-slate-200 bg-black/15':'text-slate-800 bg-white/25')">
    <div id="tool-bar">
        <div id="select-container" class="relative text-center cursor-pointer w-32 border-1 border-slate-200 rounded-lg transition duration-300 ease hover:border-slate-400 shadow-sm"
            :class="(theme.isDarkMode?'bg-white/5 text-slate-200':'bg-white/40 text-slate-700')+' '+(isOptionPanelOpen?'rounded-t-lg rounded-b-none':'rounded-lg')">
            <div id="time-section"
            @click="(isOptionPanelOpen = !isOptionPanelOpen)"
            class="p-1.5 pl-2 text-center bg-transparent ">
            {{checked}}
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
                >{{i.text}}</li>
           </ul>
        </div>
    </div>


    <div  class=" shadow-sm w-full p-2 mt-4 rounded-lg">
        <div  @mousemove.stop="handleMouseMove" ref="canvas" id="canvas" class="relative h-24">
            <div class="h-full w-[2px] bg-red-500 absolute z-[1]" :style="{left:`${mousePosition.x -1}px`}">

            </div>
          <div class="absolute top-1/2 h-[1px] w-full bg-red-800">

          </div>
            <div class="h-full w-[2px] bg-blue-500 relative z-20 " :style="{left:`${timePosition}%`}">

            </div>
            <div v-for="i in todayData" class="absolute h-24 top-0 border border-slate-50/20 z-10 block break-words text-[12px] border-1" :class="(theme.isDarkMode?'after:bg-white/5 border-amber-50/20':'after:bg-black/5 border-black/20')+`${(i.getRelativeData().end>timePosition && i.getRelativeData().start<timePosition) ? (' after:w-full after:h-full after:absolute after:top-0 after:left-0 after:animate-ping'):''}`" :style="{backgroundColor:i.bgColor, color:i.color,
                width:`${i.getRelativeData().length}%`,
                left:`${i.getRelativeData().start}%`
            }">{{i.content}}
              </div>
        </div>
    </div>

</div>
</template>
<style scoped>
.custom-slidein{
    animation: cs-slidein ease-in-out .25s forwards;
    transform: translateX(20px);
    opacity: 0;
}
@keyframes cs-slidein {
    0%{
        transform: translateX(20px);
        opacity: 0;
    }
    100%{
        transform: translateX(0);
        opacity: 1;
    }
}
::-webkit-scrollbar{
    display: none;
}
</style>
