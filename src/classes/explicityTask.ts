import { reactive, ref } from "vue";
import { FormatedDate } from "./implicityTask";
import { Task } from "./Task";

export class ExplicityTask extends Task {
    start: Time
    end: Time
    work: WeekModeWorkTime
    constructor(
        name: string, desc: string, start: Time, end: Time, work: WeekModeWorkTime,
        bgColor: string = '#fcfcfc',
        color: string = '#2c2c2c'
    ) {
        super(name, desc, bgColor, color)
        this.start = start
        this.end = end
        this.work = work
    }
}
export class Time {
    hour: number
    minutes: number
    cacheString = '08:00'
    constructor(hour: number, min: number = 0) {
        this.hour = Math.min(23, Math.max(0, hour))
        this.minutes = Math.min(59, Math.max(0, min))
    }
    toString() {
        return `${this.hour > 9 ? this.hour : '0' + this.hour}:${this.minutes > 9 ? this.minutes : '0' + this.minutes}`
    }
    static constructeByString(str: string) {
        const a = str.split(':')
        return new Time(Number(a[0]), Number(a[1]))
    }
    calcMinutes() {
        return this.hour * 60 + this.minutes
    }
    applyCache() {
        const t = Time.constructeByString(this.cacheString)
        this.hour = t.hour
        this.minutes = t.minutes
    }
}
export interface WorkTime {
    type: string
    isWorkToday: () => boolean
}
export class WeekModeWorkTime implements WorkTime {
    type: string = 'week'
    arr: string[] = []
    static day = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    constructor(strs: string[]) {
        this.arr = [...strs]
    }
    isWorkToday(): boolean {
        const flag = new Date().toDateString().split(' ')[0]
        return this.arr.some(i => {
            i == flag
        })
    }
}
// export class CustomModeWorkTime implements WorkTime {
//     type: string = 'custom'
//     arr: FormatedDate[] = []
//     isWorkToday() {
//         return this.arr.some(i => FormatedDate.equal(new FormatedDate(), i))
//     }

// }