'use strict';
module.exports = (options, app) => {
  return async function auth(ctx, next) {
    if (ctx.path.indexOf('/weapp/') === 0) {
      // 微信小程序接口
      const sessionid = ctx.get('sessionid');
      const session =
                ctx.helper.JSONParse(
                  await app.redis.get('default').get(sessionid)
                ) || {};
      const { openId } = session;
      ctx.request.body.openId = openId;
      ctx.request.body = { ...ctx.request.body, ...ctx.query };
      if (openId) {
        await next();
      } else {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          msg: '尚未登录',
        };
      }
    } else {
      // 管理端接口
      const valid = await ctx.verifyToken();
      if (valid) {
        await next();
      }
    }
  };
};
