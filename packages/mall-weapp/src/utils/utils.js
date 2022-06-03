// 获得字符串实际长度，中文2，英文1
export function getStrRealLen(str = '') {
    let realLength = 0
    let charCode = -1
    const len = str.length

    for (let i = 0; i < len; i += 1) {
        charCode = str.charCodeAt(i)
        if (charCode >= 0 && charCode <= 128) realLength += 1
        else realLength += 2
    }
    return realLength
}
