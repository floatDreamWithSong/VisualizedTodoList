<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import { useTaskStore } from '@/stores/task';
import TaskEditor from './TaskEditor.vue';
import { ref } from 'vue';
const theme = useCounterStore()
const taskStroe = useTaskStore()
const taskName = ref('')
const isOpenTaskEditor = ref(false)
const props = defineProps({
    currentGroupId: {
        type: Number,
    }
})
const isTaskGroupIndexCorrect = () => {
    return props.currentGroupId != undefined && props.currentGroupId < taskStroe.taskGroups.length && props.currentGroupId >= 0
}
const isTaskListShouldBeRender = () => {
    return isTaskGroupIndexCorrect() && props.currentGroupId != undefined && taskStroe.taskGroups[props.currentGroupId].tasks.length > 0
}
const isEmptyPage = () => {
    return !isTaskGroupIndexCorrect()
}
const openTaskEditor = (taskName: string) => {
    fixedTaskName = taskName.concat('')
    isOpenTaskEditor.value = true
}
const closeTaskEditor = () => {
    isOpenTaskEditor.value = false
}
let fixedTaskName = ''
</script>
<template>
    <div v-if="!isEmptyPage() && props.currentGroupId != undefined"
        class="w-full h-full grid relative custom-grid2 overflow-hidden">
        <div class="flex items-center w-full text-2xl font-bold px-4 z-11 justify-between">
            <input type="text" class=" my-4 bg-transparent outline-none p-2 rounded-md focus-within:border-b-2 "
                v-model.lazy="taskStroe.taskGroups[props.currentGroupId].groupName" />
        </div>
        <TransitionGroup v-if="isTaskListShouldBeRender()" name="list" tag="ul"
            class=" bg-transparent w-full flex-grow relative  overflow-y-scroll px-20 pt-12">
            <li class="relative *:hover:opacity-100 p-2 flex justify-between rounded-md transition-all mb-2 cursor-pointer border-2 border-slate-200/50"
                :class="theme.isDarkMode ? ' bg-white/5  hover:bg-black/5 border-white/5 ' : ' bg-slate-100  hover:bg-slate-200 '"
                v-for="(i, ind) in taskStroe.taskGroups[props.currentGroupId].tasks" :key="i.id">
                <span>

                    <p class=" font-semibold text-lg">{{ i.name }}</p>
                    <i class="bi-calendar3 p-1 rounded-sm text-sm">&nbsp;{{ i.fromDate.toString() }} - {{
                        i.toDate.toString() }}</i>
                        &nbsp;
                    <i v-if="i.repeatTimes" class="bi-repeat">&nbsp;{{i.repeatTimes}}</i>
                    <p class=" text-sm" :class="theme.isDarkMode ? 'text-gray-400' : 'text-gray-700'">
                        {{ i.description }}
                    </p>
                    <ul class="*:text-gray-500 *:text-sm *:p-1 *:rounded-sm *:mr-1 *:mt-1 mt-1 *:inline-block">
                        <li v-for="item in i.transcations" :class="theme.isDarkMode ? 'bg-black/20' : 'bg-black/10'">
                            {{ item.name }}
                            <span>
                                &nbsp;
                                <i v-if="item.isTimeEnable" class="bi-alarm-fill">&nbsp;{{ `${item.start.cacheString} ~
                                    ${item.end.cacheString}` }}</i>
                            </span>
                            <span v-if="item.work.arr.length">
                                &nbsp;<i class="bi-7-square-fill">&nbsp;{{ item.work.arr.join(' ') }}</i>
                            </span>

                        </li>
                    </ul>
                </span>

                <div class="opacity-0 *:p-1 *:rounded-lg">
                    <i @click.stop="taskStroe.deleteTaskFromGroupById(props.currentGroupId, ind)"
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
            <input @keyup.enter="(openTaskEditor(taskName), taskName = '')" v-model="taskName"
                class=" bg-opacity-20  my-4 w-1/2 outline-none p-2 rounded-md "
                :class="theme.isDarkMode ? ' bg-white/5' : ''" placeholder="New Task" type="text">
        </div>
    </div>

    <div v-else class="w-full h-full flex justify-center items-center">
        Empty Page
    </div>
    <Teleport v-if="isOpenTaskEditor" to="body">
        <TaskEditor :task-name="fixedTaskName" :gid="currentGroupId" :close-task-editor="closeTaskEditor" />
    </Teleport>
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

.custom-grid2 {
    grid-template-rows: 4rem 1fr 4rem;
}
</style>