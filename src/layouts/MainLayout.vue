<template>
  <a-layout class="layout">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">Admin</div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="/home">
          <router-link to="/home">首页</router-link>
        </a-menu-item>
        <a-menu-item key="/user/list">
          <router-link to="/user/list">用户管理</router-link>
        </a-menu-item>
        <a-menu-item key="/device/list">
          <router-link to="/device/list">设备管理</router-link>
        </a-menu-item>
        <a-sub-menu key="system">
          <template #title>
            <span>系统管理</span>
          </template>
          <a-menu-item key="/system/log">
            <router-link to="/system/log">日志管理</router-link>
          </a-menu-item>
          <a-menu-item key="/system/role">
            <router-link to="/system/role">角色管理</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>

    <a-layout>
      <a-layout-header class="header">
        <span>Vue3 + TS 后台 Demo</span>
        <a-space class="user-area">
          <span>{{ userStore.userInfo?.name || '未登录' }}</span>
          <a-button size="small" @click="onLogout">退出</a-button>
        </a-space>
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>([route.path])

watch(
  () => route.path,
  (p) => (selectedKeys.value = [p]),
)

function onLogout() {
  userStore.logout()
  router.replace('/login')
}
</script>

<style scoped>
.layout { min-height: 100vh; }
.logo {
  height: 32px;
  margin: 16px;
  color: #fff;
  text-align: center;
  line-height: 32px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  background: #001529;
  padding: 0 24px;
}
.content {
  margin: 16px;
  padding: 16px;
  background: #fff;
  min-height: 280px;
}
.user-area { color: #fff; }
</style>
