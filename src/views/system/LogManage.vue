<template>
  <div>
    <a-card title="日志管理" :bordered="false">
      <a-space class="toolbar" wrap>
        <a-input
          v-model:value="keyword"
          placeholder="搜索操作人"
          allow-clear
          style="width: 200px"
          @press-enter="onSearch"
        />
        <a-select
          v-model:value="typeFilter"
          placeholder="日志类型"
          allow-clear
          style="width: 140px"
          :options="typeOptions"
        />
        <a-button type="primary" @click="onSearch">查询</a-button>
        <a-button @click="onReset">重置</a-button>
      </a-space>

      <a-table
        class="log-table"
        row-key="id"
        :columns="columns"
        :data-source="filteredLogs"
        :pagination="{ pageSize: 8, showTotal: (t: number) => `共 ${t} 条` }"
        :loading="loading"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag :color="typeColor(record.type)">{{ record.type }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface LogItem {
  id: number
  time: string
  operator: string
  module: string
  type: '登录' | '操作' | '异常'
  content: string
  ip: string
}

const typeOptions = [
  { label: '登录', value: '登录' },
  { label: '操作', value: '操作' },
  { label: '异常', value: '异常' },
]

const columns = [
  { title: '操作时间', dataIndex: 'time', key: 'time', width: 180 },
  { title: '操作人', dataIndex: 'operator', key: 'operator', width: 120 },
  { title: '模块', dataIndex: 'module', key: 'module', width: 120 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '内容', dataIndex: 'content', key: 'content' },
  { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140 },
]

// mock 日志数据（第 2 月接真实后端时替换为接口请求）
const allLogs = ref<LogItem[]>([
  { id: 1, time: '2026-08-05 10:21:33', operator: 'admin', module: '认证', type: '登录', content: '登录系统成功', ip: '192.168.1.10' },
  { id: 2, time: '2026-08-05 10:25:12', operator: 'admin', module: '用户管理', type: '操作', content: '新增用户「张三」', ip: '192.168.1.10' },
  { id: 3, time: '2026-08-05 10:28:47', operator: 'lisi', module: '用户管理', type: '操作', content: '编辑用户「李四」基本信息', ip: '192.168.1.23' },
  { id: 4, time: '2026-08-05 10:31:09', operator: 'guest', module: '认证', type: '异常', content: '密码错误 3 次，账号锁定', ip: '10.0.0.55' },
  { id: 5, time: '2026-08-05 10:35:51', operator: 'wangwu', module: '系统管理', type: '操作', content: '修改系统参数配置', ip: '192.168.1.41' },
  { id: 6, time: '2026-08-05 10:40:02', operator: 'admin', module: '日志管理', type: '操作', content: '导出操作日志（近 7 天）', ip: '192.168.1.10' },
  { id: 7, time: '2026-08-05 10:42:18', operator: 'zhao', module: '认证', type: '登录', content: '登录系统成功', ip: '192.168.1.66' },
  { id: 8, time: '2026-08-05 10:45:33', operator: 'unknown', module: '接口', type: '异常', content: '调用 /api/user/list 返回 403', ip: '172.16.0.9' },
  { id: 9, time: '2026-08-05 10:48:50', operator: 'lisi', module: '用户管理', type: '操作', content: '删除用户「王五」', ip: '192.168.1.23' },
  { id: 10, time: '2026-08-05 10:50:11', operator: 'admin', module: '认证', type: '登录', content: '退出系统', ip: '192.168.1.10' },
])

const loading = ref(false)
const keyword = ref('')
const typeFilter = ref<string | undefined>(undefined)

const filteredLogs = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return allLogs.value.filter((log) => {
    const matchKw = !kw || log.operator.toLowerCase().includes(kw)
    const matchType = !typeFilter.value || log.type === typeFilter.value
    return matchKw && matchType
  })
})

function typeColor(type: LogItem['type']) {
  if (type === '登录') return 'blue'
  if (type === '操作') return 'green'
  return 'red'
}

function onSearch() {
  // 过滤为前端 computed 实时计算，这里仅模拟一次加载态
  loading.value = true
  setTimeout(() => (loading.value = false), 200)
}

function onReset() {
  keyword.value = ''
  typeFilter.value = undefined
}
</script>

<style scoped>
.toolbar { margin-bottom: 16px; }
.log-table { margin-top: 8px; }
</style>
