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
const useListStatus=()=>{
    const listStatus = ref<boolean>(true);
    const setListStatus = () =>{
        listStatus.value = !listStatus.value;
    }
    return {listStatus, setListStatus};
}
const {listStatus, setListStatus} = useListStatus()
</script>
<template>
    <div class="w-full h-full  rounded-lg shadow-md flex overflow-hidden relative "
        :class="theme.isDarkMode ? ' bg-white/5' : ' bg-slate-100 '">
        <div class=" overflow-hidden max-lg:absolute max-lg:z-50 transition-all max-lg:bg-inherit h-full  rounded-l-lg grid custom-grid border-r-2 border-slate-400/10"
            :class="(theme.isDarkMode ? ' bg-black/5' : '')+(listStatus?' p-4 ':'  w-0 p-0')">
            <SideList :current-group-id="currentGroupId" :change-group="changeGroup" >
                <template #closel>
                    <slot name="close"></slot>
                    <slot name="darkmode"></slot>
                </template>
            </SideList>
        </div>
        <div class=" h-full flex-grow p-4 rounded-r-lg overflow-hidden" :class="theme.isDarkMode ? ' bg-black/15 ' : 'bg-gray-100'">
            <TaskListPage :current-group-id="currentGroupId" >
                <template #default>

                        <div class=" cursor-pointer bi-menu-button hover:bg-gray-600/50 px-2 text-lg rounded-md" @click="setListStatus()"></div>
                    
                </template>
            </TaskListPage>
        </div>
    </div>
</template>
<style scoped>
.custom-grid {
    grid-template-rows: 1.25rem 4rem 1fr 3rem;
}
</style>