import service from '@/lib/servic'

// 新增商家
export function merchantAdd(data) {
    return service({
        url: '/user/merchant/saveNew',
        method: 'post',
        data
    })
}

// 编辑商家
export function merchantEdit(data) {
    return service({
        url: '/user/merchant/saveModify',
        method: 'post',
        data
    })
}

// 商家列表
export function merchantList(data) {
    return service({
        url: '/user/merchant/query',
        method: 'post',
        data
    })
}

// 商家详情
export function merchantDetail(params) {
    return service({
        url: '/user/merchant/get',
        params
    })
}
