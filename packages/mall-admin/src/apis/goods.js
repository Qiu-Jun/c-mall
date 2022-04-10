import service from '@/lib/servic'

export function query(params) {
    return service({
        url: '/goods/query',
        method: 'post',
        data: params
    })
}

// 上架
export function up(params) {
    return service({
        url: '/goods/up',
        method: 'post',
        data: params
    })
}

// 下架
export function down(params) {
    return service({
        url: '/goods/down',
        method: 'post',
        data: params
    })
}

// 商品详情
export function goodsDetail(params) {
    return service({
        url: '/goods/get',
        params
    })
}

// 修改商品
export function goodsEdit(goods) {
    return service({
        url: '/goods/saveModify',
        method: 'post',
        data: goods
    })
}

// 添加商品
export function goodsAdd(goods) {
    return service({
        url: '/goods/saveNew',
        method: 'post',
        data: goods
    })
}
