<template>
  <div>
    <a-space class="toolbar">
      <a-input-search
        v-model:value="keyword"
        placeholder="搜索设备名称"
        enter-button="查询"
        style="width: 260px"
        @search="load"
      />
      <a-button type="primary" @click="openCreate">新增设备</a-button>
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
            <a @click="openEdit(record as DeviceItem)">编辑</a>
            <a-popconfirm title="确认删除?" @confirm="onDelete(record as DeviceItem)">
              <a class="danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="modalOpen"
      :title="editing ? '编辑设备' : '新增设备'"
      @ok="onSubmit"
      @cancel="modalOpen = false"
    >
      <a-form :model="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="设备名称">
          <a-input v-model:value="form.name" placeholder="请输入设备名称" />
        </a-form-item>
        <a-form-item label="SN">
          <a-input v-model:value="form.sn" placeholder="请输入 SN 序列号" />
        </a-form-item>
        <a-form-item label="型号">
          <a-input v-model:value="form.model" placeholder="请输入型号" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { deviceApi, type DeviceItem } from '@/api/mock'

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: '设备名称', dataIndex: 'name', key: 'name' },
  { title: 'SN', dataIndex: 'sn', key: 'sn' },
  { title: '型号', dataIndex: 'model', key: 'model' },
  { title: '操作', key: 'action' },
]

const list = ref<DeviceItem[]>([])
const loading = ref(false)
const keyword = ref('')

const modalOpen = ref(false)
const editing = ref<DeviceItem | null>(null)
const form = reactive<{ name: string; sn: string; model: string }>({
  name: '',
  sn: '',
  model: '',
})

async function load() {
  loading.value = true
  list.value = await deviceApi.list(keyword.value)
  loading.value = false
}

function resetForm() {
  form.name = ''
  form.sn = ''
  form.model = ''
}

function openCreate() {
  editing.value = null
  resetForm()
  modalOpen.value = true
}

function openEdit(record: DeviceItem) {
  editing.value = record
  form.name = record.name
  form.sn = record.sn
  form.model = record.model
  modalOpen.value = true
}

async function onSubmit() {
  if (!form.name) {
    message.warning('请输入设备名称')
    return
  }
  if (editing.value) {
    await deviceApi.update(editing.value.id, { ...form })
    message.success('更新成功')
  } else {
    await deviceApi.create({ ...form } as Omit<DeviceItem, 'id'>)
    message.success('新增成功')
  }
  modalOpen.value = false
  load()
}

async function onDelete(record: DeviceItem) {
  await deviceApi.remove(record.id)
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
