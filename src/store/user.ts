import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, logout as logoutApi } from '@/api/auth'
import type { LoginForm } from '@/types/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const nickname = ref('')
  const avatar = ref('')

  const login = async (loginForm: LoginForm) => {
    const { data } = await loginApi(loginForm)
    token.value = data.token
    nickname.value = data.nickname
    avatar.value = data.avatar
    localStorage.setItem('token', data.token)
  }

  const logout = async () => {
    await logoutApi()
    token.value = ''
    nickname.value = ''
    avatar.value = ''
    localStorage.removeItem('token')
  }

  return {
    token,
    nickname,
    avatar,
    login,
    logout
  }
}) 