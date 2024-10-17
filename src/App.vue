<script setup lang="ts">
import { useCounterStore } from './stores/counter';
const theme = useCounterStore()
</script>

<template>
<div class="w-full h-full transition-all" :class="theme.isDarkMode?' bg-black/70 ':'bg-slate-200'">
  <RouterView/>
</div>
</template>
<style scoped>

</style>
