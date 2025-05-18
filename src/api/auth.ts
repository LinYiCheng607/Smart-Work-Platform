import request from '@/utils/request'
import type { LoginForm, LoginResponse, UserInfo, RegisterForm } from '@/types/auth'

export function login(data: LoginForm) {
  // 在开发环境中使用模拟数据
  if (import.meta.env.DEV) {
    // 模拟API延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟登录响应
        const mockResponse = {
          access: 'mock_access_token',
          refresh: 'mock_refresh_token',
          user: {
            id: 1,
            username: data.username,
            name: data.username,
            phone: '13800138000',
            avatar: null,
            // 根据用户名判断角色，以便于测试
            role: data.username.includes('employer') ? 1 : 0,
            id_card: '',
            skill_tags: ''
          }
        };
        resolve(mockResponse);
      }, 500);
    });
  }
  
  return request.post<LoginResponse>('/user/login/', data)
}

export function register(data: RegisterForm) {
  // 在开发环境中使用模拟数据
  if (import.meta.env.DEV) {
    // 模拟API延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        // 将注册信息存储到localStorage中，以便后续使用
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        registeredUsers.push(data);
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
        
        resolve({ success: true });
      }, 500);
    });
  }
  
  return request.post('/user/register/', data)
}

export function refreshToken(refresh: string) {
  // 在开发环境中使用模拟数据
  if (import.meta.env.DEV) {
    // 模拟API延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          access: 'new_mock_access_token',
          refresh: 'new_mock_refresh_token'
        });
      }, 500);
    });
  }
  
  return request.post('/user/refresh/refresh/', { refresh })
}

export function getUserInfo() {
  // 在开发环境中使用模拟数据
  if (import.meta.env.DEV) {
    // 模拟API延迟
    return new Promise((resolve) => {
      setTimeout(() => {
        // 从localStorage中获取用户角色
        const userRole = localStorage.getItem('user_role');
        const userName = localStorage.getItem('user_name');
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('user_id');
        
        console.log('模拟getUserInfo - 从localStorage读取的角色:', userRole);
        
        if (!userRole || !userName) {
          // 如果没有找到用户信息，返回一个默认的求职者角色
          resolve({
            id: 0,
            username: 'guest',
            name: '访客',
            phone: '',
            avatar: null,
            role: 0, // 默认为求职者角色
            id_card: '',
            skill_tags: ''
          });
          return;
        }
        
        // 返回模拟的用户信息
        const mockUserInfo = {
          id: userId ? parseInt(userId) : 1,
          username: username || userName,
          name: userName,
          phone: '13800138000',
          avatar: null,
          role: parseInt(userRole), // 使用localStorage中存储的角色
          id_card: '',
          skill_tags: ''
        };
        
        console.log('模拟getUserInfo - 返回的用户信息:', mockUserInfo);
        resolve(mockUserInfo);
      }, 500);
    });
  }
  
  return request.get<UserInfo>('/user/info/')
} 