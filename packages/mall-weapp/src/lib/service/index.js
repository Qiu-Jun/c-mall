function valiteOps(ops) {
  if (!ops.url) return console.log('请求地址不能为空')
  const config = {
    url: `${baseUrl + ops.url}`,
    header: {
      token: 'xxxx'
    },
    data: {},
    method: ops.method ? ops.method.toUpperCase() : 'GET',
    showLoading: ops.showLoading ? ops.showLoading : true
  }
  if (ops.data) {
    Object.assign(config.data, options.data)
  }
  return config
}

export function request(options = {}) {
  const config = valiteOps(options)
  console.log(config)
  return new Promise((resolve, reject) => {
    if (config.showLoading) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
    }
    wx.request({
      ...config,
      success: (res) => {
        const statusCode = res.statusCode
        if (statusCode === 200) {
          // 根据实际情况封装responce
          console.log(res.data)
          const { code, data: resData, rep_msg: msg } = res.data
          if (code === 10) {
            resolve(resData)
          } else {
            Toast({ title: msg || '异常' })
            reject(resData)
          }
        } else if (statusCode === 404) {
          return Toast({ title: '请求地址不存在' })
        } else {
          return Toast({ title: '请求地址不存在' })
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
          wx.hideLoading()
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
    wx.uploadFile({
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
