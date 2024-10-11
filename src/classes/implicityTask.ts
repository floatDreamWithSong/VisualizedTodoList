import type { ExplicityTask } from "./explicityTask"
import { Task } from "./Task"

export class ImplicityTask extends Task {
    fromDate: FormatedDate
    toDate: FormatedDate
    repeatTimes: number
    duration: number
    transcations: ExplicityTask[] = []
    constructor(
        name: string, desc: string, from: FormatedDate, to: FormatedDate,
        repeatTimes: number = 0,
        duration: number = 0,
        bgColor: string = '#fcfcfc',
        color: string = '#2c2c2c'
    ) {
        super(name, desc, bgColor, color)
        this.fromDate = from
        this.toDate = to
        this.repeatTimes = repeatTimes
        this.duration = duration

    }
}
export class FormatedDate {
    year: number
    month: number
    day: number
    constructor(year: number | undefined = undefined, month: number | undefined = undefined, day: number | undefined = undefined) {
        const d = new Date()
        this.year = year == undefined ? d.getFullYear() : year
        this.month = month == undefined ? d.getMonth() + 1 : month
        this.day = day == undefined ? d.getDate() : day
    }
    toString() {
        return `${this.year}-${this.month > 9 ? this.month : '0' + this.month}-${this.day > 9 ? this.day : '0' + this.day}`
    }
    static constructByString(str: string) {
        const a = str.split('-')
        return new FormatedDate(
            Number(a[0]),
            Number(a[1]),
            Number(a[2])
        )
    }
    static equal(a: FormatedDate, b: FormatedDate) {
        return a.toString() == b.toString()
    }
}