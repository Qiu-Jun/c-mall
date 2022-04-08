<template>
    <el-card>
        <header class="notice-header">
            <span class="mr-20 text-middle">消息总数：{{ totalCount }}</span>
            <span class="mr-20 text-middle">
                未读消息：<span class="text-red">{{ unreadCount }}</span>
            </span>

            <el-button
                type="primary"
                @click="handleReadAll"
                :disabled="!unreadCount"
                >全部标记为已读</el-button
            >
        </header>

        <el-table ref="defaultTable" :data="tableData" empty-text="暂无消息">
            <el-table-column prop="type" label="标题" width="200">
                <template #default="scope">
                    <span class="text-bold">{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column label="状态" align="center" width="100">
                <template #default="scope">
                    <span
                        class="badge"
                        :class="scope.row.isRead ? 'bg-gray' : 'bg-red'"
                        >{{ scope.row.isRead ? '已读' : '未读' }}</span
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="createdTime"
                label="时间"
                width="200"
            ></el-table-column>
        </el-table>

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
import dayjs from 'dayjs'
import useUser from '@/store/modules/user'
import { debounce } from 'lodash-es'
import { readAll, query } from '@/apis/notice'
import { ElMessage } from 'element-plus'

export default defineComponent({
    name: 'notice',

    setup() {
        const tableData = ref([])
        const totalCount = ref(0)
        const unreadCount = ref(0)
        const pageParams = reactive({
            page: 1,
            pageSize: 10
        })

        const queryNotice = debounce(async () => {
            const { code, data } = await query(pageParams)
            if (code === 200) {
                data.list.forEach((i) => {
                    i.createdTime = dayjs(i.createdTime).format('YYYY-MM-DD')
                    return true
                })
                tableData.value = data.list
                totalCount.value = data.count
                unreadCount.value = data.unread
            }
        }, 250)
        queryNotice()

        const userStore = useUser()
        const handleReadAll = debounce(async () => {
            const { code } = await readAll()
            if (code === 200) {
                ElMessage({
                    type: 'success',
                    message: '全部标记为已读'
                })
                queryNotice()
                userStore.readAll()
            }
        }, 250)

        return {
            totalCount,
            unreadCount,
            pageParams,
            tableData,
            handleReadAll
        }
    }
})
</script>

<style lang="scss" scoped>
.mr-20 {
    margin-right: 20px;
}
.notice-header {
    margin-bottom: 15px;
    font-size: 16px;
    line-height: 22px;
    overflow: hidden;

    .notice-header-icon {
        margin-right: 15px;
        font-size: 24px;
        color: #faad14;
        vertical-align: middle;
    }
}

.notice-body {
    .notice-body-table {
        background-color: $--color-white;
    }
}
</style>
