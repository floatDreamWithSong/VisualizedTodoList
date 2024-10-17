// import { getMonitorTasksData } from '@/classes'
import { FormatedDate, ImplicityTask } from '@/classes/implicityTask'
import { TaskGroup } from '@/classes/Task'
import { defineStore } from 'pinia'
import { reactive, toRaw } from 'vue'
import localforage from 'localforage'
import { ExplicityTask, Time, WeekModeWorkTime } from '@/classes/explicityTask'
const TASK_GROUP_KEY = 'localData'
const TASK_GROUP_DATA = 'local_task_group_data'
const IM_TASK_KEY = 'local_im_task_id'
const EX_TASK_KEY = 'local_ex_task_id'
export const useTaskStore = defineStore('task', () => {
    const initData = () => {
        let taskGroups = reactive(new Array<TaskGroup>());
        localforage.getItem(TASK_GROUP_KEY).then(res => {
            console.log(res)
            if (typeof res === 'string') {
                const _data = JSON.parse(res as string) as TaskGroup[]
                _data.forEach(taskgroup => {
                    const data = new TaskGroup(taskgroup.groupName, taskgroup.id);
                    taskgroup.tasks.forEach(task => {
                        const d = new ImplicityTask(task.name, task.description, new FormatedDate(task.fromDate.year, task.fromDate.month, task.fromDate.day), new FormatedDate(task.toDate.year, task.toDate.month, task.toDate.day), task.repeatTimes, task.duration, task.bgColor, task.color)
                        task.transcations.forEach(i => {
                            const _d = new ExplicityTask(i.name, i.description, (function () { const t = new Time(i.start.hour, i.start.minutes); t.cacheString = t.toString(); return t })(), (function () { const t = new Time(i.end.hour, i.end.minutes); t.cacheString = t.toString(); return t })(), new WeekModeWorkTime(i.work.arr), i.bgColor, i.color)
                            _d.isTimeEnable = i.isTimeEnable
                            _d.isTimeValid = i.isTimeValid
                            d.transcations.push(_d)
                        })
                        data.tasks.push(d);
                    })
                    taskGroups.push(data)
                })
            }
        }).catch(err => {
            console.error(err);
        })
        return { taskGroups };
    }

    const { taskGroups } = initData()
    const storageData = () =>{
        localforage.setItem('localData', JSON.stringify(toRaw(taskGroups)))
    }
    const addTaskGroup = (name: string) => {
        taskGroups.push(new TaskGroup(name))
        
    }
    const addTaskIntoGroup = (index: number, task: ImplicityTask) => {
        taskGroups[index].tasks.push(reactive(task))
        storageData()
    }
    const deleteTaskFromGroupById = (index: number, taskIndex: number) => {
        taskGroups[index].tasks.splice(taskIndex, 1)
        storageData()
    }
    const deleteTaskGroupById = (index: number) => {
        taskGroups.splice(index, 1)
        storageData()
    }

    return {
        taskGroups,
        addTaskGroup,
        addTaskIntoGroup,
        deleteTaskFromGroupById,
        deleteTaskGroupById,
        storageData
    }
})
