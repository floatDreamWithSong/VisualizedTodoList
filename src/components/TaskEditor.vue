<script setup lang="ts">
import { ExplicityTask, Time, WeekModeWorkTime } from '@/classes/explicityTask';
import { FormatedDate, ImplicityTask } from '@/classes/implicityTask';
import { useTaskStore } from '@/stores/task';
import { Validation } from '@/utils/validator';
import { reactive, ref } from 'vue';
const taskStore = useTaskStore()
function updateTimeString(e: Event, time: Time) {
    // @ts-ignore
    time.cacheString = e.target.value
}
const props = defineProps({
    taskName: String,
    closeTaskEditor: Function,
    gid: Number
})
const todayFormated = new FormatedDate()
const task_name = ref(props.taskName as string)
const task_desc = ref('no description')
const fromDate = ref(todayFormated.toString())
const toDate = ref(todayFormated.toString())
const repeatTimes = ref(0)
const duration = ref(0)
const bgColor = ref('#fcfcfc')
const color = ref('#2c2c2c')
const Transactions = ref<ExplicityTask[]>([])
const validateColorFormat = (color: string) => {
    return color.startsWith('#') && (color.length == 7 || color.length == 9)
}
const setTask = () => {
    if (validate()) {
        taskStore.addTaskIntoGroup(props.gid as number, (function () {
            const task = new ImplicityTask(
                task_name.value,
                task_desc.value,
                FormatedDate.constructByString(fromDate.value),
                FormatedDate.constructByString(toDate.value),
                repeatTimes.value,
                duration.value,
                bgColor.value,
                color.value
            )
            task.transcations = Transactions.value
            return task
        })())
        props.closeTaskEditor ? props.closeTaskEditor() : 0;
    }
}
const validate = () => {
    return new Validation()
        .validate(task_name.value != undefined && task_name.value.length > 0, 'invalid task-name')
        .validate(fromDate.value != undefined, 'invalid formDate')
        .validate(toDate.value != undefined, 'invalid toDate')
        .validate(fromDate.value.length == 10, 'invalid from date')
        .validate(toDate.value.length == 10, 'invalid to date')
        .validate(toDate.value >= fromDate.value, 'to date must be later than from')
        .validate(repeatTimes.value >= 0, 'repeat must be no negative')
        .validate(duration.value >= 0, 'duration must be nonegative')
        .validate(validateColorFormat(bgColor.value), 'invalid bgcolor')
        .validate(validateColorFormat(color.value), 'invalid color')
        .validate(Transactions.value.every(i => validateTranscation(i)), 'didn\'t pass all the transcation').apply()
}

const validateTranscation = (t: ExplicityTask) => {
    console.log(t.start, t.end)
    return new Validation()
        .validate(t.name.length > 0, 'invalid transcation name')
        .validate(t.start.cacheString < t.end.cacheString, 'invalid transcation start time', function () {
            t.start.applyCache()
            t.end.applyCache()
        })
        .validate(validateColorFormat(t.bgColor), 'invalid transcation bgcolor')
        .validate(validateColorFormat(t.color), 'invalid transcation color')
        .validate(t.work.arr.every(i =>
            WeekModeWorkTime.day.includes(i)
        ), 'invalid work day time').apply()
}
</script>
<template>
    <div class="w-full h-full z-50 absolute bg-black/20 flex justify-center items-center">
        <div @click.stop="''"
            class="w-3/4 h-1/2 rounded-lg p-4 bg-white animate__animated animate__bounceIn animate__faster overflow-y-auto">
            <p>{{ fromDate + toDate + bgColor + color }}</p>
            <input type="text" v-model.lazy="task_name">
            <br>
            <input type="date" :min="todayFormated.toString()" v-model="fromDate"
                @change="(toDate < fromDate ? toDate = fromDate : 0)">
            <br>
            <input type="date" :min="fromDate" v-model="toDate">
            <br>
            <textarea v-model="task_desc"></textarea>
            <br>
            重复<input type="number" min="0" v-model.lazy="repeatTimes" />次
            <br>
            周期<input type="number" min="0" v-model.lazy="duration" />天
            <br>
            背景颜色<input type="color" v-model="bgColor" />
            <br>
            文字颜色<input type="color" v-model="color" />
            <br>
            添加事务
            <button @click="Transactions.push(
                reactive(
                    new ExplicityTask(
                        '事务', '', new Time(8), new Time(16), new WeekModeWorkTime([])
                    )
                )
            )">add</button>
            <div>
                <div v-if="Transactions.length" v-for="i in Transactions">
                    <input type="text" v-model="i.name">
                    <input type="time" :value="i.start.cacheString" @change="e => updateTimeString(e, i.start)">
                    <input type="time" :min="i.start.cacheString" :value="i.end.cacheString"
                        @change="e => updateTimeString(e, i.end)">
                    <span v-for="j in WeekModeWorkTime.day"
                        @click="i.work.arr.includes(j) ? i.work.arr.splice(i.work.arr.indexOf(j), 1) : i.work.arr.push(j)">
                        {{ j }}&nbsp;
                    </span>
                    <p>{{ i.work.arr.toString() }}</p>
                    背景颜色<input type="color" v-model="i.bgColor" />
                    文字颜色<input type="color" v-model="i.color" />
                </div>
            </div>
            <button @click="setTask">submit</button>
            <!--@vue-ignore-->
            <button @click="closeTaskEditor">Close</button>
        </div>
    </div>
</template>
<style scoped>
input {
    border: 1px solid rgba(0, 0, 0, 0.207);
}
</style>