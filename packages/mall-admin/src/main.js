/*
 * :Author: June
 * :Date: 2022-03-07 02:12:16
 * :LastEditTime: 2022-03-30 01:44:57
 * :Description:
 */
import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import './styles/iconfont.css'
import router from './router'
import store from './store/index'
// import routerEach from './router/routerEach'
import 'virtual:svg-icons-register'

// 在js中引入css没有按需加载进去，这两个使用频繁
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-notification.css'

async function bootstrap() {
    const app = createApp(App)
    app.use(store)
    app.use(router)
    // await routerEach(router)
    app.mount('#app')
}
bootstrap()
