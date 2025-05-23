<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <div class="card-header">
          <h2>注册账号</h2>
        </div>
      </template>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        size="large"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
          />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="registerForm.name"
            placeholder="请输入真实姓名"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号"
          />
        </el-form-item>
        
        <el-form-item label="身份证号" prop="id_card">
          <el-input
            v-model="registerForm.id_card"
            placeholder="请输入身份证号"
          />
        </el-form-item>
        
        <el-form-item label="用户类型" prop="role">
          <el-select v-model="registerForm.role" placeholder="请选择用户类型">
            <el-option label="零工求职者" :value="0" />
            <el-option label="雇主" :value="1" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="register-button"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
        
        <div class="form-footer">
          <router-link to="/login">已有账号？立即登录</router-link>
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
import { register } from '@/api/auth'
import type { RegisterForm } from '@/types/auth'
import { USER_ROLES } from '@/constants/user'

const router = useRouter()
const loading = ref(false)
const registerFormRef = ref<FormInstance>()

const registerForm = reactive<RegisterForm>({
  username: '',
  password: '',
  name: '',
  phone: '',
  id_card: '',
  role: USER_ROLES.WORKER
})

const validatePhone = (rule: any, value: string, callback: any) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!phoneRegex.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

const validateIdCard = (rule: any, value: string, callback: any) => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!value) {
    callback(new Error('请输入身份证号'))
  } else if (!idCardRegex.test(value)) {
    callback(new Error('请输入正确的身份证号'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, validator: validatePhone, trigger: 'blur' }
  ],
  id_card: [
    { required: true, validator: validateIdCard, trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户类型', trigger: 'change' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        console.log('注册表单数据:', registerForm)
        console.log('选择的角色值:', registerForm.role)
        console.log('雇主角色常量:', USER_ROLES.EMPLOYER)
        
        let roleValue = Number(registerForm.role);
        if (isNaN(roleValue)) {
          console.error('角色值转换失败:', registerForm.role);
          roleValue = USER_ROLES.WORKER;
        }
        
        const registerData = {
          username: registerForm.username,
          password: registerForm.password,
          name: registerForm.name,
          phone: registerForm.phone,
          id_card: registerForm.id_card,
          role: roleValue
        }
        
        console.log('提交的注册数据:', registerData)
        
        await register(registerData)
        
        // 在开发环境中，手动将注册信息存储到localStorage中
        if (import.meta.env.DEV) {
          // 生成一个临时ID
          const tempId = Date.now();
          
          // 存储用户信息，以便在登录时使用
          localStorage.setItem('last_registered_user', JSON.stringify({
            id: tempId,
            username: registerData.username,
            name: registerData.name,
            role: registerData.role
          }));
          
          console.log('已将注册信息存储到localStorage中');
        }
        
        ElMessage.success('注册成功')
        router.push('/login')
      } catch (error: any) {
        console.error('Registration error:', error.response?.data)
        ElMessage.error(error.response?.data?.errors?.message || error.response?.data?.message || '注册失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  
  .register-card {
    width: 500px;
    
    .card-header {
      text-align: center;
      
      h2 {
        margin: 0;
        color: #303133;
      }
    }
    
    .register-button {
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