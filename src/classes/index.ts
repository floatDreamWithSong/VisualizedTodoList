import { FormatedDate, ImplicityTask } from './implicityTask';
import { TaskGroup, Task } from './Task';
export function getMonitorTasksData() {
    const arr: TaskGroup[] = [];
    let gcnt = random()
    for (let i = 0; i < gcnt; i++) {
        const g = new TaskGroup('taskgroup-' + i)
        g.tasks = getMonitorImplicityTask()
        arr.push(g)
    }
    console.log(arr)
    return arr
}
export function getMonitorImplicityTask() {
    const arr: Task[] = []
    let tcnt = random()
    for (let i = 0; i < tcnt; i++) {
        arr.push(getTask(i))
    }
    return arr
}
export function getTask(i: number, t: string = 'task') {
    return new ImplicityTask(t + i, 'tasl desc' + i, FormatedDate.constructByString('2024-10-1'), new FormatedDate(2024, 10, 11), i & 1, i)
}
function random() {
    let res = 0
    for (let i = 0; i < 10; i++) {
        res += Math.random();
    }
    return Math.floor(res)
}