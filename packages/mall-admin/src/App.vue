<!--
 * :Author: June
 * :Date: 2022-03-07 02:12:16
 * :LastEditTime: 2022-03-24 17:15:22
 * :Description:
-->
<template>
    <el-config-provider>
        <router-view />
    </el-config-provider>
</template>

<script>
import { defineComponent } from 'vue'
import useUser from '@/store/modules/user'

export default defineComponent({
    name: 'app',

    setup() {
        const userStore = useUser()
        userStore.setUser()
    }
})
</script>
