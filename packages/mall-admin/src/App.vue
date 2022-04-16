<!--
 * :Author: June
 * :Date: 2022-03-07 02:12:16
 * :LastEditTime: 2022-03-24 17:15:22
 * :Description:
-->
<template>
    <el-config-provider :locale="locale">
        <router-view />
    </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue'
import useUser from '@/store/modules/user'
import usePermission from '@/store/modules/permission'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import Cookie from 'js-cookie'

export default defineComponent({
    name: 'app',

    setup() {
        const userStore = useUser()
        userStore.setUser()

        const permissionStore = usePermission()
        permissionStore.generateRoutes([Cookie.get('userType')])
        // 切换为中文
        const locale = zhCn
        return {
            locale
        }
    }
})
</script>
