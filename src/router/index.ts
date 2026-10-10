import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: () => import('@/views/Home.vue') },
      { path: 'user/list', name: 'UserList', component: () => import('@/views/user/UserList.vue') },
      { path: 'system/log', name: 'LogManage', component: () => import('@/views/system/LogManage.vue') },
      { path: 'device/list', name: 'DeviceList', component: () => import('@/views/device/DeviceList.vue') },
      { path: 'system/role', name: 'RoleManage', component: () => import('@/views/system/RoleManage.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/home' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫：无 token 跳登录；已登录访问登录页跳首页
router.beforeEach((to) => {
  const userStore = useUserStore()
  const token = userStore.token || localStorage.getItem('token')
  if (!to.meta.public && !token) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'Login' && token) {
    return { name: 'Home' }
  }
})

export default router
