/*
 * :Author: June
 * :Date: 2022-03-07 02:12:16
 * :LastEditTime: 2022-03-30 02:01:46
 * :Description:
 */
import service from '@/lib/servic'

export function userLogin(data) {
    return service({
        url: '/user/login',
        method: 'post',
        data
    })
}

export function userLogout() {
    return service({
        url: '/user/logout'
    })
}
