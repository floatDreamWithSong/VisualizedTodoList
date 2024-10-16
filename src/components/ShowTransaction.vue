<script setup lang="ts">
import { ExplicityTask } from '@/classes/explicityTask';
import { useCounterStore } from '@/stores/counter';
import type { PropType } from 'vue';
defineProps({
    data:Array as PropType<ExplicityTask[]>,
    text: String,
    isCur: Boolean
})
const theme = useCounterStore()

</script>
<template>
    <ul class=" rounded-lg p-2 mt-4 w-5/12 item-center flex-col h-full overflow-scroll" :class="theme.isDarkMode?' bg-white/5 ' :' bg-slate-100 '">
        <p v-if="!data?.length">{{ text }}</p>
        <li v-else v-for="i in data">
          <article class=" overflow-hidden shadow-sm mb-1 p-2 rounded-lg relative" :class="(isCur?' ani ':'')+(theme.isDarkMode?' bg-black/30 ':' bg-slate-200 ')" 
          :style="`--before-width: ${ExplicityTask.getCompleteRatio(i)*100 }%;--before-color: ${theme.isDarkMode?'#ffffff20':'#00000027'};`">
            <h1 class=" text-lg">{{ i.name}}</h1>
            <span class="text-sm/3">{{i.start.toString()}} 开始 &nbsp; {{i.end.toString()}} 结束</span> 
            <section class=" font-light text-sm/4">
                <p>{{ i.description||'no description' }}</p> 
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