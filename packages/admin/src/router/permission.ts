/*
 * @Author: June
 * @Description: 
 * @Date: 2023-11-23 12:34:25
 * @LastEditors: June
 * @LastEditTime: 2023-11-23 12:34:29
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