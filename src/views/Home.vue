<template>
  <div>
    <a-typography-title :level="3">
      欢迎回来，{{ userStore.userInfo?.name || 'Admin' }}
    </a-typography-title>

    <a-row :gutter="16">
      <a-col :span="8"><a-card title="用户数">128</a-card></a-col>
      <a-col :span="8"><a-card title="订单数">256</a-card></a-col>
      <a-col :span="8"><a-card title="待办">12</a-card></a-col>
    </a-row>

    <a-typography-paragraph class="tip">
      这是 Vue3 + TypeScript 后台管理 Demo 首页，所有数据均为内存 mock，刷新即重置。
    </a-typography-paragraph>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.tip {
  margin-top: 16px;
}
</style>
