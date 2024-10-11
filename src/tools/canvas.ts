import { type todayTransaction } from "@/stores/today";
import { computed, ref } from "vue";
import { todayData } from "@/stores/today";

interface canvasConfig {
    canvas: HTMLCanvasElement
    // callback: Function
    derta: number
    ratio: number
    fontRatio: number
    height: number
}
const green  = '#1ABC9C', red = '#e74c3c', blue = '#3498DB',normal = '#5d6d7e'
// 绘制内容配置
let transactionH = 40
// 绘制配置
let canvasWidth = 0, canvasHeight = 0, canvasRootHeight = 0, ratio = 1, fontRatio = 1;
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D;
// 私有
let curFontSize = 0;

// 鼠标参数
let mousePositionX = ref(0)
let mousePositionY = 0;
let timePosition = ref(0)
let mouseClickX = ref(0)
let mouseClickY = 0
let timeRel = 0
export function reset(height: number) {
    canvas.width = canvas.offsetWidth * ratio;
    canvasWidth = canvas.width
    canvas.height = height
    canvasHeight = canvas.height
    
}

export function useCanvas(config: canvasConfig) {

    // 画布和分辨率
    canvas = config.canvas
    ratio = config.ratio
    fontRatio = config.fontRatio
    // 校准像素和配置宽度高度

    reset(config.height)
    function e_reset(){
        reset(config.height)
    }
    window.addEventListener('resize',e_reset)
    // 监听滚动
    function lisent(e: WheelEvent) {
        e.preventDefault()
        canvasRootHeight += e.deltaY * 0.15
    }
    canvas.addEventListener('wheel', lisent)
    // 鼠标
    let last = 0;
    function handleMouseMove(event: MouseEvent) {
        const cur = new Date().getTime();
        const der = cur - last;
        if (der < 16) {
            return
        }
        last = cur;
        const rect = canvas.getBoundingClientRect();
        mousePositionX.value = (event.clientX - rect.left) * ratio // 鼠标相对于元素左边的偏移
        mousePositionY = (event.clientY - rect.top) * ratio
    }
    function handleMouseClick(event: MouseEvent){
        const rect = canvas.getBoundingClientRect();
        mouseClickX.value = (event.clientX - rect.left) * ratio // 鼠标相对于元素左边的偏移
        mouseClickY = (event.clientY - rect.top) * ratio
    }
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleMouseClick)
    // 时间指针
    function timeCursor() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const _d = startOfDay.getTime()
        const d = new Date().getTime();
        timeRel = d - _d;
        timePosition.value = timeRel / (24 * 3600000)
    }
    timeCursor()
    const a = setInterval(timeCursor, 1000);

    // 配置画布
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // 启动！
    let previousTimeStamp: number = 0;
    function loop(timestamp: number) {
        if (timestamp - previousTimeStamp > config.derta) {
            Draw(ctx)
            previousTimeStamp = timestamp;
        }
        window.requestAnimationFrame(loop);
    }
    loop(config.derta);
    // 注册销毁
    return {
        closeCanvas: () => {
            canvas.removeEventListener('wheel', lisent)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('click',handleMouseClick)
            clearInterval(a)
            window.removeEventListener('resize',e_reset)
        }
    }
}

function setFontStyle(size: number = 14, fontFamily: string = 'sans-serif', fontBoldStyle?: string) {
    let style = ''
    fontBoldStyle == undefined ? 0 : (style += fontBoldStyle + ' ')
    curFontSize = size * fontRatio
    style += (curFontSize + 'px ')
    style += fontFamily
    ctx.font = style
}
// function drawText(text: string, x: number, y: number, limit?: number) {
//     ctx.fillText(text, x, y + curFontSize, limit)
// }
function getRelativeTime(milscs: number) {
    const hour = Math.floor(milscs / 3600000);
    milscs -= hour * 3600000;
    const min = Math.floor(milscs / 60000);
    milscs -= min * 60000;
    const s = Math.floor(milscs / 1000);
    return {
        h: hour,
        m: min,
        s: s
    }
}

function Draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    drawBackGround(ctx);
    ctx.fillStyle = green
    ctx.fillRect(mousePositionX.value, 0, 1, canvasHeight)
    const t = getRelativeTime((mousePositionX.value / canvasWidth) * 3600000 * 24)
    ctx.fillText(`${t.h}:${t.m}:${t.s}`, mousePositionX.value, mousePositionY)

    ctx.fillStyle = red
    ctx.fillRect(mouseClickX.value, 0 ,1 ,canvasHeight)
    setFontStyle(28)
    const t2 = getRelativeTime((mouseClickX.value / canvasWidth) * 3600000 * 24)
    ctx.fillText(`${t2.h}:${t2.m}:${t2.s}`, mouseClickX.value, mouseClickY)
    ctx.fillStyle = blue
    ctx.fillRect(timePosition.value * canvasWidth, 0, 2, canvasHeight)
    drawTransaction(ctx, todayData.data);
}

function drawBackGround(ctx: CanvasRenderingContext2D) {
    const div = canvasWidth / 24;
    ctx.fillStyle = normal
    setFontStyle(28)
    for (let i = 0; i < 24; i++) {
        const w = div * i
        ctx.fillRect(w, 0, 1, canvasHeight)
        ctx.fillText(`${i}h`, w, canvasHeight)
    }
}
function drawTransaction(ctx: CanvasRenderingContext2D, todayData: todayTransaction[]) {
    setFontStyle(28)
    let t = [-1]
    todayData.forEach(i => {
        let row = 0
        let resolved = false;
        ctx.fillStyle = i.bgColor
        const h = transactionH
        const rx = i.getRelativeData().start * canvasWidth, w = i.getRelativeData().length * canvasWidth
        const ed = rx + w;
        for (let i = 0; i < t.length; i++) {
            if (t[i] < rx) {
                t[i] = ed;
                row = i
                resolved = true
                break;
            }
        }
        if (!resolved) {
            row = t.length;
            t.push(ed);
        }
        const ry = row * h + canvasRootHeight + row
        if (rx < mousePositionX.value && rx + w > mousePositionX.value) {
            ctx.fillStyle = green
        }else
        if (rx < mouseClickX.value && rx + w > mouseClickX.value) {
            ctx.fillStyle = red
        }else if (i.getRelativeData().start < timePosition.value && i.getRelativeData().end > timePosition.value) {
            ctx.fillStyle = blue
        } 
        ctx.fillRect(rx, ry, w, h);
        ctx.fillStyle = i.color
        ctx.fillText(i.title, rx, ry + h * 0.7, w)
    })
}
export const inRangeCurData = computed(() => todayData.data.filter((i) =>
    i.getRelativeData().start < timePosition.value && i.getRelativeData().end > timePosition.value)

)
export const inRangeSelectData = computed(() =>
    todayData.data.filter((i) => {
        const rx = i.getRelativeData().start * canvasWidth, w = i.getRelativeData().length * canvasWidth
        return rx < mouseClickX.value && rx + w > mouseClickX.value
    }))