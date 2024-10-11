import { Task } from "./Task";

export class ExplicityTask extends Task {
    start: number
    end: number
    workDay: ExplicityTaskWorkingTime
    constructor(
        name: string, desc: string, start: number, end: number, wordDay: ExplicityTaskWorkingTime,
        bgColor: string = '',
        color: string = ''
    ) {
        super(name, desc, bgColor, color)
        this.start = start
        this.end = end
        this.workDay = wordDay
    }
}
export class ExplicityTaskWorkingTime {
    arr: boolean[]
    constructor(a: boolean, b: boolean, c: boolean, d: boolean, e: boolean, f: boolean, g: boolean) {
        this.arr = [a, b, c, d, e, f, g];
    }
}