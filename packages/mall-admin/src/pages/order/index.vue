<template>
    <el-card>
        <el-form
            class="filter-form"
            :inline="true"
            ref="filterFormRef"
            :model="filter"
        >
            <el-form-item label="关键字" prop="keywordsLike">
                <!-- @keyup.enter="query" -->
                <el-input
                    v-model.trim="filter.keywordsLike"
                    placeholder="单号 / 客户名称"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="下单日期" prop="daterange">
                <el-date-picker
                    v-model="filter.daterange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    teleported
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="filter.status" placeholder="状态" clearable>
                    <el-option
                        v-for="(label, key) in Constants.ORDER_STATUS"
                        :key="key"
                        :label="label"
                        :value="key"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="tableRef" :data="tableData">
            <el-table-column
                prop="createdTime"
                label="单号 / 下单时间"
                sortable="custom"
            >
                <template #default="scope">
                    <router-link
                        class="text-bold"
                        :to="{
                            name: 'orderDetail',
                            query: { orderUuid: scope.row.uuid }
                        }"
                    >
                        {{ scope.row.billNumber }}
                    </router-link>
                    <p class="text-gray lh-1">{{ scope.row.createdTime }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="customerName" label="客户" sortable="custom">
                <template #default="scope">
                    <p>{{ scope.row.customerName }}</p>
                    <p class="text-gray lh-1">
                        {{ scope.row.linkMan }}（{{ scope.row.linkPhone }}）
                    </p>
                </template>
            </el-table-column>
            <el-table-column
                prop="paymentAmount"
                label="商品金额"
                sortable="custom"
            >
                <template #default="scope">
                    <span
                        v-if="scope.row.paymentAmount"
                        class="text-red text-bold"
                        >¥ {{ scope.row.paymentAmount }}</span
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="deliveryTimeTypeName"
                label="交货时间"
                align="center"
            ></el-table-column>
            <el-table-column label="状态" align="center" width="100">
                <template #default="scope">
                    <span class="badge" :class="scope.row.statusClass">{{
                        scope.row.statusCN
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注"
                align="center"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                width="80"
                align="center"
            >
                <template #default="scope">
                    <el-button
                        v-if="scope.row.status === 'audited'"
                        type="text"
                        size="mini"
                        @click="dispatch(scope.row)"
                        >开始配送
                    </el-button>
                    <el-button
                        v-else-if="scope.row.status === 'dispatching'"
                        type="text"
                        size="mini"
                        @click="complete(scope.row)"
                        >完成
                    </el-button>
                    <span v-else>--</span>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                v-model:currentPage="pageParams.page"
                :page-size="pageParams.pageSize"
                :pager-count="11"
                :total="totalCount"
            /></div
    ></el-card>
</template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { Constants } from '@/config/constants'
import { orderQuery } from '@/apis/order'

export default defineComponent({
    name: 'order',

    setup() {
        const filterFormRef = ref(null)

        const pageParams = reactive({
            page: 1,
            pageSize: 10
        })
        const totalCount = ref(0)

        const filter = reactive({
            keywordsLike: '',
            daterange: [],
            status: ''
        })

        const tableRef = ref(null)
        const tableData = ref([])
        const queryOrder = () => {
            orderQuery({ pagination: pageParams, filter }).then(
                ({ code, data }) => {
                    if (code === 200) {
                        data.list.forEach((i) => {
                            i.statusClass =
                                Constants.ORDER_STATUS_CLASS[i.status]
                            i.statusCN = Constants.ORDER_STATUS[i.status]
                            i.createdTime = dayjs(i.createdTime).format(
                                'YYYY年MM月DD日'
                            )
                        })
                        totalCount.value = data.count
                        tableData.value = data.list
                    }
                }
            )
        }
        queryOrder()
        watch(() => pageParams.page, queryOrder)

        const handleSearch = () => {
            pageParams.page = 1
            queryOrder()
        }
        const handleReset = () => {
            filterFormRef.value.resetFields()
        }

        return {
            filterFormRef,
            filter,
            Constants,
            pageParams,
            totalCount,
            tableRef,
            tableData,
            handleSearch,
            handleReset
        }
    }
})
</script>
