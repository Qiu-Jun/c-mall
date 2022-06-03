import { getStorage } from '@/lib/storage/index'
import { userLogin } from '@/apis/user'

const state = {
    token: null,
    openId: getStorage('openId') || ''
}

const mutations = {
    SETTOKEN: (state, token) => {
        state.token = token
    },
    SETOPENID: (state, openId) => {
        state.openId = openId
    }
}

const actions = {
    login: async ({ commit }) => {
        uni.login({
            provider: 'weixin',
            success: async (res = {}) => {
                const { code } = res
                userLogin({ code }).then((result) => {
                    console.log(result)
                })
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
