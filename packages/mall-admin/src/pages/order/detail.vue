<template>
    <el-card>
        <header class="order-header">
            <div>
                <span class="order-header-title"
                    >单号：{{ order.billNumber || '' }}</span
                >
                <span class="badge" :class="order.statusClass">{{
                    order.statusCN || ''
                }}</span>
            </div>
            <p class="order-header-time">
                下单时间：{{ order.createdTime || '' }}
            </p>
        </header>

        <el-row class="mt-20">
            <h2 class="content-title">
                <i class="el-icon-tickets"></i> 订单信息
            </h2>
            <section class="order-panel">
                <el-row type="flex">
                    <el-col :span="8" class="plr-20 border-right-1">
                        <p>
                            <span class="order-panel-label">订货总量：</span>
                            <span class="text-bold">{{
                                order.goodsTotalQty || ''
                            }}</span>
                        </p>
                        <p>
                            <span class="order-panel-label">订单金额：</span>
                            <span class="text-bold"
                                >¥ {{ order.totalAmount || '' }}</span
                            >
                        </p>
                        <p>
                            <span class="order-panel-label">基础运费：</span>
                            <span class="text-bold"
                                >¥ {{ order.freightAmount || '' }}</span
                            >
                        </p>
                        <p>
                            <span class="order-panel-label">加急费：</span>
                            <span class="text-bold"
                                >¥
                                {{
                                    order.deliveryTimeTypeSurcharge || ''
                                }}</span
                            >
                        </p>
                        <p>
                            <span class="order-panel-label">减免金额：</span>
                            <span class="text-red text-bold"
                                >¥ {{ order.reductionAmount || '' }}</span
                            >
                        </p>
                        <p>
                            <span class="order-panel-label">实付金额：</span>
                            <span class="text-red text-bold"
                                >¥ {{ order.paymentAmount || '' }}</span
                            >
                        </p>
                    </el-col>
                    <el-col :span="8" class="plr-20 border-right-1">
                        <p class="order-panel-nickname">
                            {{ order.customerName || '' }}
                        </p>
                        <p>
                            <span class="order-panel-label">收货人：</span>
                            <span>{{ order.linkMan || '' }}</span>
                        </p>
                        <p>
                            <span class="order-panel-label">联系电话：</span>
                            <span>{{ order.linkPhone || '' }}</span>
                        </p>
                        <p>
                            <span class="order-panel-label">收货地址：</span>
                            <span>{{ order.address || '' }}</span>
                        </p>
                    </el-col>
                    <el-col :span="8" class="plr-20">
                        <p>
                            <span class="order-panel-label">配送时间：</span>
                            <span
                                >{{ order.deliveryTimeTypeName || '' }}（{{
                                    order.deliveryTimeTypeRemark || ''
                                }}）</span
                            >
                        </p>
                        <p>
                            <span class="order-panel-label">备注：</span>
                            <span>{{ order.remark || '' }}</span>
                        </p>
                    </el-col>
                </el-row>
            </section>
        </el-row>

        <el-row class="mt-20">
            <h2 class="content-title">
                <i class="el-icon-goods"></i> 商品清单
            </h2>
            <el-table
                :data="order.lines"
                header-cell-class-name="table-header-cell-gray"
            >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column label="名称">
                    <template #default="scope">
                        <div class="flex-y-center">
                            <safe-img
                                :src="scope.row.goodsPic"
                                width="30px"
                                height="30px"
                            ></safe-img>
                            <span class="ml-15 text-bold">{{
                                scope.row.goodsName
                            }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="goodsCategoryName"
                    label="类别"
                    align="center"
                    >类别</el-table-column
                >
                <el-table-column
                    prop="unitName"
                    label="单位"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="goodsSpec"
                    label="规格"
                    align="center"
                ></el-table-column>
                <el-table-column
                    prop="goodsQty"
                    label="订购数"
                    align="center"
                ></el-table-column>
                <el-table-column label="售价" align="center">
                    <template v-slot="scope">
                        <span
                            v-if="scope.row.salePrice"
                            class="text-red text-bold"
                            >¥ {{ scope.row.salePrice }}</span
                        >
                    </template>
                </el-table-column>
                <el-table-column label="金额小计" align="center">
                    <template v-slot="scope">
                        <span
                            v-if="scope.row.salePrice && scope.row.goodsQty"
                            class="text-red text-bold"
                            >¥ {{ getSubTotal(scope.row) }}</span
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
            </el-table>
        </el-row>
    </el-card>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { orderDetail } from '@/apis/order'
import dayjs from 'dayjs'
import { Constants } from '@/config/constants'
import { round, multiply } from 'lodash-es'

export default defineComponent({
    name: 'orderDetail',

    setup() {
        // 路由
        const route = useRoute()

        // 获取商品
        const order = reactive({
            billNumber: '',
            status: ''
        })
        const getGoodsDetail = () => {
            orderDetail({ uuid: route.query.orderUuid }).then(
                ({ code, data }) => {
                    if (code === 200) {
                        data.createdTime = dayjs(data.createdTime).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                        data.statusClass =
                            Constants.ORDER_STATUS_CLASS[data.status]
                        data.statusCN = Constants.ORDER_STATUS[data.status]
                        Object.assign(order, data)
                    }
                }
            )
        }
        getGoodsDetail()

        const getSubTotal = (data = {}) => {
            const { salePrice, goodsQty } = data
            return round(multiply(salePrice, goodsQty), 2)
        }

        return { order, getSubTotal }
    }
})
</script>

<style lang="scss" scoped>
.order-header {
    line-height: 1.5;

    .order-header-title {
        margin-right: 15px;
        font-size: 18px;
        font-weight: bold;
        vertical-align: middle;
    }

    .order-header-time {
        font-size: 13px;
    }
}

.order-panel {
    width: 100%;
    font-size: 14px;
    line-height: 2;

    .order-panel-label {
        display: inline-block;
        padding-right: 0.5em;
        width: 5.5em;
        text-align: right;
    }

    .order-panel-nickname {
        font-size: 18px;
        font-weight: bold;
    }
}
</style>
