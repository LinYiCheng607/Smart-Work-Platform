<template>
  <div class="job-publish-page">
    <!-- 权限检查 -->
    <el-card v-if="!isEmployer" class="no-permission-card">
      <el-result
        icon="warning"
        title="权限不足"
        sub-title="您当前是求职者身份，没有权限发布岗位"
      >
        <template #extra>
          <el-button type="primary" @click="goBack">返回</el-button>
        </template>
      </el-result>
    </el-card>
    
    <!-- 发布岗位表单 -->
    <el-card v-else class="publish-card">
      <template #header>
        <div class="card-header">
          <h2>发布岗位</h2>
          <p>填写岗位信息，发布后将在岗位列表中显示</p>
        </div>
      </template>
      
      <el-form 
        ref="formRef" 
        :model="jobForm" 
        :rules="rules" 
        label-width="100px" 
        label-position="top"
        status-icon
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="岗位名称" prop="title">
              <el-input v-model="jobForm.title" placeholder="请输入岗位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="company">
              <el-input v-model="jobForm.company" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="薪资范围" prop="salary">
              <el-input v-model="jobForm.salary" placeholder="例如：180-220">
                <template #append>元/天</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作地点" prop="location">
              <el-input v-model="jobForm.location" placeholder="例如：厦门市思明区" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工作区域" prop="workLocation">
              <el-select v-model="jobForm.workLocation" placeholder="请选择工作区域" style="width: 100%">
                <el-option label="厦门市思明区" value="siming" />
                <el-option label="厦门市湖里区" value="huli" />
                <el-option label="厦门市集美区" value="jimei" />
                <el-option label="厦门市海沧区" value="haicang" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作类型" prop="type">
              <el-select v-model="jobForm.type" placeholder="请选择工作类型" style="width: 100%">
                <el-option label="全职" value="fulltime" />
                <el-option label="兼职" value="parttime" />
                <el-option label="临时工" value="temporary" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="岗位标签" prop="tags">
          <el-select
            v-model="jobForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或创建标签"
            style="width: 100%"
          >
            <el-option label="轻松不累" value="轻松不累" />
            <el-option label="学历不限" value="学历不限" />
            <el-option label="经验不限" value="经验不限" />
            <el-option label="1年以下" value="1年以下" />
            <el-option label="1-3年" value="1-3年" />
            <el-option label="3-5年" value="3-5年" />
            <el-option label="高中" value="高中" />
            <el-option label="大专" value="大专" />
            <el-option label="本科" value="本科" />
            <el-option label="体力好" value="体力好" />
          </el-select>
        </el-form-item>

        <el-form-item label="岗位描述" prop="description">
          <el-input
            v-model="jobForm.description"
            type="textarea"
            rows="4"
            placeholder="请详细描述岗位职责、要求等信息"
          />
        </el-form-item>

        <el-form-item label="工时奖励" prop="workTimeBonus">
          <el-input v-model="jobForm.workTimeBonus" placeholder="例如：满60工时奖励60元" />
        </el-form-item>

        <el-form-item>
          <el-switch
            v-model="jobForm.isUrgent"
            active-text="急聘岗位"
            inactive-text="普通岗位"
          />
        </el-form-item>

        <el-form-item>
          <el-switch
            v-model="jobForm.isFlashPay"
            active-text="闪电结算"
            inactive-text="普通结算"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm(formRef)">发布岗位</el-button>
          <el-button @click="resetForm(formRef)">重置</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createJob } from '@/api/jobs'
import type { JobCreateForm } from '@/api/jobs'
import { useUserStore } from '@/stores/user'
import { USER_ROLES } from '@/constants/user'
import { getUserInfo } from '@/api/auth'
import type { UserInfo } from '@/types/auth'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const userStore = useUserStore()

// 从后端获取最新的用户信息
const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }
    
    console.log('正在从后端获取用户信息...')
    const response = await getUserInfo()
    const userInfo = response as unknown as UserInfo
    console.log('从后端获取的用户信息:', userInfo)
    
    if (userInfo) {
      // 更新用户信息
      userStore.setUserInfo(userInfo)
      console.log('更新后的用户信息:', userStore.userInfo)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 页面加载时获取最新的用户信息
onMounted(() => {
  fetchUserInfo()
})

// 判断当前用户是否为雇主
const isEmployer = computed(() => {
  const userRole = userStore.userInfo?.role;
  console.log('当前用户角色:', userRole, typeof userRole);
  console.log('雇主角色常量:', USER_ROLES.EMPLOYER, typeof USER_ROLES.EMPLOYER);
  
  // 直接检查角色值是否为1（雇主）
  const roleValue = Number(userRole);
  console.log('转换后的角色值:', roleValue, typeof roleValue);
  
  // 尝试多种比较方式
  const isMatch1 = roleValue === USER_ROLES.EMPLOYER;
  const isMatch2 = roleValue === 1;
  const isMatch3 = String(roleValue) === String(USER_ROLES.EMPLOYER);
  
  console.log('比较结果1 (roleValue === USER_ROLES.EMPLOYER):', isMatch1);
  console.log('比较结果2 (roleValue === 1):', isMatch2);
  console.log('比较结果3 (String(roleValue) === String(USER_ROLES.EMPLOYER)):', isMatch3);
  
  // 使用最直接的比较
  return roleValue === 1;
})

// 岗位表单
const jobForm = reactive<JobCreateForm>({
  title: '',
  company: '',
  salary: '',
  location: '',
  tags: [],
  description: '',
  isUrgent: false,
  workTimeBonus: '',
  isFlashPay: false,
  type: '',
  workLocation: ''
})

// 表单验证规则
const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
    { min: 2, max: 50, message: '岗位名称长度应在2-50个字符之间', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' },
    { min: 2, max: 50, message: '公司名称长度应在2-50个字符之间', trigger: 'blur' }
  ],
  salary: [
    { required: true, message: '请输入薪资范围', trigger: 'blur' },
    { pattern: /^\d+-\d+$/, message: '薪资格式应为"最低-最高"，例如：180-220', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入工作地点', trigger: 'blur' }
  ],
  workLocation: [
    { required: true, message: '请选择工作区域', trigger: 'change' }
  ],
  type: [
    { required: true, message: '请选择工作类型', trigger: 'change' }
  ],
  tags: [
    { required: true, message: '请至少选择一个岗位标签', trigger: 'change' },
    { type: 'array', min: 1, message: '请至少选择一个岗位标签', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入岗位描述', trigger: 'blur' },
    { min: 10, max: 500, message: '岗位描述长度应在10-500个字符之间', trigger: 'blur' }
  ]
})

// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        // 在开发环境中模拟发布成功
        if (import.meta.env.DEV) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // 准备保存到本地存储的岗位数据
          const newJob = {
            ...jobForm,
            id: Date.now(), // 使用时间戳作为临时ID
            logo: '/company-logos/default.svg', // 默认logo
            distance: '距地铁站300米', // 默认距离信息
            isFavorite: false // 默认未收藏
          }
          
          // 获取已有的发布岗位
          const localJobsStr = localStorage.getItem('published_jobs')
          const localJobs = localJobsStr ? JSON.parse(localJobsStr) : []
          
          // 添加新岗位
          localJobs.push(newJob)
          
          // 保存回本地存储
          localStorage.setItem('published_jobs', JSON.stringify(localJobs))
          
          ElMessage.success('岗位发布成功')
          router.push('/jobs')
        } else {
          await createJob(jobForm)
          ElMessage.success('岗位发布成功')
          router.push('/jobs')
        }
      } catch (error) {
        console.error('发布岗位失败:', error)
        ElMessage.error('发布岗位失败，请稍后重试')
      } finally {
        loading.value = false
      }
    } else {
      console.log('表单验证失败:', fields)
    }
  })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.job-publish-page {
  padding: 20px;
  
  .publish-card, .no-permission-card {
    max-width: 1000px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .card-header {
      h2 {
        margin: 0 0 10px;
        font-size: 20px;
        font-weight: 600;
      }
      
      p {
        margin: 0;
        color: #606266;
        font-size: 14px;
      }
    }
  }
}
</style> 