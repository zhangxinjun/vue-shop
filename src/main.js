import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入外部表格插件
import TreeTable from 'vue-table-with-tree-grid';

// 导入全局样式表
import "./assets/css/global.css"
// 导入字体图标
import "./assets/font_389se3aq2p6/iconfont.css"
// 引入富文本编辑器 https://github.com/surmon-china/vue-quill-editor
import VueQuillEditor from 'vue-quill-editor'
// require styles 富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import axios from 'axios'
// 设置公用的请求头
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
    // 请求拦截器
axios.interceptors.request.use(config => {
        // console.log(config)
        // 为所有的请求头添加验证字段
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    })
    // 将axios注册给vue全局
Vue.prototype.$http = axios
Vue.config.productionTip = false

// 全局注册表格插件
Vue.component('tree-table', TreeTable)
Vue.use(ElementUI);
// 全局注册富文本组件
Vue.use(VueQuillEditor)
    // 添加全局的时间过滤器
Vue.filter('dateFormat', function(origin) {
    const dt = new Date(origin)
    const year = dt.getFullYear()
        // 将得到的时间转化成字符串，长度不够两位的通过padStart方法在前面补全
    const mon = (dt.getMonth() + 1 + '').padStart(2, '0')
    const day = (dt.getDay() + '').padStart(2, "0")
    const hour = (dt.getHours() + '').padStart(2, "0")
    const min = (dt.getMinutes() + '').padStart(2, "0")
    const sec = (dt.getSeconds() + '').padStart(2, "0")
    return `${year}-${mon}-${day}-${hour}:${min}:${sec}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')