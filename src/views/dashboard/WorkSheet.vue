<script setup lang="ts">
import ShowTransaction from '@/components/ShowTransaction.vue';
import { useCounterStore } from '@/stores/counter';
import { useCanvas, inRangeCurData, inRangeSelectData } from '@/tools/canvas';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
  const { closeCanvas } = useCanvas({
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
</script>
<template>
  <div class="w-full h-full p-2  rounded-lg shadow-md flex-col overflow-scroll"
    :class="(theme.isDarkMode ? 'text-slate-200 bg-black/15' : 'text-slate-800 bg-white/25')">
    <div class="*:px-1 *:rounded-md *:cursor-pointer ">
      <slot name="close"></slot>
      <slot name="darkmode"></slot>
    </div>
    <div class=" w-full mt-4 flex-col">
      <div id="canvas-box" class=" shadow-md w-full p-2 mt-4 rounded-lg">
        <canvas class="bg-transparent w-full" id="canvas" ref="canvas">Your device is not support canvas</canvas>
      </div>
      <div class="w-full flex justify-around overflow-y-scroll *:shadow-md">
        <ShowTransaction text="There is no thing to do now..." :data="inRangeCurData" :is-cur="true" />
        <ShowTransaction text="Select no thing..." :data="inRangeSelectData" :is-cur="false" />
      </div>
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
