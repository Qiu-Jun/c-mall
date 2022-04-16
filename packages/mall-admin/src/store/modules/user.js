/*
 * :Author: June
 * :Date: 2022-03-07 13:03:58
 * :LastEditTime: 2022-03-30 16:59:03
 * :Description:
 */
import { userLogin } from '@/apis/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import router from '@/router/index'
import Cookie from 'js-cookie'

const useUser = defineStore({
    id: 'user',

    state: () => ({
        userInfo: {}, // 用户信息
        isReadAll: false, // 全部消息是否标记已读

        token: getToken(),
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
        menus: [],
        accesses: []
    }),

    actions: {
        setUser() {
            this.userInfo = {
                name: Cookie.get('name'),
                userUuid: Cookie.get('userUuid'),
                userName: Cookie.get('userName'),
                userType: Cookie.get('userType')
            }
        },

        readAll() {
            this.isReadAll = false
        },

        login(userData) {
            const { userName, password, loginType } = userData
            return new Promise((resolve, reject) => {
                userLogin({ userName: userName.trim(), password, loginType })
                    .then(({ code, data }) => {
                        if (code === 200) {
                            this.token = data
                            this.roles.push(data.userType)
                            setToken(data)
                            resolve()
                        }
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },

        logout() {
            this.token = ''
            this.roles = []
            this.menus = []
            Cookie.remove('userUuid')
            Cookie.remove('userName')
            Cookie.remove('userType')
            removeToken()
            router.replace({ path: '/login' })
        },

        resetToken() {
            return new Promise((resolve) => {
                this.token = ''
                this.roles = []
                this.menus = []
                removeToken()
                resolve()
            })
        }
    }
})

export default useUser
