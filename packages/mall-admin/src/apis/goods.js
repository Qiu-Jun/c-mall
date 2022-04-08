import service from '@/lib/servic'

// 获取类别
export function getDropdownList(params) {
    return service({
        url: 'goodsCategory/getDropdownList',
        data: params
    })
}

export function query() {}
