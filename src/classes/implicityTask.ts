import { Task } from "./Task"

export class ImplicityTask extends Task {
    fromDate: FormatedDate
    toDate: FormatedDate
    repeatTimes: number
    duration: number
    constructor(
        name: string, desc: string, from: FormatedDate, to: FormatedDate,
        repeatTimes: number = 0,
        duration: number = 0,
        bgColor: string = '', 
        color: string = ''
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
    constructor(year: number, month: number, day: number) {
        this.year = year
        this.month = month
        this.day = day
    }
    toString() {
        return `${this.year}-${this.month}-${this.day}`
    }
    static constructByString(str: string) {
        const a = str.split('-')
        return new FormatedDate(
            Number(a[0]),
            Number(a[1]),
            Number(a[2])
        )
    }
}