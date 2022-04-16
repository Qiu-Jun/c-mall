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
                    placeholder="名称 / 备注"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
                <el-button @click="showDialog('add')">新增类目</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tabalData">
            <el-table-column prop="name" sortable="custom" label="名称">
                <template v-slot="scope">
                    <span class="text-bold">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="remark"
                sortable="custom"
                label="备注"
                width="180"
            ></el-table-column>
            <el-table-column
                prop="surcharge"
                sortable="custom"
                label="附加费用"
                width="180"
            >
                <template #default="scope">
                    <span v-if="scope.row.surcharge" class="text-red text-bold"
                        >¥ {{ scope.row.surcharge }}</span
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                width="100"
                align="center"
            >
                <template #default="scope">
                    <el-button
                        type="text"
                        @click="showDialog('edit', scope.row)"
                        >编辑</el-button
                    >
                    <el-button
                        type="text"
                        class="danger-text-btn"
                        @click="delTime(scope.row.uuid)"
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
            @close="closeDialog"
        >
            <el-form
                :model="dialogForm"
                :rules="dialogRules"
                ref="dialogFormRef"
                label-width="5em"
            >
                <el-form-item label="名称" prop="name">
                    <el-input
                        v-model.trim="dialogForm.name"
                        autocomplete="off"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input
                        v-model.trim="dialogForm.remark"
                        autocomplete="off"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="附加费用" prop="surcharge">
                    <el-input-number
                        class="wp-100"
                        v-model="dialogForm.surcharge"
                        controls-position="right"
                        :min="0"
                    ></el-input-number>
                </el-form-item>
            </el-form>

            <template v-slot:footer>
                <div class="dialog-footer">
                    <el-button @click="hideDialog">取 消</el-button>
                    <el-button type="primary" @click="submitForm"
                        >确 定</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </el-card>
</template>

<script>
import { defineComponent, reactive, ref, watch, nextTick } from 'vue'
import { debounce, isEmpty, cloneDeep, throttle } from 'lodash-es'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    deliveryTimeList,
    deliveryTimeEdit,
    deliveryTimeAdd,
    deliveryTimeDel
} from '@/apis/logistics'

export default defineComponent({
    name: 'timea',

    setup() {
        const totalCount = ref(0)
        const pageParams = reactive({
            page: 1,
            pageSize: 10
        })

        const filter = reactive({
            keywordsLike: ''
        })
        const filterFormRef = ref(null)

        const tabalData = ref([])
        const getList = () => {
            deliveryTimeList({ pagination: pageParams, filter }).then(
                ({ code, data }) => {
                    if (code === 200) {
                        tabalData.value = data.list
                        totalCount.value = data.count
                    }
                }
            )
        }
        getList()

        const handleSearch = debounce(() => {
            if (!filter.keywordsLike) return
            pageParams.page = 1
            getList()
        }, 250)
        const handleReset = throttle(() => {
            filterFormRef.value.resetFields()
        }, 250)

        watch(() => pageParams.page, getList)

        const dialogVisible = ref(false)
        const dialogTitle = ref('')
        const dialogFormRef = ref(null)
        const dialogForm = reactive({
            name: '',
            remark: '',
            surcharge: 0
        })
        const dialogRules = {
            name: [
                {
                    required: true,
                    message: '请输入送货时间名称',
                    trigger: 'blur'
                }
            ]
        }
        // eslint-disable-next-line no-unused-vars
        let dialogType = ''
        const closeDialog = () => {
            dialogType = ''
            dialogFormRef.value.resetFields()
        }
        const oldDialogForm = ref({})
        const showDialog = debounce((type, deliveryTimeType) => {
            const isEdit = type === 'edit'
            dialogType = type
            dialogVisible.value = true
            dialogTitle.value = isEdit ? '编辑' : '新增'
            if (!isEmpty(deliveryTimeType)) {
                nextTick(() => {
                    const selectedData = cloneDeep(deliveryTimeType)
                    selectedData.surcharge = +selectedData.surcharge
                    oldDialogForm.value = selectedData
                    dialogForm.name = selectedData.name
                    dialogForm.remark = selectedData.remark
                    dialogForm.surcharge = selectedData.surcharge
                })
            }
        }, 250)
        const hideDialog = debounce(() => {
            dialogType = ''
            dialogTitle.value = ''
            dialogVisible.value = false
        }, 250)

        const submitForm = debounce(() => {
            dialogFormRef.value.validate((valid) => {
                if (valid) {
                    if (dialogType === 'edit') {
                        deliveryTimeEdit({
                            deliveryTimeType: {
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
                                getList()
                            }
                        })
                    } else {
                        deliveryTimeAdd({ deliveryTimeType: dialogForm }).then(
                            ({ code }) => {
                                if (code === 200) {
                                    hideDialog()
                                    pageParams.page = 1
                                    ElMessage({
                                        type: 'success',
                                        message: '新增成功'
                                    })
                                    getList()
                                }
                            }
                        )
                    }
                }
            })
        }, 250)

        const delTime = debounce((uuid) => {
            ElMessageBox.confirm('将永久删除该类别, 是否继续？', '提示', {
                type: 'warning',
                cancelButtonText: '取消',
                confirmButtonText: '立即删除'
            }).then(() => {
                deliveryTimeDel({ uuid }).then(({ code, msg }) => {
                    if (code === 200) {
                        ElMessage({
                            type: 'success',
                            message: '删除成功'
                        })
                        pageParams.page = 1
                        getList()
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
            totalCount,
            pageParams,
            tabalData,
            filter,
            filterFormRef,
            handleSearch,
            handleReset,
            dialogVisible,
            dialogTitle,
            dialogFormRef,
            dialogForm,
            dialogRules,
            showDialog,
            closeDialog,
            hideDialog,
            submitForm,
            delTime
        }
    }
})
</script>

<style scoped></style>
