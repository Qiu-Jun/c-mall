<template>
    <el-card>
        <el-form
            class="filter-form"
            :inline="true"
            ref="filterForm"
            :model="filter"
            ><el-form-item label="名称" prop="keywordsLike">
                <el-input
                    v-model.trim="filter.keywordsLike"
                    placeholder="类别名称"
                    clearable
                    @keyup.enter="handleSearch"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
                <el-button @click="handleShowDialog">新增类目</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="defaultTable" :data="tableData" empty-text="暂无分类">
            <el-table-column prop="name" label="名称" sortable="custom">
                <template v-slot="scope">
                    <span class="text-bold">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="createdTime"
                label="创建时间"
                sortable="custom"
                width="180"
            ></el-table-column>
            <el-table-column
                prop="lastModifiedTime"
                label="最后修改时间"
                sortable="custom"
                width="180"
            ></el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                width="100"
                align="center"
            >
                <template #default="scope">
                    <el-button
                        type="text"
                        @click="handleShowDialog('edit', scope.row)"
                        >编辑</el-button
                    >
                    <el-button
                        type="text"
                        class="danger-text-btn"
                        @click="handleDelte(scope.row.uuid)"
                    >
                        删除
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

        <!--新增、编辑弹窗-->
        <el-dialog
            :title="dialogTitle"
            v-model="dialogVisible"
            width="30%"
            center
            append-to-body
            @close="handleDialogClose"
        >
            <el-form
                :model="dialogForm"
                :rules="dialogRules"
                ref="dialogFormRef"
                label-width="6em"
            >
                <el-form-item label="类别名称" prop="name">
                    <el-input
                        v-model.trim="dialogForm.name"
                        autocomplete="off"
                        clearable
                    ></el-input>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <div class="dialog-footer">
                    <el-button @click="hideDialog">取 消</el-button>
                    <el-button type="primary" @click="handleAdd('dialogForm')"
                        >确 定</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </el-card>
</template>

<script>
import { defineComponent, reactive, ref, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { debounce, isEmpty, cloneDeep } from 'lodash-es'
import { cateQuery, cateAdd, cateEdit, cateDelete } from '@/apis/goodsCate'
import dayjs from 'dayjs'

export default defineComponent({
    name: 'cateList',

    setup() {
        const filterForm = ref(null)
        const filter = reactive({ keywordsLike: '' })

        // 重置
        const handleReset = debounce(() => {
            filterForm.value.resetFields()
        })

        const pageParams = reactive({
            page: 1,
            pageSize: 10
        })
        const totalCount = ref(0)
        const tableData = ref([])
        const getCateList = () => {
            const params = {
                pagination: pageParams,
                filter
            }
            cateQuery(params).then(({ code, data }) => {
                if (code === 200) {
                    data.list.forEach((i) => {
                        i.createdTime = dayjs(i.createdTime).format(
                            'YYYY-MM-DD'
                        )
                        i.lastModifiedTime = dayjs(i.lastModifiedTime).format(
                            'YYYY-MM-DD'
                        )
                    })
                    totalCount.value = data.count
                    tableData.value = data.list
                }
            })
        }
        getCateList()

        const handleSearch = () => {
            pageParams.page = 1
            getCateList()
        }
        watch(() => pageParams.page, getCateList)

        const dialogVisible = ref(false)
        const dialogTitle = ref('')
        const dialogFormRef = ref(null)
        const dialogForm = reactive({
            name: ''
        })
        const dialogRules = {
            name: { required: true, message: '请输入类别名称', trigger: 'blur' }
        }
        const oldDialogForm = ref({})
        // eslint-disable-next-line no-unused-vars
        let dialogType = ''
        const hideDialog = debounce(() => {
            dialogType = ''
            dialogTitle.value = ''
            dialogVisible.value = false
        }, 250)

        const handleShowDialog = debounce((type, goodsCategory) => {
            const isEdit = type === 'edit'
            dialogType = type
            dialogVisible.value = true
            dialogTitle.value = isEdit ? '编辑' : '新增'
            if (!isEmpty(goodsCategory)) {
                nextTick(() => {
                    const selectedData = cloneDeep(goodsCategory)
                    oldDialogForm.value = selectedData
                    dialogForm.name = selectedData.name
                })
            }
        }, 250)
        const handleDialogClose = () => {
            dialogType = ''
            dialogFormRef.value.resetFields()
        }
        const handleAdd = debounce(() => {
            dialogFormRef.value.validate((valid) => {
                if (valid) {
                    if (dialogType === 'edit') {
                        cateEdit({
                            goodsCategory: {
                                ...oldDialogForm.value,
                                ...dialogForm
                            }
                        }).then(({ code }) => {
                            if (code === 200) {
                                hideDialog()
                                ElMessage({
                                    type: 'success',
                                    message: '修改成功'
                                })
                                getCateList()
                            }
                        })
                    } else {
                        cateAdd({ goodsCategory: dialogForm }).then(
                            ({ code }) => {
                                if (code === 200) {
                                    hideDialog()
                                    pageParams.page = 1
                                    ElMessage({
                                        type: 'success',
                                        message: '新增成功'
                                    })
                                    getCateList()
                                }
                            }
                        )
                    }
                }
            })
        }, 250)

        const handleDelte = debounce((uuid) => {
            ElMessageBox.confirm('将永久删除该类别, 是否继续？', '提示', {
                type: 'warning',
                cancelButtonText: '取消',
                confirmButtonText: '立即删除'
            }).then(() => {
                cateDelete({ uuid }).then(({ code, msg }) => {
                    if (code === 200) {
                        ElMessage({
                            type: 'success',
                            message: '删除成功'
                        })
                        pageParams.page = 1
                        getCateList()
                    } else {
                        ElMessage({
                            type: 'error',
                            message: msg
                        })
                    }
                })
            })
        }, 250)
        return {
            filterForm,
            filter,
            handleReset,
            tableData,
            totalCount,
            pageParams,
            handleSearch,
            dialogTitle,
            dialogVisible,
            dialogForm,
            dialogRules,
            dialogFormRef,
            handleAdd,
            hideDialog,
            handleDialogClose,
            handleShowDialog,
            handleDelte
        }
    }
})
</script>
