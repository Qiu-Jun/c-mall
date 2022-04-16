<template>
    <el-card>
        <el-form :model="merchantForm" label-width="7em">
            <el-row>
                <el-col :span="11">
                    <h2 class="content-title">
                        <i class="el-icon-tickets"></i> 基础资料
                    </h2>
                    <el-form-item label="商家名称">
                        {{ merchantForm.name }}
                    </el-form-item>
                    <el-form-item label="联系人">
                        {{ merchantForm.linkMan }}
                    </el-form-item>
                    <el-form-item label="联系电话">
                        {{ merchantForm.linkPhone }}
                    </el-form-item>
                    <el-form-item label="详细地址">
                        {{ merchantForm.address }}
                    </el-form-item>
                    <el-form-item label="客服电话">
                        {{ merchantForm.servicePhone }}
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
                        <span
                            class="el-switch-text"
                            :class="merchantForm.statusClass"
                        >
                            {{ merchantForm.statusCN }}
                        </span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <h2 class="content-title">
                        <i class="el-icon-connection"></i> 关联小程序
                    </h2>
                    <el-form-item label="小程序ID：">
                        {{ merchantForm.appId }}
                    </el-form-item>
                    <el-form-item label="小程序密匙：">
                        {{ merchantForm.appSecret }}
                    </el-form-item>
                    <el-form-item label="商户号：">
                        {{ merchantForm.mchId }}
                    </el-form-item>
                    <el-form-item label="商户密匙：">
                        {{ merchantForm.mchKey }}
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { merchantDetail } from '@/apis/merchant'
import { Constants } from '@/config/constants'
import Cookie from 'js-cookie'

export default defineComponent({
    name: 'merchantView',

    setup() {
        const merchantForm = reactive({})
        const getDetail = () => {
            const uuid = Cookie.get('userUuid')
            if (!uuid) return
            merchantDetail({ uuid }).then(({ code, data }) => {
                if (code === 200) {
                    data.statusClass =
                        Constants.ENABLE_STATUS_CLASS[data.enableStatus]
                    data.statusCN = Constants.ENABLE_STATUS[data.enableStatus]
                    Object.assign(merchantForm, data)
                }
            })
        }
        getDetail()

        return {
            merchantForm
        }
    }
})
</script>
