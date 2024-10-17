<script setup lang="ts">
import { ExplicityTask, Time, WeekModeWorkTime } from '@/classes/explicityTask';
import { FormatedDate, ImplicityTask } from '@/classes/implicityTask';
import { useCounterStore } from '@/stores/counter';
import { useTaskStore } from '@/stores/task';
import { Validation } from '@/utils/validator';
import { reactive, ref } from 'vue';
const taskStore = useTaskStore()
const theme = useCounterStore()
function updateTimeString(e: Event, time: Time) {
    // @ts-ignore
    time.cacheString = e.target.value
}
const props = defineProps({
    taskName: String,
    closeTaskEditor: Function,
    gid: Number,
    task: ImplicityTask
})
const todayFormated = new FormatedDate()
const task_name = ref(props.task ? props.task.name : props.taskName as string)
const task_desc = ref(props.task ? props.task.description : 'no description')
const fromDate = ref(props.task ? props.task.fromDate.toString() : todayFormated.toString())
const toDate = ref(props.task ? props.task.toDate.toString() : todayFormated.toString())
const repeatTimes = ref(props.task ? props.task.repeatTimes : 0)
const duration = ref(props.task ? props.task.duration : 0)
const bgColor = ref(props.task ? props.task.bgColor : '#fcfcfc')
const color = ref(props.task ? props.task.color : '#2c2c2c')
const Transactions = ref<ExplicityTask[]>(props.task ? [...props.task.transcations] : [])
const validateColorFormat = (color: string) => {
    return color.startsWith('#') && (color.length == 7 || color.length == 9)
}
const setTask = () => {
    if (validate()) {
        if (props.task) {
            props.task.name = task_name.value
            props.task.description = task_desc.value
            props.task.fromDate = FormatedDate.constructByString(fromDate.value)
            props.task.toDate = FormatedDate.constructByString(toDate.value)
            props.task.repeatTimes = repeatTimes.value
            props.task.duration = duration.value
            props.task.bgColor = bgColor.value
            props.task.color = color.value
            props.task.transcations = Transactions.value
            useTaskStore().storageData()
        } else {
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
        }
        props.closeTaskEditor ? props.closeTaskEditor() : 0;
    }
}
const numberValidation = (number: any) => {
    return typeof number == 'number' && number == Math.floor(number) && number >= 0;
}
const timeValidation = (start: Time, end: Time) => {
    return start.cacheString < end.cacheString;
}
const stringValidation = (str: any) => {
    return str != undefined && str.length
}
const dateValidation = (from: string, to: string) => {
    return from <= to;
}
const validate = () => {
    return new Validation()
        .validate(stringValidation(task_name.value), 'invalid task-name')
        .validate(fromDate.value != undefined, 'invalid formDate')
        .validate(toDate.value != undefined, 'invalid toDate')
        .validate(fromDate.value.length == 10, 'invalid from date')
        .validate(toDate.value.length == 10, 'invalid to date')
        .validate(toDate.value >= fromDate.value, 'to date must be later than from')
        .validate(repeatTimes.value >= 0, 'repeat must be no negative')
        .validate(duration.value >= 0, 'duration must be nonegative')
        .validate(validateColorFormat(bgColor.value), 'invalid bgcolor')
        .validate(validateColorFormat(color.value), 'invalid color')
        .validate(Transactions.value.every(i => validateTranscation(i)), 'didn\'t pass all the transcation')
        .apply()
}

const validateTranscation = (t: ExplicityTask) => {
    console.log(t.start, t.end)
    const v = new Validation()
        .validate(t.name.length > 0, 'invalid transcation name')
    if (t.isTimeEnable)
        return v.validate(t.start.cacheString < t.end.cacheString, 'invalid transcation start time', function () {
            t.start.applyCache()
            t.end.applyCache()
        })
            .validate(validateColorFormat(t.bgColor), 'invalid transcation bgcolor')
            .validate(validateColorFormat(t.color), 'invalid transcation color')
            .validate(t.work.arr.every(i =>
                WeekModeWorkTime.day.includes(i)
            ), 'invalid work day time')
            .apply()

    return v.apply()


}
</script>
<template>
    <!--@vue-ignore-->
    <div class="w-full h-full z-50 absolute bg-black/20 flex justify-center items-center" @mousedown="setTask">
        <div @mousedown.capture.stop="''" :class="theme.isDarkMode ? ' bg-black/60  text-slate-50 ' : 'bg-white/50'"
            class="w-3/5 h-3/5 rounded-lg p-4 pl-12 backdrop-blur-md animate__animated animate__bounceIn animate__faster overflow-y-auto relative">
            <!-- <p>{{ fromDate + toDate + bgColor + color }}</p> -->
            <input id="title" type="text" class=" text-2xl font-bold leading-tight" v-model.lazy="task_name"
                placeholder="名称不能为空" :class="stringValidation(task_name) ? '' : 'warning'" />
            <br>
            <label for="fromdate">从&nbsp;</label>
            <input type="date" name="fromdate" :min="todayFormated.toString()" v-model="fromDate"
                @change="(toDate < fromDate ? toDate = fromDate : 0)"
                :class="dateValidation(fromDate, toDate) ? '' : 'warning'">
            <label for="todate">&nbsp;至&nbsp;</label>
            <input type="date" name="todate" :min="fromDate" v-model="toDate"
                :class="dateValidation(fromDate, toDate) ? '' : 'warning'">
            <div>
                <label for="repeattime">重复</label>
                <input type="number" name="repeattime" min="0" v-model.lazy="repeatTimes"
                    :class="numberValidation(repeatTimes) ? '' : 'warning'" />
                <label for="repeattime">次</label>
                <br>
                <label for="duration">周期</label>
                <input type="number" name="duration" min="0" v-model.lazy="duration"
                    :class="numberValidation(duration) ? '' : 'warning'" />
                <label for="duration">天</label>
                <br>
                <label for="bgcolor">背景颜色</label>
                <input type="color" name="bgcolor" v-model="bgColor" />
                <br>
                <label for="color">文字颜色</label>
                <input type="color" name="color" v-model="color" />
            </div>
            <br>
            <textarea class="" v-model="task_desc"></textarea>

            <br>
            <button @click="Transactions.push(
                reactive(
                    new ExplicityTask(
                        '事务', '', new Time(8), new Time(16), new WeekModeWorkTime([])
                    )
                )
            )"><i class="bi-plus-circle m-1 mt-2"></i>添加事务</button>
            <TransitionGroup tag="ul" name="list">
                <div v-if="Transactions.length" v-for="i in Transactions" :key="i.id" class="trans w-4/5">
                    <input type="text" v-model="i.name" placeholder="名称不能为空"
                        :class="stringValidation(i.name) ? '' : 'warning'">
                    <button @click="i.isTimeEnable = !i.isTimeEnable">{{ i.isTimeEnable ? '禁用' : '启用' }}时间调度</button>
                    <button style="background-color: rgb(199, 55, 45);" class="ml-1 mb-1"
                        @click="Transactions.splice(Transactions.indexOf(i), 1)">删除事务</button>
                    <div v-if="i.isTimeEnable">
                        <div>
                            开始于<input type="time" :value="i.start.cacheString"
                                @change="e => updateTimeString(e, i.start)"
                                :class="timeValidation(i.start, i.end) ? '' : 'warning'">
                            结束于<input type="time" :min="i.start.cacheString" :value="i.end.cacheString"
                                @change="e => updateTimeString(e, i.end)"
                                :class="timeValidation(i.start, i.end) ? '' : 'warning'">
                            <span class="warningtext p-1 text-sm"
                                v-if="i.end.cacheString <= i.start.cacheString">只能在开始后结束!</span>
                        </div>

                        <span v-for="j in WeekModeWorkTime.day" class="inline-block px-2 py-1 rounded-md m-1"
                            :class="i.work.arr.includes(j) ? 'bg-blue-600 text-white' : ' bg-slate-400/40'"
                            @click="i.work.arr.includes(j) ? i.work.arr.splice(i.work.arr.indexOf(j), 1) : i.work.arr.push(j)">
                            {{ j }}&nbsp;
                        </span>
                        <br>
                        <br>
                        <!-- <p>{{ i.work.arr.toString() }}</p> -->
                        调度背景颜色:<input type="color" v-model="i.bgColor" />
                        调度文字颜色:<input type="color" v-model="i.color" />
                    </div>

                </div>
            </TransitionGroup>
            <br>
            <button @click="setTask" >提交</button>
            <!--@vue-ignore-->
        </div>
    </div>
</template>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

.trans {
    outline: 2px solid rgba(37, 99, 235, 0.6);
    margin-top: 1rem;
    padding: 1rem;
    border-radius: .5rem;
}

.warning {
    background-color: rgba(255, 0, 0, 0.627);
    color: white;
}

.warning::placeholder {
    color: white;
}

.warningtext {
    border: 1px;
    color: red;
}

textarea {
    border: 2px solid rgba(37, 99, 235, 0.6);
    background-color: transparent;
    border-radius: .5rem;
    padding: .5rem;
    width: 80%;
    resize: vertical;
    line-height: 1.25rem;
}

textarea:focus-within {
    outline: 2px solid rgba(0, 106, 255, 0.541);
}

button {
    color: white;
    border-radius: 0.25rem;
    padding: .4rem .8rem;
    background-color: rgb(37 99 235)
}

input {
    padding: 2px .5rem;
    text-align: center;
    margin: 0 1rem;
    background-color: transparent;
    margin-bottom: 1rem;
    border-bottom: 1.5px solid rgba(0, 106, 255, 0.541);
}

#title {
    text-align: start;
    width: 50%;
    margin-left: auto;
    border: 0;
}

#title:focus-within {
    border-bottom: 2px solid rgba(37, 99, 235, 0.6);
    ;
}

input[type="number"] {
    max-width: 3rem;
    appearance: textfield;
}
</style>