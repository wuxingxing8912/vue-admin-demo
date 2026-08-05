import axios from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

const request = axios.create({
  baseURL: '/api', // 第 2 月替换为真实后端地址（如 http://localhost:3000）
  timeout: 10000,
})

// 请求拦截器：自动带 token
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  const token = userStore.token || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一处理错误码与提示
request.interceptors.response.use(
  (response) => {
    const data = response.data
    // 约定后端返回 { code, data, message }
    if (data.code !== 0 && data.code !== 200) {
      message.error(data.message || '请求失败')
      return Promise.reject(data)
    }
    return data.data
  },
  (error) => {
    if (error.response?.status === 401) {
      message.error('登录已过期，请重新登录')
      const userStore = useUserStore()
      userStore.logout()
      location.href = '/login'
      return Promise.reject(error)
    }
    message.error(error.message || '网络错误')
    return Promise.reject(error)
  },
)

export default request
