import service from '@/lib/servic'

// 获取今日订单数量统计
export function getForDay() {
    return service({
        url: '/statistics/order/getForDay'
    })
}

// 获取近七天订单统计
export function getForWeek() {
    return service({
        url: '/statistics/order/getForWeek'
    })
}
