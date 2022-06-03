'use strict'

const Controller = require('egg').Controller

class MerchantController extends Controller {
    // 新增商家
    async saveNew() {
        const { ctx } = this
        try {
            const rule = {
                merchant: 'object'
            }
            ctx.validate(rule)
            const uuid = await ctx.service.user.merchant.saveNew(
                ctx.request.body
            )
            console.log(uuid)
            ctx.success({ data: { uuid } })
        } catch (error) {
            console.log(error)
            const { fields = {}, name } = error
            if (name === 'SequelizeUniqueConstraintError') {
                ctx.fail({
                    code: 101,
                    msg: `账号：${fields.userName} 的商家已存在`
                })
            } else {
                throw new Error(error)
            }
        }
    }

    // 修改商家
    async saveModify() {
        const { ctx } = this
        const rule = {
            merchant: 'object'
        }
        ctx.validate(rule)
        const uuid = await ctx.service.user.merchant.saveModify(
            ctx.request.body
        )
        ctx.success({ data: { uuid } })
    }

    // 获取商家分页列表
    async query() {
        const { ctx } = this
        const merchantData = await ctx.service.user.merchant.query(
            ctx.request.body
        )
        ctx.success({ data: merchantData })
    }

    // 根据uuid获取商家
    async get() {
        const { ctx } = this
        const { uuid } = ctx.query
        const merchant = await ctx.service.user.merchant.get(uuid)
        ctx.success({ data: merchant })
    }
}

module.exports = MerchantController
