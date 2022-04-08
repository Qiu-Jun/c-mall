/*
 * :Author: June
 * :Date: 2022-03-07 02:12:16
 * :LastEditTime: 2022-03-30 15:31:56
 * :Description:
 */
import { constantRoutes } from '@/router/index.js'
import { defineStore } from 'pinia'

const usePermission = defineStore({
    id: 'permission',
    state: () => ({
        routes: [...constantRoutes]
    })
})

export default usePermission
