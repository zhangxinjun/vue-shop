import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入全局样式表
import "./assets/css/global.css"
// 导入字体图标
import "./assets/font_389se3aq2p6/iconfont.css"
import axios from 'axios'
// 设置公用的请求头
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
    // 将axios注册给vue全局
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')