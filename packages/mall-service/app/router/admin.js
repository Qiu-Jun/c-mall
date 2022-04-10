'use strict'

/**
 * @description 管理端的接口
 * @param {*} app
 */
module.exports = (app) => {
    const { router, controller } = app
    // 账户相关
    router.post('/user/login', controller.user.common.login)
    router.get('/user/logout', controller.user.common.logout)
    router.post(
        '/user/savePasswordModify',
        controller.user.common.savePasswordModify
    )

    // 消息通知
    router.get('/notice/readAll', controller.notice.readAll)
    router.get('/notice/overview', controller.notice.overview)
    router.post('/notice/query', controller.notice.query)

    // 商品
    router.post('/goods/saveNew', controller.goods.saveNew)
    router.post('/goods/saveModify', controller.goods.saveModify)
    router.post('/goods/up', controller.goods.up)
    router.post('/goods/down', controller.goods.down)
    router.post('/goods/query', controller.goods.query)
    router.get('/goods/get', controller.goods.get)

    // 商品类别
    router.post('/goodsCategory/saveNew', controller.goodsCategory.saveNew)
    router.post(
        '/goodsCategory/saveModify',
        controller.goodsCategory.saveModify
    )
    router.post('/goodsCategory/remove', controller.goodsCategory.remove)
    router.post('/goodsCategory/query', controller.goodsCategory.query)
    router.get(
        '/goodsCategory/getDropdownList',
        controller.goodsCategory.getDropdownList
    )
    router.get('/goodsCategory/get', controller.goodsCategory.get)

    // 统计
    router.get('/statistics/order/getForDay', controller.statistics.getForDay)
    router.get('/statistics/order/getForWeek', controller.statistics.getForWeek)
}
