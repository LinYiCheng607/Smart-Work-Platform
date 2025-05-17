import request from '@/utils/request'
import type { LoginForm, LoginResponse, UserInfo, RegisterForm } from '@/types/auth'

export function login(data: LoginForm) {
  return request.post<LoginResponse>('/user/login/', data)
}

export function register(data: RegisterForm) {
  return request.post('/user/register/', data)
}

export function refreshToken(refresh: string) {
  return request.post('/user/refresh/refresh/', { refresh })
}

export function getUserInfo() {
  return request.get<UserInfo>('/user/info/')
} 