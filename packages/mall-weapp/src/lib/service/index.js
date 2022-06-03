import Toast from '@/lib/toast/index'
import constants from '@/config/constants'
import store from '@/store/index'
const baseUrl = 'http://127.0.0.1:7001'

function valiteOps(ops) {
    if (!ops.url) return console.log('请求地址不能为空')
    const config = {
        url: `${baseUrl + ops.url}`,
        header: {
            orgUuid: constants.MERCHANT_UUID,
            token: 'xxxx'
        },
        data: {},
        method: ops.method ? ops.method.toUpperCase() : 'GET',
        showLoading: ops.showLoading ? ops.showLoading : true
    }
    if (ops.data) {
        Object.assign(config.data, ops.data)
    }
    return config
}

export function request(options = {}) {
    const config = valiteOps(options)
    return new Promise((resolve, reject) => {
        if (config.showLoading) {
            uni.showLoading({
                title: '加载中...',
                mask: true
            })
        }
        uni.request({
            ...config,
            success: (res) => {
                const statusCode = res.statusCode
                if (statusCode === 200) {
                    const { code, data: resData, msg } = res.data
                    switch (code) {
                        case 200:
                            resolve(resData)
                            break
                        case 101:
                            uni.showModal({
                                title: '提示',
                                content: msg,
                                showCancel: false,
                                success: () => {
                                    wx.exitMiniProgram()
                                }
                            })
                            break
                        case 401:
                            store.dispatch('user/login')
                            break
                        default:
                            break
                    }
                } else if (statusCode === 404) {
                    return Toast({ title: '请求地址不存在' })
                } else {
                    return Toast({ title: '请求失败' })
                }
            },
            fail: (err) => {
                console.log(err)
                Toast({ title: '请求失败' })
                reject({
                    status: false,
                    data: null,
                    msg: err.errMsg
                })
            },
            complete: () => {
                if (config.showLoading) {
                    uni.hideLoading()
                }
            }
        })
    })
}

// 上传文件
export function uploadFile(options = {}) {
    const config = valiteOps(options)
    console.log(config)
    Object.assign(config.header, {
        name: 'file'
    }) // 单独添加header
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            ...config,
            success(res) {
                if (res.statusCode === 200) {
                    const data =
                        res.data && typeof res.data === 'string'
                            ? JSON.parse(res.data)
                            : res.data
                    if (data.stat === 1) {
                        resolve({
                            status: true,
                            data: data.data,
                            msg: 'success'
                        })
                    } else {
                        resolve({
                            status: false,
                            data: null,
                            msg: data.msg
                        })
                    }
                }
            },
            fail: (err) => {
                console.log(err)
                toast({ title: '请求失败' })
                reject({
                    code: 101,
                    msg: err,
                    data: null
                })
            }
        })
    })
}
