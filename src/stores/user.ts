import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/auth'

interface UserState {
  avatar: string
  token: string
  userInfo: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    avatar: '',
    token: '',
    userInfo: null
  }),
  
  actions: {
    updateAvatar(url: string) {
      this.avatar = url
    },
    
    setToken(token: string) {
      this.token = token
    },
    
    setUserInfo(info: UserInfo) {
      this.userInfo = info
    },
    
    clearUserInfo() {
      this.avatar = ''
      this.token = ''
      this.userInfo = null
    }
  }
}) 