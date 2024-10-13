import { getMonitorTasksData } from '@/classes'
import type { ImplicityTask } from '@/classes/implicityTask'
import { TaskGroup } from '@/classes/Task'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useTaskStore = defineStore('task', () => {
    const taskGroups: TaskGroup[] = reactive(getMonitorTasksData())
    const addTaskGroup = (name: string) => {
        taskGroups.push(new TaskGroup(name))
    }
    const addTaskIntoGroup = (index: number, task: ImplicityTask) => {
        taskGroups[index].tasks.push(reactive(task))
    }
    const deleteTaskFromGroupById = (index: number, taskIndex: number) => {
        taskGroups[index].tasks.splice(taskIndex, 1)
    }
    const deleteTaskGroupById = (index: number) => {
        taskGroups.splice(index, 1)
    }
    return {
        taskGroups,
        addTaskGroup,
        addTaskIntoGroup,
        deleteTaskFromGroupById,
        deleteTaskGroupById
    }
})
