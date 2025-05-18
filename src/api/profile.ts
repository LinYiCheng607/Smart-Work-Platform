import request from '@/utils/request'

// 用户信息接口
export interface UserProfile {
  id: string
  name: string
  avatar: string
  verified: boolean
  healthCert: boolean
  totalHours: number
  completedJobs: number
  skillCerts: number
  rating: number
}

// 收入信息接口
export interface IncomeInfo {
  total: number
  pending: number
}

// 个人资料表单接口
export interface ProfileForm {
  avatar: string
  name: string
  phone: string
  healthCert?: File
}

// 获取用户信息
export function getUserProfile() {
  return request.get<UserProfile>('/profile')
}

// 获取收入信息
export function getIncomeInfo() {
  return request.get<IncomeInfo>('/profile/income')
}

// 更新用户资料
export function updateProfile(data: ProfileForm) {
  const formData = new FormData()
  formData.append('name', data.name)
  
  if (data.avatar && data.avatar.startsWith('data:')) {
    // 如果是新上传的头像（base64格式），需要转换处理
    const blob = dataURLtoBlob(data.avatar)
    formData.append('avatar', blob, 'avatar.png')
  }
  
  if (data.healthCert) {
    formData.append('healthCert', data.healthCert)
  }
  
  return request.post('/profile/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 领取收入
export function withdrawIncome() {
  return request.post('/profile/withdraw')
}

// 设置自动领取
export function setAutoWithdraw(enabled: boolean) {
  return request.post('/profile/auto-withdraw', { enabled })
}

// 辅助函数：将base64转换为Blob
function dataURLtoBlob(dataURL: string) {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new Blob([u8arr], { type: mime })
} 