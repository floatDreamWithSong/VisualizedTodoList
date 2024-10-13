<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import { useTaskStore } from '@/stores/task';
import { computed, ref } from 'vue';
const searchText = ref('')
const taskGroupName = ref('')
const theme = useCounterStore()
const taskStroe = useTaskStore()
const isTaskGroupShoudlBeRender = () => {
    return taskStroe.taskGroups.length
}
const taskGroupComputed = computed(() => taskStroe.taskGroups.filter(i => i.groupName.toLowerCase().includes(searchText.value)))
defineProps({
    currentGroupId: Number,
    changeGroup: Function
})
</script>
<template>
    <div class="*:cursor-pointer *:px-1 *:rounded-md">
        <slot name="closel"/>
        <slot name="dark"/>
    </div>
    
    <input class="my-4 w-full outline-none px-2 rounded-md text-black/70 flex border-b-2"
        :class="theme.isDarkMode ? ' bg-white/5 border-slate-50/5 text-slate-200' : ' border-slate-200'"
        placeholder="Search" type="text" v-model="searchText">

    <TransitionGroup v-if="isTaskGroupShoudlBeRender()" name="list" tag="ul"
        class="w-full flex-grow  overflow-y-scroll">
        <li class="*:hover:opacity-100 relative transition-all hover:bg-slate-500/50 p-2 rounded-md  cursor-pointer ani flex justify-between"
            v-for="(i, ind) in taskGroupComputed" :class="(theme.isDarkMode ? ' ' : ' bg-slate-100 ') +
                (currentGroupId == ind ? 'bg-slate-500/35' : '')" @click="(changeGroup as Function)(ind)" :key="i.id">
            <span>{{ i.groupName }}</span>
            <div class="opacity-0 *:p-1 *:rounded-lg relative z-1">
                <i @click.stop="taskStroe.deleteTaskGroupById(ind)"
                    class="hover:bg-red-500/20 bi-trash-fill text-red-700"></i>
            </div>
        </li>
    </TransitionGroup>

    <div v-else class="w-full h-full flex justify-center items-center">
        Empty List...
    </div>
    <div
        class=" border-t-2 border-slate-200 w-full pt-2 *:rounded-lg flex *:w-full *:mr-2 *:flex *:items-center *:justify-around *:cursor-pointer *:transition-all">
        <div>
            <i class="bi-plus-circle hover:cursor-pointer"
                @click="(taskStroe.addTaskGroup(taskGroupName), taskGroupName = '')"></i>
            <input @keyup.enter="(taskStroe.addTaskGroup(taskGroupName), taskGroupName = '')" v-model="taskGroupName"
                type="text" class="p-1 outline-none rounded-lg" :class="theme.isDarkMode ? ' bg-white/5' : ''"
                placeholder="New Group" maxlength="24">
        </div>
    </div>
</template>
<style scoped>
.ani:hover::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: aliceblue;
    animation: anim .6s ease-in-out forwards;
}

@keyframes anim {
    from {
        width: 1%;
        opacity: 0.2;
    }

    to {
        width: 100%;
        opacity: 0;
    }
}
</style>