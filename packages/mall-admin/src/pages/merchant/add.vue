<template>
    <el-card>
        <el-form
            :model="merchantForm"
            :rules="merchantRules"
            ref="merchantFormRef"
            label-width="7em"
        >
            <el-row>
                <el-col :span="11">
                    <h2 class="content-title">
                        <i class="el-icon-tickets"></i> 基础资料
                    </h2>
                    <el-form-item label="商家名称" prop="name">
                        <el-input
                            v-model.trim="merchantForm.name"
                            placehodler="请输入1到16位账号（字母，数字，下划线，减号）"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="linkMan">
                        <el-input
                            v-model.trim="merchantForm.linkMan"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="linkPhone">
                        <el-input
                            v-model.trim="merchantForm.linkPhone"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address">
                        <el-input
                            v-model.trim="merchantForm.address"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="客服电话" prop="servicePhone">
                        <el-input
                            v-model.trim="merchantForm.servicePhone"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <h2 class="content-title">
                        <i class="el-icon-tickets"></i> 登录资料
                    </h2>
                    <el-form-item label="账号" prop="userName">
                        <el-input
                            v-model.trim="merchantForm.userName"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input
                            type="password"
                            v-model.trim="merchantForm.password"
                            autocomplete="new-password"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPassword">
                        <el-input
                            type="password"
                            v-model.trim="merchantForm.checkPassword"
                            autocomplete="new-password"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import useTagsViews from '@/store/modules/tagsView'
import { Pattern } from '@/config/constants'
import { merchantAdd } from '@/apis/merchant'

export default defineComponent({
    name: 'merchantAdd',

    setup() {
        const route = useRoute()
        const router = useRouter()
        // store
        const tagsViewsStore = useTagsViews()

        const merchantForm = reactive({
            name: '',
            linkMan: '',
            linkPhone: '',
            address: '',
            servicePhone: '',
            userName: '',
            password: '',
            checkPassword: ''
        })
        const merchantFormRef = ref(null)
        const validateUserName = (rule, value, callback) => {
            if (Pattern.userName.test(value)) {
                callback()
            } else {
                callback(
                    new Error('请输入1到16位账号（字母，数字，下划线，减号）')
                )
            }
        }
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (merchantForm.checkPassword !== '') {
                    merchantFormRef.value.validateField('checkPassword')
                }
                callback()
            }
        }
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== merchantForm.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        const merchantRules = reactive({
            name: [
                { required: true, message: '请输入商家名称', trigger: 'blur' }
            ],
            userName: [
                { required: true, validator: validateUserName, trigger: 'blur' }
            ],
            password: [
                { required: true, validator: validatePass, trigger: 'blur' }
            ],
            checkPassword: [
                { required: true, validator: validatePass2, trigger: 'blur' }
            ]
        })
        const submitForm = () => {
            merchantAdd({ merchant: merchantForm }).then(({ code }) => {
                if (code === 200) {
                    ElMessage({
                        type: 'success',
                        message: '添加成功'
                    })
                    tagsViewsStore.delVisitedView(route)
                    router.push('/merchant/list')
                }
            })
        }
        const resetForm = () => merchantFormRef.value.resetFields()

        return {
            merchantForm,
            merchantRules,
            merchantFormRef,
            submitForm,
            resetForm
        }
    }
})
</script>
