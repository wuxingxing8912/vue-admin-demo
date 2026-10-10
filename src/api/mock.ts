import type { UserInfo } from '@/stores/user'
import request from '@/utils/request'

// 第 1 月：全部内存 mock，不接后端。第 2 月把这些函数替换为 request.ts 的真实接口即可。
export interface UserItem extends UserInfo {
  age: number
  email: string
}

const seed: UserItem[] = [
  { id: 1, name: '张三111', age: 28, email: 'zhangsan@example.com' },
  { id: 2, name: '李四111', age: 32, email: 'lisi@example.com' },
  { id: 3, name: '王五111', age: 25, email: 'wangwu@example.com' },
]

let seq = 4

// 模拟网络延迟
function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

// 模拟登录：返回假 token 和用户信息
export async function login(username: string, password: string) {
  // const user: UserInfo = { id: 999, name: username || 'Admin' }
  // return delay({ token: 'mock-token-' + Date.now(), user }, 500)
  // 注意：request 拦截器会返回 data.data，即 { token, user }
  return request.post('/auth/login', { username, password })
}

export const userApi = {
  list: (keyword = '') => request.get('/users', { params: { keyword } }),
  create: (payload: Omit<UserItem, 'id'>) => request.post('/users', payload),
  update: (id: number, patch: Partial<UserItem>) => request.put(`/users/${id}`, patch),
  remove: (id: number) => request.delete(`/users/${id}`),
  // async list(keyword = '') {
  //   const list = seed.filter((u) => u.name.includes(keyword))
  //   return delay(list)
  // },
  // async create(payload: Omit<UserItem, 'id'>) {
  //   const item: UserItem = { id: seq++, ...payload }
  //   seed.push(item)
  //   return delay(item)
  // },
  // async update(id: number, patch: Partial<UserItem>) {
  //   const item = seed.find((u) => u.id === id)
  //   if (item) Object.assign(item, patch)
  //   return delay(item as UserItem)
  // },
  // async remove(id: number) {
  //   const i = seed.findIndex((u) => u.id === id)
  //   if (i >= 0) seed.splice(i, 1)
  //   return delay(true)
  // },
}

// ===== 设备管理 =====
export interface DeviceItem {
  id: number
  name: string // 设备名称
  sn: string // SN 序列号
  model: string // 型号
}

export const deviceApi = {
  list: (keyword = '') => request.get('/devices', { params: { keyword } }),
  create: (payload: Omit<DeviceItem, 'id'>) => request.post('/devices', payload),
  update: (id: number, patch: Partial<DeviceItem>) => request.put(`/devices/${id}`, patch),
  remove: (id: number) => request.delete(`/devices/${id}`),
}

// ===== 角色管理 =====
export interface RoleItem {
  id: number
  name: string // 角色名称
  description: string // 描述/备注
}

export const roleApi = {
  list: () => request.get('/roles'),
  create: (payload: Omit<RoleItem, 'id'>) => request.post('/roles', payload),
  update: (id: number, patch: Partial<RoleItem>) => request.put(`/roles/${id}`, patch),
  remove: (id: number) => request.delete(`/roles/${id}`),
}
