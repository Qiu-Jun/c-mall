<template>
    <el-card>
        <el-form
            :model="editForm"
            :rules="editRules"
            ref="editFormRef"
            label-width="7em"
        >
            <el-row>
                <h2 class="content-title">
                    <i class="el-icon-tickets"></i> 基本信息
                </h2>
                <el-col :span="12">
                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model.trim="editForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="类别" prop="categoryUuid">
                        <el-select
                            v-model="editForm.categoryUuid"
                            class="wp-100"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in categoryList"
                                :key="item.uuid"
                                :label="item.name"
                                :value="item.uuid"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="规格" prop="spec">
                        <el-input v-model.trim="editForm.spec"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="单位" prop="unitName">
                        <el-input v-model.trim="editForm.unitName"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select
                            v-model="editForm.status"
                            class="wp-100"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="(item, key) in Constants.GOODS_STATUS"
                                :key="key"
                                :label="item"
                                :value="key"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="售价" prop="salePrice">
                        <el-input-number
                            class="wp-100"
                            v-model="editForm.salePrice"
                            placeholder="元"
                            controls-position="right"
                            :min="0"
                        ></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <h2 class="content-title">
                    <i class="el-icon-picture-outline"></i> 商品图册
                </h2>
                <el-upload
                    class="mb-15"
                    action="/api/utils/upload"
                    list-type="picture-card"
                    :file-list="fileList"
                    :on-remove="handleUploadRemove"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    multiple
                >
                    <svg-icon name="add" />
                </el-upload>
            </el-row>
            <el-row>
                <h2 class="content-title">
                    <i class="el-icon-goods"></i> 商品介绍
                </h2>
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入商品介绍"
                    v-model="editForm.goodsInfo"
                >
                </el-input>
            </el-row>
        </el-form>

        <div style="text-align: center">
            <el-button @click="handleSave">保存</el-button>
        </div>
    </el-card>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash-es'
import useTagsViews from '@/store/modules/tagsView'
import { Constants } from '@/config/constants'
import { goodsDetail, goodsEdit } from '@/apis/goods'
import { getDropdownList } from '@/apis/goodsCate'

export default defineComponent({
    name: 'goodsEdit',

    setup() {
        const editFormRef = ref(null)
        const editForm = reactive({
            name: '',
            categoryUuid: '',
            spec: '',
            unitName: '',
            status: '',
            salePrice: 0,
            goodsInfo: '',
            thumbnail: '',
            imagesJsonStr: ''
        })
        const editRules = {
            name: [
                { required: true, message: '请输入商品名称', trigger: 'blur' }
            ],
            unitName: [
                { required: true, message: '请输入单位', trigger: 'blur' }
            ],
            categoryUuid: [
                { required: true, message: '请选择类别', trigger: 'change' }
            ],
            salePrice: [
                { required: true, message: '请输入售价', trigger: 'blur' }
            ],
            status: [
                { required: true, message: '请选择状态', trigger: 'change' }
            ]
        }

        // 路由
        const route = useRoute()
        const router = useRouter()
        // store
        const tagsViewsStore = useTagsViews()

        // 获取商品
        const getGoodsDetail = () => {
            goodsDetail({ uuid: route.query.goodsUuid }).then(
                ({ code, data }) => {
                    if (code === 200) {
                        data.salePrice = +data.salePrice
                        Object.assign(editForm, data)
                    }
                }
            )
        }
        getGoodsDetail()

        const categoryList = ref([])
        const getCates = () => {
            getDropdownList().then(({ code, data }) => {
                if (code === 200) {
                    categoryList.value = data
                }
            })
        }
        getCates()

        const fileList = ref([])
        const handleUploadRemove = (file, fileList) => {
            fileList.value = fileList
        }
        const handleUploadSuccess = (response, file, fileList) => {
            fileList.value = fileList
        }
        const handleUploadError = () => {
            ElMessage({
                type: 'error',
                message: '上传失败'
            })
        }

        const formatImagesJsonStr = () => {
            const images = fileList.value.map((item = {}) => {
                const { response = {}, url } = item
                return response.data || url
            })
            editForm.thumbnail = images[0] || ''
            editForm.imagesJsonStr = JSON.stringify(images)
        }
        const handleSave = debounce(() => {
            editFormRef.value.validate(async (valid) => {
                if (valid) {
                    await formatImagesJsonStr()
                    goodsEdit({ goods: editForm }).then(({ code }) => {
                        if (code === 200) {
                            ElMessage({
                                type: 'success',
                                message: '修改成功'
                            })
                            tagsViewsStore.delView(route)
                            router.push({ name: 'goodsManage' })
                        }
                    })
                }
            })
        }, 250)
        return {
            editFormRef,
            editForm,
            editRules,
            Constants,
            categoryList,
            fileList,
            handleUploadRemove,
            handleUploadSuccess,
            handleUploadError,
            handleSave
        }
    }
})
</script>
