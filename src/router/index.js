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

export default router