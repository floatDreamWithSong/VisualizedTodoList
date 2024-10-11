export class Validation {
    count = 0
    res: boolean
    callbacks: Function[] = []
    constructor(res: boolean | undefined = undefined) {
        this.res = res != undefined ? res : true
    }
    validate(condition: boolean, mes: string = '', callback: Function | undefined = undefined, errorCallback: Function | undefined = undefined) {
        if (!condition) {
            if (mes.length)
                console.error(++this.count, mes)
            if (errorCallback != undefined) {
                errorCallback()
            }
        } else {
            if (callback != undefined)
                this.callbacks.push(callback)
        }
        this.res = this.res && condition
        return this
    }
    apply() {
        if (this.res)
            this.callbacks.forEach(fn => fn())
        return this.res
    }
}