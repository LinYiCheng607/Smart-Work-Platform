import { defineStore } from 'pinia'

interface UserState {
  avatar: string
  token: string
  userInfo: {
    id: string
    name: string
    phone: string
  } | null
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
    
    setUserInfo(info: UserState['userInfo']) {
      this.userInfo = info
    },
    
    clearUserInfo() {
      this.avatar = ''
      this.token = ''
      this.userInfo = null
    }
  }
}) 