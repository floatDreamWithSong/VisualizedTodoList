<script setup lang="ts">
import { getTask } from '@/classes';
import { useCounterStore } from '@/stores/counter';
import { useTaskStore } from '@/stores/task';
import { computed, ref } from 'vue';
const theme = useCounterStore()
const taskStroe = useTaskStore()
const currentGroupId = ref(-1)
const taskName = ref('')
const taskGroupName = ref('')
const searchText = ref('')
const isTaskGroupShoudlBeRender = () => {
    return taskStroe.taskGroups.length
}
const isTaskGroupIndexCorrect = () => {
    return currentGroupId.value < taskStroe.taskGroups.length && currentGroupId.value >= 0
}
const isTaskListShouldBeRender = () => {
    return isTaskGroupIndexCorrect() && taskStroe.taskGroups[currentGroupId.value].tasks.length > 0
}
const isEmptyPage = () => {
    return !isTaskGroupIndexCorrect()
}
const taskGroupComputed = computed(() => taskStroe.taskGroups.filter(i => i.groupName.toLowerCase().includes(searchText.value)))
</script>
<template>
    <div class="w-full h-full p-2  rounded-lg shadow-md flex overflow-scroll"
        :class="theme.isDarkMode ? ' bg-white/5 ' : ' bg-slate-100 '">
        <div class=" w-80 h-full p-4  rounded-l-lg grid custom-grid border-r-2 border-slate-400/10"
            :class="theme.isDarkMode ? ' bg-black/15' : ''">
            <input class="my-4 w-full outline-none px-2 rounded-md text-black/70 flex border-b-2"
                :class="theme.isDarkMode ? ' bg-white/5 border-slate-50/5 text-slate-200' : ' border-slate-200'"
                placeholder="Search" type="text" v-model="searchText">

            <TransitionGroup v-if="isTaskGroupShoudlBeRender()" name="list" tag="ul"
                class="w-full flex-grow  overflow-y-scroll">
                <li class="*:hover:opacity-100 relative transition-all hover:bg-slate-500/50 p-2 rounded-md  cursor-pointer ani flex justify-between"
                    v-for="(i, ind) in taskGroupComputed" :class="(theme.isDarkMode ? ' ' : ' bg-slate-100 ') +
                        (currentGroupId == ind ? 'bg-slate-500/35' : '')" @click="currentGroupId = ind" :key="i.id">
                    <span>{{ i.groupName }}</span>
                    <div class="opacity-0 *:p-1 *:rounded-lg ">
                        <i @click.stop="taskStroe.deleteTaskFromGroupById(currentGroupId, ind)"
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
                    <input @keyup.enter="(taskStroe.addTaskGroup(taskGroupName), taskGroupName = '')"
                        v-model="taskGroupName" type="text" class="p-1 outline-none rounded-lg"
                        :class="theme.isDarkMode ? ' bg-white/5' : ''" placeholder="New Group" maxlength="24">
                </div>
            </div>
        </div>
        <div class=" h-full flex-grow rounded-r-lg " :class="theme.isDarkMode ? ' bg-black/5' : 'bg-gray-100'">

            <div v-if="!isEmptyPage()" class="w-full h-full grid relative custom-grid2 overflow-hidden">
                <div class="flex items-center w-full text-2xl font-bold px-4 z-11 justify-between">
                    <input type="text" class=" my-4 bg-transparent outline-none p-2 rounded-md focus-within:border-b-2 " v-model.lazy="taskStroe.taskGroups[currentGroupId].groupName" />
                    <div>
                        <i @click.stop="''" class="hover:bg-red-500/20 bi-trash-fill text-red-700"></i>
                    </div>
                </div>
                <TransitionGroup v-if="isTaskListShouldBeRender()" name="list" tag="ul"
                    class=" bg-transparent w-full flex-grow relative  overflow-y-scroll px-20 pt-12">
                    <li class="relative *:hover:opacity-100 p-2 flex justify-between rounded-md transition-all mb-2 cursor-pointer border-2 border-slate-200/50"
                        :class="theme.isDarkMode ? ' bg-white/5  hover:bg-black/5 border-white/5 ' : ' bg-slate-100  hover:bg-slate-200 '"
                        v-for="(i, ind) in taskStroe.taskGroups[currentGroupId].tasks" :key="i.id">
                        <span>{{ i.name }}&nbsp;<p class="text-slate-500/50">{{ i.description }}</p></span>

                        <div class="opacity-0 *:p-1 *:rounded-lg">
                            <i @click.stop="taskStroe.deleteTaskFromGroupById(currentGroupId, ind)"
                                class="hover:bg-red-500/20 bi-trash-fill text-red-700"></i>
                        </div>
                    </li>
                </TransitionGroup>
                <div v-else class="w-full h-full flex justify-center items-center">
                    <div>
                        Empty List..
                    </div>
                </div>
                <div class="flex justify-center items-center z-10">
                    <input
                        @keyup.enter="(taskStroe.addTaskIntoGroup(currentGroupId, getTask(1, taskName)), taskName = '')"
                        v-model="taskName" class=" bg-opacity-20  my-4 w-1/2 outline-none p-2 rounded-md "
                        :class="theme.isDarkMode ? ' bg-white/5' : ''" placeholder="New Task" type="text">
                </div>
            </div>

            <div v-else class="w-full h-full flex justify-center items-center">
                Empty Page
            </div>
        </div>
    </div>
</template>
<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.ani:hover::after {
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

.custom-grid2 {
    grid-template-rows: 4rem 1fr 4rem;
}

.custom-grid {
    grid-template-rows: 4rem 1fr 3rem;
}

::-webkit-scrollbar {
    display: none;
}
</style>