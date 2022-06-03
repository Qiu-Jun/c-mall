import Vue from 'vue'
import App from './App'
import store from './store'
import Toast from '@/lib/toast/index'
import constants from '@/config/constants'
import { getStorage, setStorage } from '@/lib/storage/index'

Vue.prototype.$constants = constants // 常量
Vue.prototype.$getStorage = getStorage
Vue.prototype.$setStorage = setStorage
Vue.prototype.$toast = Toast
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
