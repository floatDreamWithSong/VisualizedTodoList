<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import type { todayTransaction } from '@/stores/today';
import type { PropType } from 'vue';
defineProps({
    data:Array as PropType<todayTransaction[]>,
    text: String,
    isCur: Boolean
})
const theme = useCounterStore()
const getCompeletePercentage = (s:Date, t:Date)=>{
    let d = new Date().getTime(), a= s.getTime(), b = t.getTime()
    if(d<=a ){
        return 0
    }
    if(d>=b|| b<=a){
        return 100
    }
    return Math.floor((d-a)*100/(b-a))
}
</script>
<template>
    <ul class=" rounded-lg p-2 mt-4 w-5/12 item-center flex-col h-full overflow-scroll" :class="theme.isDarkMode?' bg-white/5 ' :' bg-slate-100 '">
        <p v-if="!data?.length">{{ text }}</p>
        <li v-else v-for="i in data">
          <article class=" overflow-hidden shadow-sm mb-1 p-2 rounded-lg relative" :class="(isCur?' ani ':'')+(theme.isDarkMode?' bg-black/30 ':' bg-slate-200 ')" 
          :style="`--before-width: ${getCompeletePercentage(i.startTime,i.endTime)}%;--before-color: ${theme.isDarkMode?'#ffffff20':'#00000027'};`">
            <h1 class=" text-lg">{{ i.title }}</h1>
            <span class="text-sm/3">{{i.startTime.toLocaleTimeString()}} 开始 &nbsp; {{i.endTime.toLocaleTimeString()}} 结束</span> 
            <section class=" font-light text-sm/4">
                <p>{{ i.content }}</p> 
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil exercitationem quisquam veritatis labore porro, neque accusamus modi minima quae repellat velit quis facere natus totam? Nihil id accusamus soluta earum!</p>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio, magni saepe cumque similique aspernatur sapiente modi quidem incidunt accusantium beatae eum rerum, quibusdam obcaecati porro vitae aliquam cupiditate rem laboriosam?</p>
            </section>
          </article>
        </li>
      </ul>
</template>
<style scoped>
.ani::after{
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left:0;
    top: 0;
    background-color: aliceblue;
    animation: anim 2.4s ease-in-out infinite;
}
.ani::before{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: var(--before-width);
    height: 100%;
    background: var(--before-color);
}
@keyframes anim {
    from{
        width: 1%;
        opacity: 0.2;
    }
    to{
        width: 100%;
        opacity: 0;
    }
}
</style>