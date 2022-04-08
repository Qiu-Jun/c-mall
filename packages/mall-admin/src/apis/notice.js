import service from '@/lib/servic'

// 全部标记为已读
export function readAll() {
    return service({
        url: '/notice/readAll'
    })
}

// 获取消息概况(5条)
export function overview() {
    return service({
        url: '/notice/overview'
    })
}

// 获取消息分页列表
export function query(params) {
    return service({
        url: 'notice/query',
        method: 'post',
        data: {
            pagination: params
        }
    })
}
