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
                    v-model.trim="filter.keywordsLike"
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
                    <!-- <el-option
                        v-for="(label, key) in $Constants.GOODS_STATUS"
                        :key="key"
                        :label="label"
                        :value="key"
                    ></el-option> -->
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="mx_resetTable()">重置</el-button>
            </el-form-item>
        </el-form>

        <div class="pagination">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageParams.pageSize"
                :pager-count="11"
                :total="totalCount"
            />
        </div>
    </el-card>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { getDropdownList } from '@/apis/goods'

export default defineComponent({
    name: 'goodsManage',

    setup() {
        const totalCount = ref(0)
        const pageParams = reactive({
            page: 1,
            pageSize: 10
        })

        const filterForm = ref(null)
        const filter = reactive({
            keywordsLike: ''
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

        const query = () => {}

        return {
            totalCount,
            pageParams,
            filterForm,
            filter,
            categoryList,
            query
        }
    }
})
</script>
