import service from '@/lib/servic'

// 新增运费方案
export function deliveryCaseAdd(params) {
    return service({
        url: '/freightPlan/saveNew',
        method: 'post',
        data: params
    })
}

// 保存运费方案修改
export function deliveryCaseEdit(data) {
    return service({
        url: '/freightPlan/saveModify',
        method: 'post',
        data
    })
}

// 删除运费方案
export function deliveryCaseDel(params) {
    return service({
        url: '/freightPlan/remove',
        method: 'post',
        params
    })
}

// 获取分页运费方案列表
export function deliveryCaseList(params) {
    return service({
        url: '/freightPlan/query',
        method: 'post',
        data: params
    })
}

// 获取运费方案
export function deliveryCaseDetail(params) {
    return service({
        url: '/freightPlan/get',
        method: 'post',
        params
    })
}

// 新增送货时间
export function deliveryTimeAdd(params) {
    return service({
        url: '/deliveryTimeType/saveNew',
        method: 'post',
        data: params
    })
}

// 保存送货时间修改
export function deliveryTimeEdit(params) {
    return service({
        url: '/deliveryTimeType/saveModify',
        method: 'post',
        data: params
    })
}

// 删除送货时间
export function deliveryTimeDel(params) {
    return service({
        url: '/deliveryTimeType/remove',
        method: 'post',
        data: params
    })
}

// 获取分页送货时间列表
export function deliveryTimeList(params) {
    return service({
        url: '/deliveryTimeType/query',
        method: 'post',
        data: params
    })
}

// 获取送货时间
export function deliveryTimeDetail(params) {
    return service({
        url: '/deliveryTimeType/get',
        params
    })
}
