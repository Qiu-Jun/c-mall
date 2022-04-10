'use strict'
const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')
// 管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole')
const Controller = require('egg').Controller

class UploadController extends Controller {
    async upload() {
        const { ctx } = this
        const parts = ctx.multipart()
        const part = await parts()
        if (part) {
            // part 是上传的文件流
            if (part.length) {
                // 这是 busboy 的字段
                // console.log('field: ' + part[0]);
                // console.log('value: ' + part[1]);
                // console.log('valueTruncated: ' + part[2]);
                // console.log('fieldnameTruncated: ' + part[3]);
            } else {
                if (!part.filename) {
                    // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
                    return ctx.fail({ code: 101, msg: '请选择文件' })
                }

                try {
                    const fileName = `${dayjs(Date.now()).format(
                        'YYYYMMDD'
                    )}-${ctx.helper.uuidv1()}.${part.mime.split('/')[1]}`
                    // 创建可写流
                    const writerStream = fs.createWriteStream(
                        path.join(
                            this.config.baseDir,
                            `app/public/upload/${fileName}`
                        )
                    )
                    // 目标写入流
                    part.pipe(writerStream)
                    ctx.body = `http://127.0.0.1:7001/public/upload/${fileName}`
                } catch (err) {
                    await sendToWormhole(part)
                    throw err
                }
            }
        }
    }
}

module.exports = UploadController
