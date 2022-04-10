'use strict'

const Controller = require('egg').Controller

class GoodsCategoryController extends Controller {
    // 新增类别
    async saveNew() {
        const { ctx } = this
        try {
            const rule = {
                goodsCategory: 'object'
            }
            ctx.validate(rule)
            const uuid = await ctx.service.goodsCategory.saveNew(
                ctx.request.body
            )
            ctx.success({
                data: { uuid }
            })
        } catch (error) {
            const { fields = {}, name } = error
            if (name === 'SequelizeUniqueConstraintError') {
                ctx.fail({
                    code: 101,
                    msg: `名称：${fields.name} 的类别已存在`
                })
            } else {
                throw new Error(error)
            }
        }
    }

    // 修改类别
    async saveModify() {
        const { ctx } = this
        const rule = {
            goodsCategory: 'object'
        }
        ctx.validate(rule)
        const uuid = await ctx.service.goodsCategory.saveModify(
            ctx.request.body
        )
        ctx.success({
            data: uuid
        })
    }

    // 删除类别
    async remove() {
        const { ctx } = this
        const { uuid } = ctx.request.body
        const goodsCount = await ctx.service.goods.countGoodsByCategory(uuid)
        if (!goodsCount > 0) {
            const uuid = await ctx.service.goodsCategory.remove(
                ctx.request.body
            )
            ctx.success({ data: { uuid } })
        } else {
            ctx.fail({ code: 402, msg: '该类别尚有商品在使用，无法删除！' })
        }
    }

    // 获取类别分页列表
    async query() {
        const { ctx } = this
        const goodsCategoryData = await ctx.service.goodsCategory.query(
            ctx.request.body
        )
        ctx.success({ data: goodsCategoryData })
    }

    // 获取类别下拉列表
    async getDropdownList() {
        const { ctx } = this
        const goodsCategoryList =
            await ctx.service.goodsCategory.getDropdownList(ctx.request.body)
        ctx.success({
            data: goodsCategoryList
        })
    }

    // 根据uuid获取类别
    async get() {
        const { ctx } = this
        const goodsCategory = await ctx.service.goodsCategory.get(
            ctx.request.body
        )
        ctx.success({ data: goodsCategory })
    }
}

module.exports = GoodsCategoryController
