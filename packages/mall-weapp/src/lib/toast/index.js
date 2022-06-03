/**
 * @param {Object} options 配置参数 参考微信
 * title *
 */
const Toast = (options) => {
    if (Object.prototype.toString.call(options) !== '[object Object]') return
    if (!options.title) {
        return uni.showToast({
            title: 'title不能为空',
            icon: 'none'
        })
    }
    uni.showToast({
        title: options.title || '',
        icon: 'none',
        duration: options.duration || 1500,
        mask: options.mask || true,
        success: () => {
            let timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
                options.cb && typeof options.cb === 'function' && options.cb()
            }, 500)
        }
    })
}

export default Toast
