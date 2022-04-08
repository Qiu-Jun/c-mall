
'use strict';

/**
 * @description 管理端的接口
 * @param {*} app
 */
module.exports = app => {
  const { router, controller } = app;
  // 账户相关
  router.post('/user/login', controller.user.common.login);
  router.get('/user/logout', controller.user.common.logout);
  router.post('/user/savePasswordModify', controller.user.common.savePasswordModify);

  // 消息通知
  router.get('/notice/readAll', controller.notice.readAll);
  router.get('/notice/overview', controller.notice.overview);
  router.post('/notice/query', controller.notice.query);

  // 商品类别
  // router.post('/goodsCategory/saveNew', goodsCategory.saveNew);
  // router.post('/goodsCategory/saveModify', goodsCategory.saveModify);
  // router.post('/goodsCategory/remove', goodsCategory.remove);
  // router.post('/goodsCategory/query', goodsCategory.query);
  router.get('/goodsCategory/getDropdownList', controller.goodsCategory.getDropdownList);
  // router.get('/goodsCategory/get', goodsCategory.get);

  // 统计
  router.get('/statistics/order/getForDay', controller.statistics.getForDay);
  router.get('/statistics/order/getForWeek', controller.statistics.getForWeek);
};
