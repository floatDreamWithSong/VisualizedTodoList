import { defineStore } from 'pinia'

class todayTransaction {
    content: string = '某一件事请。'
    bgColor: string = ''
    color: string = ''
    startTime: Date = new Date()
    endTime: Date = new Date()
    getRelativeData() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0)
        const _s = (this.startTime.getTime() - startOfDay.getTime())/(24*36000);
        const _e = (this.endTime.getTime() - startOfDay.getTime())/(24*36000);
        return { start: _s, end:_e , length:_e -_s }
    }
}
export const useTodayStore = defineStore('today', () => {
    const getTodayData = () => {
        const data: todayTransaction[] = [];
        for (let i = 0; i < 20; i++) {
            const _data = new todayTransaction()
            _data.startTime.setHours(i);
            _data.endTime.setHours(i + 1);
            data.push(_data)
        }
        return data;
    }
    const todayData: todayTransaction[] = getTodayData();
    const sortData = () => {
        todayData.sort((a, b) => {
            return a.startTime.getTime() - b.startTime.getTime()
        })
    }

    return { todayData }
})
