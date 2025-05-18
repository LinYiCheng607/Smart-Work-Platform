<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>智慧零工平台</h2>
        </div>
      </template>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0"
        size="large"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="form-footer">
          <router-link to="/register">还没有账号？立即注册</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { login, getUserInfo } from '@/api/auth'
import type { LoginForm, LoginResponse } from '@/types/auth'
import { useUserStore } from '@/stores/user'
import { USER_ROLES } from '@/constants/user'

const router = useRouter()
const loading = ref(false)
const loginFormRef = ref<FormInstance>()
const userStore = useUserStore()

const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        
        // 在开发环境中，检查是否有注册信息
        if (import.meta.env.DEV) {
          // 获取已注册用户列表
          const registeredUsersStr = localStorage.getItem('registered_users');
          if (registeredUsersStr) {
            const registeredUsers = JSON.parse(registeredUsersStr);
            
            // 查找匹配的用户
            const matchedUser = registeredUsers.find((user: any) => 
              user.username === loginForm.username && user.password === loginForm.password
            );
            
            if (matchedUser) {
              console.log('找到匹配的注册用户:', matchedUser);
              console.log('用户角色:', matchedUser.role);
              
              // 存储用户信息
              localStorage.setItem('user_name', matchedUser.name);
              localStorage.setItem('username', matchedUser.username);
              localStorage.setItem('user_id', String(Date.now()));
              localStorage.setItem('user_role', String(matchedUser.role));
              localStorage.setItem('access_token', 'mock_token_for_registered_user');
              localStorage.setItem('refresh_token', 'mock_refresh_token');
              
              // 更新用户信息
              userStore.setUserInfo({
                id: Date.now(),
                username: matchedUser.username,
                name: matchedUser.name,
                phone: matchedUser.phone || '',
                avatar: null,
                role: Number(matchedUser.role),
                id_card: matchedUser.id_card || '',
                skill_tags: ''
              });
              
              ElMessage.success('登录成功');
              router.push('/');
              return;
            }
          }
        }
        
        const response = await login(loginForm)
        const data = response as unknown as LoginResponse
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        
        // 直接从登录响应中获取用户信息
        if (data.user) {
          console.log('API返回的用户信息:', data.user)
          console.log('用户角色:', data.user.role)
          
          // 确保角色值是数字类型
          let roleValue = Number(data.user.role);
          if (isNaN(roleValue)) {
            console.error('角色值转换失败:', data.user.role);
            roleValue = USER_ROLES.WORKER;
          }
          
          // 创建一个新的用户对象，确保角色值是数字
          const userInfo = {
            ...data.user,
            role: roleValue
          };
          
          userStore.setUserInfo(userInfo);
          if (data.user.avatar) {
            userStore.updateAvatar(data.user.avatar);
          }
          
          // 将用户信息存储到localStorage中，以便在刷新页面后仍能显示
          localStorage.setItem('user_name', data.user.name);
          localStorage.setItem('username', data.user.username);
          localStorage.setItem('user_id', String(data.user.id));
          localStorage.setItem('user_role', String(roleValue));
          
          console.log('存储到localStorage的角色值:', roleValue);
        } else {
          // 如果登录响应中没有用户信息，则使用登录的用户名作为显示名
          // 生成一个临时ID (数字类型)
          const tempId = Date.now()
          const userInfo = {
            id: tempId,
            username: loginForm.username,
            name: loginForm.username,
            phone: '',
            avatar: null,
            role: USER_ROLES.WORKER, // 默认为求职者角色
            id_card: '',
            skill_tags: ''
          }
          userStore.setUserInfo(userInfo)
          localStorage.setItem('user_name', loginForm.username)
          localStorage.setItem('username', loginForm.username)
          localStorage.setItem('user_id', String(tempId))
          localStorage.setItem('user_role', String(USER_ROLES.WORKER))
        }
        
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  
  .login-card {
    width: 400px;
    
    .card-header {
      text-align: center;
      
      h2 {
        margin: 0;
        color: #303133;
      }
    }
    
    .login-button {
      width: 100%;
    }
    
    .form-footer {
      text-align: center;
      margin-top: 16px;
      
      a {
        color: #409eff;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style> 