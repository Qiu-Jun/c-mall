import { request } from '@/lib/service/index'

// 带类别获取商品类别
export function getGoodsWidthCate(data) {
    return request({
        url: '/weapp/getGoodsWithCategory',
        data
    })
}
