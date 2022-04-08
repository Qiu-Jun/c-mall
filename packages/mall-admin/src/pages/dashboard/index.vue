<!--
 * :Author: June
 * :Date: 2022-03-07 02:12:16
 * :LastEditTime: 2022-03-24 17:38:22
 * :Description:
-->
<template>
    <div class="home">
        <h3 class="home-title">今日订单</h3>
        <el-card class="status-card">
            <el-row type="flex" :gutter="0" justify="space-around">
                <el-col :span="6" class="border-right-1">
                    <div class="status-card-box">
                        <i
                            class="iconfont icon-daifukuan status-card-box__icon text-red"
                        ></i>
                        <div class="status-card-box__title">
                            <span>待付款</span>
                            <el-progress
                                class="status-card-box__progress"
                                :percentage="initialPercentage"
                                :show-text="false"
                                color="#FF5B5B"
                            ></el-progress>
                        </div>
                        <span class="status-card-box__value text-red">{{
                            statusQtyMap.initial || 0
                        }}</span>
                    </div>
                </el-col>
                <el-col :span="6" class="border-right-1">
                    <div class="status-card-box">
                        <i
                            class="iconfont icon-daifahuo status-card-box__icon text-primary"
                        ></i>
                        <div class="status-card-box__title">
                            <span>待发货</span>
                            <el-progress
                                class="status-card-box__progress"
                                :percentage="auditedPercentage"
                                :show-text="false"
                                color="#5C9ACF"
                            ></el-progress>
                        </div>
                        <span class="status-card-box__value text-primary">{{
                            statusQtyMap.audited || 0
                        }}</span>
                    </div>
                </el-col>
                <el-col :span="6" class="border-right-1">
                    <div class="status-card-box">
                        <i
                            class="iconfont icon-daishouhuo status-card-box__icon text-green"
                        ></i>
                        <div class="status-card-box__title">
                            <span>待收货</span>
                            <el-progress
                                class="status-card-box__progress"
                                :percentage="dispatchingPercentage"
                                :show-text="false"
                                color="#1cc09f"
                            ></el-progress>
                        </div>
                        <span class="status-card-box__value text-green">{{
                            statusQtyMap.dispatching || 0
                        }}</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="status-card-box">
                        <i
                            class="iconfont icon-yiwancheng status-card-box__icon text-dark-gray"
                        ></i>
                        <div class="status-card-box__title">
                            <span>已完成</span>
                            <el-progress
                                class="status-card-box__progress"
                                :percentage="completedPercentage"
                                :show-text="false"
                                color="#666666"
                            ></el-progress>
                        </div>
                        <span class="status-card-box__value text-dark-gray">{{
                            statusQtyMap.completed || 0
                        }}</span>
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <h3 class="home-title">近7天订单</h3>
        <el-row type="flex" :gutter="20">
            <el-col :span="12">
                <el-card class="chart-card">
                    <div>订单数</div>
                    <div style="width: 100%; height: 300px">
                        <c-echart :chartOps="weekData.chartOrderQtyData" />
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <div>订单金额</div>
                    <div style="width: 100%; height: 300px">
                        <c-echart :chartOps="weekData.chartOrderAmountData" />
                    </div>
                </el-card> </el-col
        ></el-row>
        <el-row type="flex" :gutter="20">
            <el-col :span="12">
                <el-card class="chart-card">
                    <div>订购商品数</div>
                    <div style="width: 100%; height: 300px">
                        <c-echart :chartOps="weekData.chartGoodsQtyData" />
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card>
                    <div>收款金额</div>
                    <div style="width: 100%; height: 300px">
                        <c-echart
                            :chartOps="weekData.chartOrderReceiptAmountData"
                        />
                    </div>
                </el-card> </el-col
        ></el-row>
    </div>
</template>

<script>
import { defineComponent, ref, computed, reactive } from 'vue'
import { round } from 'lodash-es'
import cEchart from '@/components/c-echart/index.vue'
import { getForDay, getForWeek } from '@/apis/statistics'

export default defineComponent({
    name: 'Dashboard',
    components: { cEchart },
    setup() {
        const statusQtyMap = ref({
            initial: 0,
            audited: 0,
            dispatching: 0,
            completed: 0
        })
        const initialPercentage = computed(() => {
            const { initial = 0, total = 0 } = statusQtyMap.value
            return round((initial * 100) / total, 0) || 0
        })
        const auditedPercentage = computed(() => {
            const { audited = 0, total = 0 } = statusQtyMap.value
            return round((audited * 100) / total, 0) || 0
        })
        const dispatchingPercentage = computed(() => {
            const { dispatching = 0, total = 0 } = statusQtyMap.value
            return round((dispatching * 100) / total, 0) || 0
        })
        const completedPercentage = computed(() => {
            const { completed = 0, total = 0 } = statusQtyMap.value
            return round((completed * 100) / total, 0) || 0
        })

        getForDay().then(({ code, data }) => {
            if (code === 200) {
                statusQtyMap.value = data
            }
        })

        const weekData = reactive({
            chartOrderQtyData: {
                xAxis: {
                    type: 'category',
                    data: []
                },
                tooltip: {
                    trigger: 'axis'
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                ]
            },
            chartOrderAmountData: {
                xAxis: {
                    type: 'category',
                    data: []
                },
                tooltip: {
                    trigger: 'axis'
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                ]
            },
            chartGoodsQtyData: {
                xAxis: {
                    type: 'category',
                    data: []
                },
                tooltip: {
                    trigger: 'axis'
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                ]
            },
            chartOrderReceiptAmountData: {
                xAxis: {
                    type: 'category',
                    data: []
                },
                tooltip: {
                    trigger: 'axis'
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [],
                        type: 'line',
                        smooth: true
                    }
                ]
            }
        })
        getForWeek().then(({ code, data }) => {
            if (code === 200) {
                const dataArr = []
                Object.entries(data).forEach((item) => {
                    const { 0: day, 1: obj = {} } = item
                    const {
                        goodsTotalQty = 0,
                        paymentAmount = 0,
                        totalAmount = 0,
                        orderQty = 0
                    } = obj
                    dataArr.push(day)
                    weekData.chartOrderQtyData.series[0].data.push(orderQty)
                    weekData.chartOrderAmountData.series[0].data.push(
                        totalAmount
                    )
                    weekData.chartGoodsQtyData.series[0].data.push(
                        goodsTotalQty
                    )
                    weekData.chartOrderReceiptAmountData.series[0].data.push(
                        paymentAmount
                    )
                })
                weekData.chartOrderQtyData.xAxis.data = dataArr
                weekData.chartOrderAmountData.xAxis.data = dataArr
                weekData.chartGoodsQtyData.xAxis.data = dataArr
                weekData.chartOrderReceiptAmountData.xAxis.data = dataArr
            }
        })

        return {
            statusQtyMap,
            initialPercentage,
            auditedPercentage,
            dispatchingPercentage,
            completedPercentage,
            weekData
        }
    }
})
</script>

<style lang="scss" scoped>
.home {
    .home-title {
        margin-bottom: 20px;
        color: $--color-dark-gray;
        font-size: 20px;
        font-weight: bold;
        margin-left: 20px;

        &:not(:first-child) {
            margin-top: 30px;
        }
    }
    .status-card {
        .el-card__body {
            padding: 20px 0;
        }

        .status-card-box {
            padding: 20px;
            text-align: center;

            .status-card-box__icon {
                font-size: 36px;
                vertical-align: middle;
            }

            .status-card-box__title {
                display: inline-block;
                margin: 0 20px;
                color: $--color-dark-gray;
                min-width: 4em;
                vertical-align: middle;
            }

            .status-card-box__progress {
                margin-top: 15px;
            }

            .status-card-box__value {
                font-size: 24px;
                font-weight: bold;
                vertical-align: middle;
            }
        }
    }

    .chart-card {
        margin-bottom: 20px;
    }
    .border-right-1 {
        border-right: 1px solid #e9ecf3;
    }
}
</style>
