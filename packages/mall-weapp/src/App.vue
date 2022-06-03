<script>
import { mapActions } from 'vuex'
export default {
    onLaunch: function () {
        this.login()
    },
    onShow: function () {
        this.checkUpdate()
    },
    onHide: function () {
        console.log('App Hide')
    },
    methods: {
        ...mapActions('user', ['login']),
        // 检查更新
        checkUpdate() {
            if (uni.canIUse('getUpdateManager')) {
                const updateManager = uni.getUpdateManager()
                // 请求完新版本信息的回调
                updateManager.onCheckForUpdate((res) => {
                    console.log(res.hasUpdate)
                })
                updateManager.onUpdateReady(() => {
                    uni.showModal({
                        title: '是否更新',
                        content: '新版本已经准备好，是否重启应用？',
                        success: (res) => {
                            if (res.confirm) {
                                updateManager.applyUpdate()
                            }
                        }
                    })
                })
                // updateManager.applyUpdate()
                updateManager.onUpdateFailed(() => {
                    this.$toast({ title: '更新失败,请检查您的网络是否正常' })
                })
            }
        }
    }
}
</script>

<style lang="scss">
@import 'lib/colorui/main.css';
@import 'lib/colorui/icon.css';
</style>
