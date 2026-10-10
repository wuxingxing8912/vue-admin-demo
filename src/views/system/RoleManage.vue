<template>
  <div>
    <a-space class="toolbar">
      <a-button type="primary" @click="openCreate">新增角色</a-button>
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
            <a @click="openEdit(record as RoleItem)">编辑</a>
            <a-popconfirm title="确认删除?" @confirm="onDelete(record as RoleItem)">
              <a class="danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="modalOpen"
      :title="editing ? '编辑角色' : '新增角色'"
      @ok="onSubmit"
      @cancel="modalOpen = false"
    >
      <a-form :model="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="角色名称">
          <a-input v-model:value="form.name" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea v-model:value="form.description" placeholder="请输入描述/备注" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { roleApi, type RoleItem } from '@/api/mock'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '操作', key: 'action' },
]

const list = ref<RoleItem[]>([])
const loading = ref(false)

const modalOpen = ref(false)
const editing = ref<RoleItem | null>(null)
const form = reactive<{ name: string; description: string }>({
  name: '',
  description: '',
})

async function load() {
  loading.value = true
  list.value = await roleApi.list()
  loading.value = false
}

function resetForm() {
  form.name = ''
  form.description = ''
}

function openCreate() {
  editing.value = null
  resetForm()
  modalOpen.value = true
}

function openEdit(record: RoleItem) {
  editing.value = record
  form.name = record.name
  form.description = record.description
  modalOpen.value = true
}

async function onSubmit() {
  if (!form.name) {
    message.warning('请输入角色名称')
    return
  }
  if (editing.value) {
    await roleApi.update(editing.value.id, { ...form })
    message.success('更新成功')
  } else {
    await roleApi.create({ ...form } as Omit<RoleItem, 'id'>)
    message.success('新增成功')
  }
  modalOpen.value = false
  load()
}

async function onDelete(record: RoleItem) {
  await roleApi.remove(record.id)
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
