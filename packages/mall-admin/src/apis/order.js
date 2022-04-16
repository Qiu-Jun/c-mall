import service from '@/lib/servic'

// 获取订单列表
export function orderQuery(params) {
    return service({
        url: '/bill/order/query',
        method: 'post',
        data: params
    })
}

// 获取订单详情
export function orderDetail(params) {
    return service({
        url: '/bill/order/get',
        params
    })
}

// 配送订单
export function orderDispatch(params) {
    return service({
        url: '/bill/order/dispatch',
        method: 'post',
        data: params
    })
}

// 完成订单
export function orderComplete(params) {
    return service({
        url: '/bill/order/complete',
        method: 'post',
        data: params
    })
}
