<template>
    <el-card>
        <el-form
            class="filter-form"
            ref="filterForm"
            :inline="true"
            :model="filter"
        >
            <el-form-item label="名称" prop="keywordsLike">
                <el-input
                    v-model="filter.keywordsLike"
                    placeholder="商品名称"
                    clearable
                    @keyup.enter="query"
                ></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="categoryUuid">
                <el-select
                    v-model="filter.categoryUuid"
                    placeholder="类别"
                    clearable
                >
                    <el-option
                        v-for="item in categoryList"
                        :key="item.uuid"
                        :label="item.name"
                        :value="item.uuid"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="filter.status" placeholder="状态" clearable>
                    <el-option
                        v-for="(label, key) in Constants.GOODS_STATUS"
                        :key="key"
                        :label="label"
                        :value="key"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handelSearch">查询</el-button>
                <el-button @click="handleResetForm">重置</el-button>
                <router-link
                    class="ml-15 text-bold"
                    :to="{
                        name: 'goodsAdd'
                    }"
                >
                    <el-button>新增商品</el-button>
                </router-link>
            </el-form-item>
        </el-form>

        <el-table ref="defaultTable" :data="tableData" empty-text="暂无商品">
            <el-table-column
                prop="name"
                sortable="custom"
                label="名称"
                min-width="300"
            >
                <template #default="scope">
                    <div class="flex-y-center">
                        <safe-img
                            :src="scope.row.thumbnail"
                            width="60px"
                            height="60px"
                        ></safe-img>
                        <router-link
                            class="ml-15 text-bold"
                            :to="{
                                name: 'goodsView',
                                query: { goodsUuid: scope.row.uuid }
                            }"
                        >
                            {{ scope.row.name }}
                        </router-link>
                    </div></template
                >
            </el-table-column>
            <el-table-column prop="salePrice" sortable="custom" label="售价">
                <template v-slot="scope">
                    <span v-if="scope.row.salePrice" class="text-red text-bold"
                        >¥ {{ scope.row.salePrice }}</span
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="categoryName"
                label="类别"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="unitName"
                sortable="custom"
                label="单位"
            ></el-table-column>
            <el-table-column
                prop="spec"
                sortable="custom"
                label="规格"
            ></el-table-column>
            <el-table-column label="状态" align="center">
                <template #default="scope">
                    <span class="badge" :class="scope.row.statusClass">
                        {{ scope.row.statusCN }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                width="100"
                align="center"
            >
                <template #default="scope">
                    <el-button type="text" @click="handleEdit(scope.row)">
                        编辑
                    </el-button>
                    <el-button
                        v-if="scope.row.status === 'down'"
                        class="success-text-btn"
                        type="text"
                        @click="handleUpGoods(scope.row)"
                    >
                        上架
                    </el-button>
                    <el-button
                        v-if="scope.row.status === 'up'"
                        class="danger-text-btn"
                        type="text"
                        @click="handleDownGoods(scope.row)"
                    >
                        下架
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
import { defineComponent, reactive, ref, onActivated, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash-es'
import { useRouter } from 'vue-router'
import { query, up, down } from '@/apis/goods'
import { getDropdownList } from '@/apis/goodsCate'
import { Constants } from '@/config/constants'

export default defineComponent({
    name: 'goodsManage',

    setup() {
        const router = useRouter()
        const totalCount = ref(0)
        const pageParams = reactive({
            page: 1,
            pageSize: 10
        })

        const filterForm = ref(null)
        const filter = reactive({
            keywordsLike: '',
            categoryUuid: '',
            status: ''
        })

        const categoryList = ref([])
        const getCates = () => {
            getDropdownList().then(({ code, data }) => {
                if (code === 200) {
                    categoryList.value = data
                }
            })
        }
        getCates()

        const tableData = ref([])
        const getGoods = () => {
            const params = { pagination: pageParams, filter }
            query(params).then(({ code, data }) => {
                if (code === 200) {
                    data.list.forEach((i) => {
                        i.statusClass = Constants.GOODS_STATUS_CLASS[i.status]
                        i.statusCN = Constants.GOODS_STATUS[i.status]
                    })
                    tableData.value = data.list
                    totalCount.value = data.count
                }
            })
        }
        getGoods()

        watch(() => pageParams.page, getGoods)

        const handleEdit = debounce((goods) => {
            router.push({
                name: 'goodsEdit',
                query: {
                    goodsUuid: goods.uuid
                }
            })
        }, 250)
        const handleUpGoods = debounce(async (goods) => {
            const { uuid, version, status } = goods
            if (status === 'up') return
            up({ uuid, version }).then(({ code }) => {
                if (code === 200) {
                    ElMessage({
                        type: 'success',
                        message: '上架成功'
                    })
                    pageParams.page = 1
                    getGoods()
                }
            })
        }, 250)
        const handleDownGoods = debounce((goods) => {
            const { uuid, version, status } = goods
            if (status === 'down') return
            down({ uuid, version }).then(({ code }) => {
                if (code === 200) {
                    ElMessage({
                        type: 'success',
                        message: '下架成功'
                    })
                    pageParams.page = 1
                    getGoods()
                }
            })
        }, 250)

        const handleResetForm = debounce(() => {
            filterForm.value.resetFields()
        })

        const handelSearch = debounce(() => {
            pageParams.page = 1
            getGoods()
        })

        onActivated(() => {
            pageParams.page = 1
            getGoods()
        })
        return {
            totalCount,
            pageParams,
            filterForm,
            filter,
            categoryList,
            query,
            Constants,
            tableData,
            handleEdit,
            handleUpGoods,
            handleDownGoods,
            handleResetForm,
            handelSearch
        }
    }
})
</script>
