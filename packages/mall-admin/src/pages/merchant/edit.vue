<template>
    <el-card>
        <el-form
            :model="merchantForm"
            :rules="rules"
            ref="merchantFormRef"
            label-width="7em"
            size="small"
        >
            <el-row>
                <el-col :span="11">
                    <h2 class="content-title">
                        <i class="el-icon-tickets"></i> 基础资料
                    </h2>
                    <el-form-item label="商家名称" prop="name">
                        <el-input v-model.trim="merchantForm.name"></el-input>
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
                    <el-form-item label="账号">
                        {{ merchantForm.userName }}
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-switch
                            v-if="userType === 'admin'"
                            v-model="merchantForm.enableStatus"
                            inactive-value="0"
                            active-value="1"
                        ></el-switch>
                    </el-form-item>
                    <template v-if="userType === 'admin'">
                        <el-form-item label="重置密码">
                            <el-switch v-model="resetPassword"></el-switch>
                        </el-form-item>
                        <template v-if="resetPassword">
                            <el-form-item label="新密码" prop="password">
                                <el-input
                                    type="password"
                                    v-model.trim="merchantForm.password"
                                    autocomplete="new-password"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                label="确认新密码"
                                prop="checkPassword"
                            >
                                <el-input
                                    type="password"
                                    v-model.trim="merchantForm.checkPassword"
                                    autocomplete="new-password"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </template>
                </el-col>
            </el-row>
            <el-row v-if="userType === 'merchant'">
                <el-col :span="11">
                    <h2 class="content-title">
                        <i class="el-icon-connection"></i> 关联小程序
                    </h2>
                    <el-form-item label="小程序ID：">
                        <el-input v-model.trim="merchantForm.appId"></el-input>
                    </el-form-item>
                    <el-form-item label="小程序密匙：">
                        <el-input
                            v-model.trim="merchantForm.appSecret"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="商户号：">
                        <el-input v-model.trim="merchantForm.mchId"></el-input>
                    </el-form-item>
                    <el-form-item label="商户密匙：">
                        <el-input v-model.trim="merchantForm.mchKey"></el-input>
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
import useTagsViews from '@/store/modules/tagsView'
import { debounce } from 'lodash-es'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import Cookie from 'js-cookie'
import { merchantDetail, merchantEdit } from '@/apis/merchant'

export default defineComponent({
    name: 'merchantEdit',

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
            checkPassword: '',
            appId: '',
            appSecret: '',
            mchId: '',
            mchKey: ''
        })
        const merchantFormRef = ref(null)
        const resetPassword = ref(false)
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
        const rules = reactive({
            name: [
                { required: true, message: '请输入商家名称', trigger: 'blur' }
            ],
            password: [
                { required: true, validator: validatePass, trigger: 'blur' }
            ],
            checkPassword: [
                { required: true, validator: validatePass2, trigger: 'blur' }
            ]
        })
        const userType = Cookie.get('userType')

        const getDetail = () => {
            const { merchantUuid: uuid } = route.query
            merchantDetail({ uuid }).then(({ code, data }) => {
                if (code === 200) {
                    Object.assign(merchantForm, data)
                }
            })
        }
        getDetail()

        const submitForm = debounce(() => {
            merchantFormRef.value.validate((valid) => {
                if (valid) {
                    merchantEdit({ merchant: merchantForm }).then(
                        ({ code }) => {
                            if (code === 200) {
                                ElMessage({
                                    type: 'success',
                                    message: '修改成功'
                                })
                                tagsViewsStore.delVisitedView(route)
                                switch (userType) {
                                    case 'admin':
                                        router.push({ name: 'merchantList' })
                                        break
                                    case 'merchant':
                                        router.push({ name: 'merchantView' })
                                        break
                                    default:
                                        break
                                }
                            }
                        }
                    )
                }
            })
        }, 250)
        const resetForm = () => merchantFormRef.value.resetFields()
        return {
            merchantForm,
            merchantFormRef,
            rules,
            userType,
            resetPassword,
            submitForm,
            resetForm
        }
    }
})
</script>
