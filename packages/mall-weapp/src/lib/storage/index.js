/**
 * getStorage
 * @desc 获取存储的本地数据
 * @param { keyName }
 * @return { storageVal }
 */
export function getStorage(key) {
    const val = uni.getStorageSync(key) || ''
    return val ? JSON.parse(val) : ''
}

/**
 * setStorage
 * @desc 设置本地存储数据(同步)
 * @param { String } key
 * @param { any } val
 */
export function setStorage(key, val) {
    const value = JSON.stringify(val)
    return uni.setStorageSync(key, value)
}

/**
 * setStorage
 * @desc 设置本地存储数据(异步))
 * @param { String } key
 * @param { any } val
 */
export function setStorageAsync(key, val) {
    const value = JSON.stringify(val)
    uni.setStorage({
        key,
        data: value
    })
}

/**
 * removeStorage
 * @desc 移除本地存储数据
 * @param { String } storage_key
 */
export function removeStorage(storage_key) {
    try {
        return uni.removeStorageSync(storage_key)
    } catch (e) {
        console.log(`移除失败${e}`)
    }
}
