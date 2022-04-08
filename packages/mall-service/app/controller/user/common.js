'use strict';

const Controller = require('egg').Controller;

class CommonController extends Controller {
  async login() {
    const { ctx, app } = this;
    const { userName, password, loginType } = ctx.request.body;
    let user;
    if (loginType === 'admin') {
      // 根据userName获取管理员
      user = await ctx.service.user.admin.getAdminByLogin(userName, password);
    } else {
      // 根据userName获取商家
      user = await ctx.service.user.merchant.getMerchantByLogin(userName, password);
    }
    if (app._.isEmpty(user)) {
      return ctx.fail({ code: 404, msg: '账号或密码错误' });
    }
    const { uuid: userUuid, userType, name, orgUuid } = user;
    const result = { name, userUuid, userName, userType, orgUuid };
    ctx.setToken(result);
    return ctx.success({ data: result });
  }

  /**
   * 注销
   */
  logout() {
    this.ctx.removeToken();
    this.success();
  }

  /**
   * 修改密码
   * @return {function|null} 注销结果
   */
  async savePasswordModify() {
    const { ctx } = this;
    const { userType } = ctx.request.body;
    const rule = {
      userUuid: 'string',
      oldPassword: 'string',
      newPassword: 'string',
    };

    ctx.validate(rule);

    if (userType === 'admin') {
      // 根据userName获取管理员
      await ctx.service.user.admin.savePasswordModify(ctx.request.body);
    } else {
      // 根据userName获取商家
      await ctx.service.user.merchant.savePasswordModify(ctx.request.body);
    }

    this.logout();
  }
}

module.exports = CommonController;
