import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface UserInfo {
  id: number
  name: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  function login(t: string, info: UserInfo) {
    token.value = t
    userInfo.value = info
    localStorage.setItem('token', t)
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return { token, userInfo, isLoggedIn, login, logout }
})
