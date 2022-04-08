/*
 * :Author: June
 * :Date: 2022-03-30 01:02:22
 * :LastEditTime: 2022-03-30 16:58:38
 * :Description:
 */
import { getToken } from '@/utils/auth.js'

export default function routerEach(router) {
    const whiteList = ['/login']
    router.beforeEach(async (to, from, next) => {
        const hasToken = getToken()
        if (hasToken) {
            if (to.path === '/login') {
                next({ path: '/dashboard' })
            } else {
                next()
            }
        } else if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    })
}
