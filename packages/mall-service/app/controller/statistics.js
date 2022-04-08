'use strict';

const Controller = require('egg').Controller;

class StatisticsController extends Controller {
  // 获取今日订单数量统计
  async getForDay() {
    const { ctx } = this;
    const result = await ctx.service.statistics.getForDay(ctx.request.body);
    ctx.success({ data: result });
  }

  // 获取近七天订单统计
  async getForWeek() {
    const { ctx } = this;
    const result = await ctx.service.statistics.getForWeek(ctx.request.body);
    ctx.success({ data: result });
  }
}

module.exports = StatisticsController;
