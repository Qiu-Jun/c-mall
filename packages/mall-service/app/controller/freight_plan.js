'use strict';

const Controller = require('egg').Controller;

class FreightPlanController extends Controller {
  // 新增运费方案
  async saveNew() {
    const { ctx } = this;
    const rule = {
      freightPlan: 'object',
    };
    ctx.validate(rule);
    const uuid = await ctx.service.freightPlan.saveNew(ctx.request.body);
    ctx.sussess({
      data: uuid,
    });
  }

  // 修改运费方案
  async saveModify() {
    const { ctx } = this;
    const rule = {
      freightPlan: 'object',
    };
    ctx.validate(rule);
    const uuid = await ctx.service.freightPlan.saveModify(ctx.request.body);
    ctx.sussess({
      data: {
        uuid,
      },
    });
  }

  // 删除运费方案
  async remove() {
    const { ctx } = this;
    const uuid = await ctx.service.freightPlan.remove(ctx.request.body);
    ctx.success({ data: { uuid } });
  }

  // 获取运费方案列表
  async query() {
    const { ctx } = this;
    const freightPlanData = await ctx.service.freightPlan.query(ctx.request.body);
    ctx.sussess({
      data: freightPlanData,
    });
  }

  // 根据uuid获取运费方案
  async get() {
    const { ctx } = this;
    const freightPlan = await ctx.service.freightPlan.get(ctx.request.body);
    ctx.success({
      data: freightPlan,
    });
  }

  // 设置默认运费方案
  async setDefault() {
    const { ctx } = this;
    const uuid = await ctx.service.freightPlan.setDefault(ctx.request.body);
    ctx.success({
      data: uuid,
    });
  }
}

module.exports = FreightPlanController;
