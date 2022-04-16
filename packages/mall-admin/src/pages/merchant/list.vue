<template>
    <el-card>
        <el-form
            class="filter-form"
            :inline="true"
            ref="filterFormRef"
            :model="filter"
        >
            <el-form-item label="关键字" prop="keywordsLike">
                <el-input
                    v-model.trim="filter.keywordsLike"
                    placeholder="账号/姓名/联系人/联系电话"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="filter.status" placeholder="状态" clearable>
                    <el-option
                        v-for="(label, key) in Constants.ENABLE_STATUS"
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

        <el-table :data="tableData">
            <el-table-column
                prop="userName"
                sortable="custom"
                label="账号"
            ></el-table-column>
            <el-table-column
                prop="name"
                sortable="custom"
                label="姓名"
            ></el-table-column>
            <el-table-column
                prop="linkMan"
                sortable="custom"
                label="联系人"
            ></el-table-column>
            <el-table-column
                prop="linkPhone"
                sortable="custom"
                label="联系电话"
            ></el-table-column>
            <el-table-column
                prop="servicePhone"
                sortable="custom"
                label="客服电话"
            ></el-table-column>
            <el-table-column
                prop="createdTime"
                sortable="custom"
                label="创建时间"
                width="180"
            ></el-table-column>
            <el-table-column label="状态" width="60">
                <template #default="scope">
                    <span :class="scope.row.statusClass">{{
                        scope.row.statusCN
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                width="60"
                align="center"
            >
                <template #default="scope">
                    <el-button
                        type="text"
                        @click="
                            $router.push({
                                name: 'merchantEdit',
                                query: { merchantUuid: scope.row.uuid }
                            })
                        "
                    >
                        编辑
                    </el-button>
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
            />
        </div>
    </el-card>
</template>

<script>
import { defineComponent, onActivated, reactive, ref } from 'vue'
import { Constants } from '@/config/constants'
import { merchantList } from '@/apis/merchant'
import dayjs from 'dayjs'

export default defineComponent({
    name: 'merchantList',

    setup() {
        const pageParams = reactive({
            page: 1,
            pageSize: 20
        })
        const totalCount = ref(0)

        const filterFormRef = ref(null)
        const filter = reactive({
            keywordsLike: '',
            status: ''
        })

        const tableData = ref([])
        const getList = () => {
            merchantList({ pagination: pageParams, filter }).then(
                ({ code, data }) => {
                    if (code === 200) {
                        data.list.forEach((i) => {
                            i.createdTime = dayjs(i.createdTime).format(
                                'YYYY-MM-DD'
                            )
                            i.statusClass =
                                Constants.ENABLE_STATUS_CLASS[+i.enableStatus]
                            i.statusCN =
                                Constants.ENABLE_STATUS[+i.enableStatus]
                        })
                        tableData.value = data.list
                        totalCount.value = data.count
                    }
                }
            )
        }
        getList()

        onActivated(() => {
            getList()
        })

        const handleSearch = () => getList()
        const handleReset = () => filterFormRef.value.resetFields()
        return {
            pageParams,
            totalCount,
            filterFormRef,
            filter,
            Constants,
            tableData,
            handleSearch,
            handleReset
        }
    }
})
</script>
