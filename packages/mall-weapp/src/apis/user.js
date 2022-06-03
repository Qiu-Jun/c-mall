import { request } from '@/lib/service/index'

// login
export function userLogin(data) {
    return request({
        url: '/weapp/login',
        method: 'post',
        data
    })
}
