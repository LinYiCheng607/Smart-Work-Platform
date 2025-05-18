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
        const response = await login(loginForm)
        const data = response as unknown as LoginResponse
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        
        // 直接从登录响应中获取用户信息
        if (data.user) {
          userStore.setUserInfo(data.user)
          if (data.user.avatar) {
            userStore.updateAvatar(data.user.avatar)
          }
          // 将用户名存储到localStorage中，以便在刷新页面后仍能显示
          localStorage.setItem('user_name', data.user.name)
          localStorage.setItem('username', data.user.username)
        } else {
          // 如果登录响应中没有用户信息，则使用登录的用户名作为显示名
          const userInfo = {
            id: 0,
            username: loginForm.username,
            name: loginForm.username,
            phone: '',
            avatar: null,
            role: 0,
            id_card: '',
            skill_tags: ''
          }
          userStore.setUserInfo(userInfo)
          localStorage.setItem('user_name', loginForm.username)
          localStorage.setItem('username', loginForm.username)
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