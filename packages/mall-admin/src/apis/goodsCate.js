import service from '@/lib/servic'

// 新增类目
export function cateAdd(cate) {
    return service({
        url: '/goodsCategory/saveNew',
        method: 'post',
        data: cate
    })
}

// 修改类目
export function cateEdit(cate) {
    return service({
        url: '/goodsCategory/saveModify',
        method: 'post',
        data: cate
    })
}

// 删除类目
export function cateDelete(params) {
    return service({
        url: '/goodsCategory/remove',
        method: 'post',
        params
    })
}

// 获取类目列表
export function cateQuery(params) {
    return service({
        url: '/goodsCategory/query',
        method: 'post',
        data: params
    })
}

// 获取类别
export function cateGet(params) {
    return service({
        url: '/goodsCategory/get',
        params
    })
}
export function getDropdownList(params) {
    return service({
        url: '/goodsCategory/getDropdownList',
        params
    })
}
