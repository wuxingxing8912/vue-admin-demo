<template>
  <div>
    <a-space class="toolbar">
      <a-input-search
        v-model:value="keyword"
        placeholder="搜索用户名"
        enter-button="查询"
        style="width: 260px"
        @search="load"
      />
      <a-button type="primary" @click="openCreate">新增用户</a-button>
    </a-space>

    <a-table
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :pagination="{ pageSize: 10 }"
      row-key="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="openEdit(record as UserItem)">编辑</a>
            <a-popconfirm title="确认删除?" @confirm="onDelete(record as UserItem)">
              <a class="danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="modalOpen"
      :title="editing ? '编辑用户' : '新增用户'"
      @ok="onSubmit"
      @cancel="modalOpen = false"
    >
      <a-form :model="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="姓名">
          <a-input v-model:value="form.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number v-model:value="form.age" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="form.email" placeholder="请输入邮箱" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { userApi, type UserItem } from '@/api/mock'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '操作', key: 'action' },
]

const list = ref<UserItem[]>([])
const loading = ref(false)
const keyword = ref('')

const modalOpen = ref(false)
const editing = ref<UserItem | null>(null)
const form = reactive<{ name: string; age: number | null; email: string }>({
  name: '',
  age: null,
  email: '',
})

async function load() {
  loading.value = true
  list.value = await userApi.list(keyword.value)
  loading.value = false
}

function resetForm() {
  form.name = ''
  form.age = null
  form.email = ''
}

function openCreate() {
  editing.value = null
  resetForm()
  modalOpen.value = true
}

function openEdit(record: UserItem) {
  editing.value = record
  form.name = record.name
  form.age = record.age
  form.email = record.email
  modalOpen.value = true
}

async function onSubmit() {
  if (!form.name) {
    message.warning('请输入姓名')
    return
  }
  if (editing.value) {
    await userApi.update(editing.value.id, { ...form })
    message.success('更新成功')
  } else {
    await userApi.create({ ...form } as Omit<UserItem, 'id'>)
    message.success('新增成功')
  }
  modalOpen.value = false
  load()
}

async function onDelete(record: UserItem) {
  await userApi.remove(record.id)
  message.success('删除成功')
  load()
}

onMounted(load)
</script>

<style scoped>
.toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
}
.danger {
  color: #ff4d4f;
}
</style>
