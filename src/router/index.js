import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login' //重定向
}, {
    path: '/login',
    component: Login
}, {
    path: '/home',
    component: Home
}]

const router = new VueRouter({
        mode: 'history',
        base: process.env.BASE_URL,
        routes
    })
    // 进行路由拦截判断当前要前去的页面，如果是登录页则不需要进行验证，其余页面先判断是否有token，如果有就进入下一个页面，如果没有就强制跳转至登录页面
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        return next()
    } else {
        // 获取token作为是否登录的凭证
        const tokenStr = window.sessionStorage.getItem('token')
        if (tokenStr) {
            next()
        } else {
            next('/login')
        }
    }
})
export default router