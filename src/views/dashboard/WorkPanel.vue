<script setup lang="ts">
import {useCounterStore} from '@/stores/counter';
import { useCanvas,inRangeCurData, inRangeSelectData } from '@/tools/canvas';
import { onBeforeUnmount, onMounted, ref} from 'vue';

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  const {closeCanvas} = useCanvas({
    canvas: (canvas.value as HTMLCanvasElement),
    derta: 16,
    ratio: 2,
    fontRatio: 1,
    height: 500,
  })
  onBeforeUnmount(() => {
    closeCanvas()
})
})

// 控制状态开关的
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
      <canvas class="bg-transparent w-full" id="canvas" ref="canvas">Your device is not support canvas</canvas>
    </div>
    <div class="w-full flex justify-around *:p-2 *:mt-4 *:w-5/12 *:item-center *:flex-col *:bg-slate-400 *:h-fit">
      <ul id="cur-plan" class=" ">
        <p v-if="!inRangeCurData.length">当前时间没有事务</p>
        <li v-else v-for="i in inRangeCurData">
          <article>
            <section>{{ i.content }}</section>
            <p>{{i.startTime.toLocaleTimeString()}} 开始 <br> {{i.endTime.toLocaleTimeString()}} 结束</p>
          </article>
        </li>
      </ul>
      <ul id="select-plan" class="">
        <p v-if="!inRangeSelectData.length">未选中时间</p>
        <li v-else v-for="i in inRangeSelectData">
          <article>
            <section>{{ i.content }}</section>
            <p>{{i.startTime.toLocaleTimeString()}} 开始 <br> {{i.endTime.toLocaleTimeString()}} 结束</p>
          </article>
        </li>
      </ul>
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
