
export class todayTransaction {
    content: string = '某一件事请。'
    bgColor: string = 'gray'
    color: string = 'white'
    startTime: Date = new Date()
    endTime: Date = new Date()
    getRelativeData() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0)
        const _s = (this.startTime.getTime() - startOfDay.getTime())/(24*3600000);
        const _e = (this.endTime.getTime() - startOfDay.getTime())/(24*3600000);
        return { start: _s, end:_e , length:_e -_s }
    }
}
export const todayData =  {
    data:[] as todayTransaction[]
}
const getTodayData = () => {
    const data: todayTransaction[] = [];
    for (let i = 0; i < 24; i++) {
        const _data = new todayTransaction()
        _data.content+=i
        _data.startTime.setHours(i,0,0,0);
        _data.endTime.setHours(i + Math.floor(Math.random()*5),50);
        data.push(_data)
    }
    todayData.data = data;
}
getTodayData()

