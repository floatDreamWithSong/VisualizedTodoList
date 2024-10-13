<script setup lang="ts">
import SideList from '@/components/SideList.vue';
import TaskListPage from '@/components/TaskListPage.vue';
import { useCounterStore } from '@/stores/counter';
import { ref } from 'vue';
const theme = useCounterStore()
const currentGroupId = ref(-1)
const changeGroup = (ind: number) => {
    currentGroupId.value = ind
}
</script>
<template>
    <div class="w-full h-full p-2  rounded-lg shadow-md flex overflow-scroll"
        :class="theme.isDarkMode ? ' bg-white/5 ' : ' bg-slate-100 '">
        <div class=" w-80 h-full p-4  rounded-l-lg grid custom-grid border-r-2 border-slate-400/10"
            :class="theme.isDarkMode ? ' bg-black/15' : ''">
            <SideList :current-group-id="currentGroupId" :change-group="changeGroup" />
        </div>
        <div class=" h-full flex-grow rounded-r-lg " :class="theme.isDarkMode ? ' bg-black/5' : 'bg-gray-100'">

            <TaskListPage :current-group-id="currentGroupId" />
        </div>
    </div>
</template>
<style scoped>
.custom-grid {
    grid-template-rows: 4rem 1fr 3rem;
}
</style>