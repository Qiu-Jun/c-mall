<template>
    <div id="echarts" ref="echartsRef"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, watch, toRef } from 'vue'
import echarts from '@/lib/echarts/index'
import { debounce } from 'lodash-es'
import useApp from '@/store/modules/app'

const props = defineProps({
    chartOps: {
        type: Object,
        default: () => {}
    }
})

let chartInstance = null
const echartsRef = ref(null)
const draw = () => {
    props.chartOps && chartInstance && chartInstance.setOption(props.chartOps)
}
const resizeFn = () => chartInstance && chartInstance.resize()
const initChart = () => {
    chartInstance = echarts.init(echartsRef.value)
    window.addEventListener('resize', debounce(resizeFn, 300))
    draw()
}
watch(
    props.chartOps,
    debounce(() => {
        chartInstance.setOption(props.chartOps)
    }, 300)
)

const app = useApp()
const opened = toRef(app.sidebar, 'opened')
watch(opened, debounce(resizeFn, 300))

onMounted(initChart)
onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeFn)
})
</script>

<style scoped>
#echarts {
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
</style>
