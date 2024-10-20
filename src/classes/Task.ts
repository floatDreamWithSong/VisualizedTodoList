import type { ImplicityTask } from "./implicityTask"

export abstract class Task {
    name: string
    description: string
    bgColor: string
    color: string
    id: number = new Date().getTime()+Math.random()
    constructor(name: string, description: string, bgColor: string = '#fcfcfc', color: string = '#2c2c2c') {
        this.name = name
        this.description = description
        this.bgColor = bgColor
        this.color = color
    }
}
export class TaskGroup {
    tasks: ImplicityTask[]
    groupName: string
    id: number = new Date().getTime()+Math.random()
    constructor(name: string, id?: number ) {
        this.groupName = name
        this.tasks = []
    }
}