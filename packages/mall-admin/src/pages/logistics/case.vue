<template>
    <el-card>
        <el-form
            class="filter-form"
            :inline="true"
            ref="filterFormRef"
            :model="filter"
        >
            <el-form-item label="名称" prop="keywordsLike">
                <el-input
                    v-model.trim="filter.keywordsLike"
                    placeholder="运费方案名称"
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
                prop="basicFreight"
                sortable="custom"
                label="基础运费"
                width="180"
            >
                <template #default="scope">
                    <span
                        v-if="scope.row.basicFreight"
                        class="text-red text-bold"
                        >¥ {{ scope.row.basicFreight }}</span
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="freeFreightAmount"
                sortable="custom"
                label="免运费金额"
                width="180"
            >
                <template #default="scope">
                    <span
                        v-if="scope.row.freeFreightAmount"
                        class="text-red text-bold"
                        >¥ {{ scope.row.freeFreightAmount }}</span
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="sysDefault"
                label="是否默认"
                width="80"
                align="center"
            >
                <template #default="scope">
                    <el-switch v-model="scope.row.sysDefault" disabled />
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
                        @click="delCase(scope.row.uuid)"
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
                <el-form-item label="基础运费" prop="basicFreight">
                    <el-input-number
                        class="wp-100"
                        v-model="dialogForm.basicFreight"
                        controls-position="right"
                        :min="0"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="免运费金额" prop="freeFreightAmount">
                    <el-input-number
                        class="wp-100"
                        v-model="dialogForm.freeFreightAmount"
                        controls-position="right"
                        :min="0"
                    ></el-input-number>
                </el-form-item>
                <el-form-item label="设为默认" prop="sysDefault">
                    <el-switch v-model="dialogForm.sysDefault"></el-switch>
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
import { defineComponent, reactive, ref, nextTick, watch } from 'vue'
import { debounce, isEmpty, cloneDeep, throttle } from 'lodash-es'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    deliveryCaseList,
    deliveryCaseEdit,
    deliveryCaseAdd,
    deliveryCaseDel
} from '@/apis/logistics'

export default defineComponent({
    name: 'case',

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

        const handleReset = throttle(() => {
            filterFormRef.value.resetFields()
        }, 250)

        const tabalData = ref([])
        const getCase = () => {
            deliveryCaseList({ pagination: pageParams, filter }).then(
                ({ code, data }) => {
                    if (code === 200) {
                        tabalData.value = data.list
                        totalCount.value = data.count
                    }
                }
            )
        }
        getCase()
        const handleSearch = () => {
            pageParams.page = 1
            getCase()
        }
        watch(() => pageParams.page, getCase)
        // dialog
        const dialogVisible = ref(false)
        const dialogTitle = ref('')
        const dialogFormRef = ref(null)
        const dialogForm = reactive({
            name: '',
            basicFreight: 0,
            freeFreightAmount: 0,
            sysDefault: false
        })
        const oldDialogForm = ref({})
        const dialogRules = {
            name: [
                {
                    required: true,
                    message: '请输入运费方案名称',
                    trigger: 'blur'
                }
            ],
            basicFreight: [
                { required: true, message: '请输入基础运费', trigger: 'blur' }
            ]
        }
        // eslint-disable-next-line no-unused-vars
        let dialogType = ''
        const closeDialog = () => {
            dialogType = ''
            dialogFormRef.value.resetFields()
        }
        const showDialog = debounce((type, deliveryTimeType) => {
            const isEdit = type === 'edit'
            dialogType = type
            dialogVisible.value = true
            dialogTitle.value = isEdit ? '编辑' : '新增'
            if (!isEmpty(deliveryTimeType)) {
                nextTick(() => {
                    const selectedData = cloneDeep(deliveryTimeType)
                    selectedData.basicFreight = +selectedData.basicFreight
                    selectedData.freeFreightAmount =
                        +selectedData.freeFreightAmount
                    selectedData.sysDefault = deliveryTimeType.sysDefault
                    oldDialogForm.value = selectedData
                    dialogForm.name = selectedData.name
                    dialogForm.basicFreight = selectedData.basicFreight
                    dialogForm.freeFreightAmount =
                        selectedData.freeFreightAmount
                    dialogForm.sysDefault = selectedData.sysDefault
                })
            }
        }, 250)
        const hideDialog = debounce(() => {
            dialogType = ''
            dialogTitle.value = ''
            dialogVisible.value = false
        }, 250)
        const delCase = debounce((uuid) => {
            ElMessageBox.confirm('将永久删除该类别, 是否继续？', '提示', {
                type: 'warning',
                cancelButtonText: '取消',
                confirmButtonText: '立即删除'
            }).then(() => {
                deliveryCaseDel({ uuid }).then(({ code, msg }) => {
                    if (code === 200) {
                        ElMessage({
                            type: 'success',
                            message: '删除成功'
                        })
                        pageParams.page = 1
                        getCase()
                    } else {
                        ElMessage({
                            type: 'error',
                            message: msg
                        })
                    }
                })
            })
        }, 250)

        const submitForm = debounce(() => {
            dialogFormRef.value.validate((valid) => {
                if (valid) {
                    if (dialogType === 'edit') {
                        deliveryCaseEdit({
                            freightPlan: {
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
                                getCase()
                            }
                        })
                    } else {
                        deliveryCaseAdd({ freightPlan: dialogForm }).then(
                            ({ code }) => {
                                if (code === 200) {
                                    hideDialog()
                                    pageParams.page = 1
                                    ElMessage({
                                        type: 'success',
                                        message: '新增成功'
                                    })
                                    getCase()
                                }
                            }
                        )
                    }
                }
            })
        }, 250)

        return {
            totalCount,
            pageParams,
            filterFormRef,
            filter,
            handleSearch,
            handleReset,
            tabalData,
            delCase,
            dialogVisible,
            dialogTitle,
            dialogFormRef,
            dialogForm,
            dialogRules,
            closeDialog,
            showDialog,
            hideDialog,
            submitForm
        }
    }
})
</script>
