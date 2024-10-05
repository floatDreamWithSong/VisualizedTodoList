<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import { ref } from 'vue';

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
    <div id="tool-bar" >
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
</template>
<style scoped></style>