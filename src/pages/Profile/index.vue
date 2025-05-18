<template>
  <div class="profile-page" v-loading="loading">
    <!-- 基础信息卡片 -->
    <el-card class="profile-card">
      <div class="profile-header">
        <div class="profile-info">
          <el-avatar :size="80" :src="userInfo.avatar" />
          <div class="info-content">
            <h2>{{ userInfo.name }}</h2>
            <p class="user-id">ID: {{ userInfo.id }}</p>
            <div class="user-tags">
              <el-tag v-if="userInfo.verified" type="success" size="small">已实名认证</el-tag>
              <el-tag v-if="userInfo.healthCert" type="warning" size="small">健康证已上传</el-tag>
            </div>
          </div>
        </div>
        <el-button type="primary" @click="handleEditProfile">编辑资料</el-button>
      </div>

      <el-divider />

      <div class="profile-stats">
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.totalHours }}</div>
          <div class="stat-label">累计工时</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.completedJobs }}</div>
          <div class="stat-label">完成工单</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.skillCerts }}</div>
          <div class="stat-label">技能认证</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userInfo.rating }}</div>
          <div class="stat-label">综合评分</div>
        </div>
      </div>
    </el-card>

    <!-- 收入管理卡片 -->
    <el-card class="income-card" v-loading="incomeLoading">
      <template #header>
        <div class="card-header">
          <h3>收入管理</h3>
          <el-switch
            v-model="autoWithdraw"
            active-text="自动领取"
            @change="handleAutoWithdrawChange"
          />
        </div>
      </template>
      <div class="income-content">
        <div class="income-overview">
          <div class="income-item">
            <span class="label">累计收入</span>
            <span class="value">¥{{ income.total }}</span>
          </div>
          <div class="income-item">
            <span class="label">待领取</span>
            <span class="value highlight">¥{{ income.pending }}</span>
          </div>
        </div>
        <div class="income-actions">
          <el-button type="primary" @click="handleWithdraw" :disabled="!income.pending">
            立即领取
          </el-button>
          <el-button @click="viewIncomeDetails">查看明细</el-button>
        </div>
      </div>
    </el-card>

    <!-- 快捷入口 -->
    <div class="quick-entries">
      <el-row :gutter="20">
        <!-- 求职相关 -->
        <el-col :span="6" v-for="entry in jobEntries" :key="entry.path">
          <el-card class="entry-card" shadow="hover" @click="handleEntryClick(entry.path)">
            <el-icon><component :is="entry.icon" /></el-icon>
            <span>{{ entry.title }}</span>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-20">
        <!-- 活动相关 -->
        <el-col :span="6" v-for="entry in activityEntries" :key="entry.path">
          <el-card class="entry-card" shadow="hover" @click="handleEntryClick(entry.path)">
            <el-icon><component :is="entry.icon" /></el-icon>
            <span>{{ entry.title }}</span>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-20">
        <!-- 设置相关 -->
        <el-col :span="6" v-for="entry in settingEntries" :key="entry.path">
          <el-card class="entry-card" shadow="hover" @click="handleEntryClick(entry.path)">
            <el-icon><component :is="entry.icon" /></el-icon>
            <span>{{ entry.title }}</span>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑个人资料"
      width="500px"
    >
      <el-form :model="profileForm" label-width="100px">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="profileForm.name" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="profileForm.phone" disabled />
        </el-form-item>
        <el-form-item label="健康证">
          <el-upload
            class="health-cert-uploader"
            action="/api/upload"
            :on-success="handleCertSuccess"
          >
            <el-button type="primary">上传健康证</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus,
  User,
  Star,
  Document,
  Money,
  Present,
  CreditCard,
  Service,
  Setting,
  Lock
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getUserProfile, getIncomeInfo, updateProfile, withdrawIncome, setAutoWithdraw } from '@/api/profile'
import type { UserProfile, IncomeInfo, ProfileForm } from '@/api/profile'

const router = useRouter()

// 加载状态
const loading = ref(false)
const incomeLoading = ref(false)

// 用户信息
const userInfo = ref<UserProfile>({
  id: '',
  name: '',
  avatar: '',
  verified: false,
  healthCert: false,
  totalHours: 0,
  completedJobs: 0,
  skillCerts: 0,
  rating: 0
})

// 收入信息
const income = ref<IncomeInfo>({
  total: 0,
  pending: 0
})

// 自动领取开关
const autoWithdraw = ref(false)

// 快捷入口配置
const jobEntries = [
  { title: '我的简历', icon: 'Document', path: '/profile/resume' },
  { title: '求职意向', icon: 'User', path: '/profile/intention' },
  { title: '我的关注', icon: 'Star', path: '/profile/favorites' },
  { title: '报名记录', icon: 'Document', path: '/profile/applications' }
]

const activityEntries = [
  { title: '邀请有礼', icon: 'Present', path: '/profile/invite' },
  { title: '奖励中心', icon: 'Money', path: '/profile/rewards' },
  { title: '银行卡', icon: 'CreditCard', path: '/profile/bank-cards' }
]

const settingEntries = [
  { title: '在线客服', icon: 'Service', path: '/profile/service' },
  { title: '安全保障', icon: 'Lock', path: '/profile/security' },
  { title: '设置', icon: 'Setting', path: '/profile/settings' }
]

// 编辑资料
const dialogVisible = ref(false)
const profileForm = reactive<ProfileForm>({
  avatar: '',
  name: '',
  phone: ''
})

// 获取用户信息
const fetchUserProfile = async () => {
  loading.value = true
  try {
    // 尝试从localStorage获取用户名
    const storedName = localStorage.getItem('user_name')
    const username = localStorage.getItem('username')
    const userId = localStorage.getItem('user_id')
    
    // 如果后端API尚未实现，使用模拟数据或localStorage中的数据
    if (import.meta.env.DEV) {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 优先使用localStorage中的用户名
      userInfo.value = {
        id: userId || '10086',
        name: storedName || '未登录',
        avatar: '/avatars/default.png',
        verified: true,
        healthCert: true,
        totalHours: 128,
        completedJobs: 23,
        skillCerts: 3,
        rating: 4.8
      }
    } else {
      try {
        const res = await getUserProfile()
        userInfo.value = res.data
        
        // 如果API返回的用户名为空，但localStorage中有用户名，则使用localStorage中的用户名
        if (!userInfo.value.name && storedName) {
          userInfo.value.name = storedName
        }
      } catch (error) {
        console.error('获取用户信息API失败，使用本地存储:', error)
        // API调用失败时，使用localStorage中的数据
        if (storedName) {
          userInfo.value = {
            id: userId || '10086',
            name: storedName,
            avatar: '/avatars/default.png',
            verified: true,
            healthCert: true,
            totalHours: 128,
            completedJobs: 23,
            skillCerts: 3,
            rating: 4.8
          }
        }
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 获取收入信息
const fetchIncomeInfo = async () => {
  incomeLoading.value = true
  try {
    // 如果后端API尚未实现，使用模拟数据
    if (import.meta.env.DEV) {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      income.value = {
        total: 3280,
        pending: 580
      }
    } else {
      const res = await getIncomeInfo()
      income.value = res.data
    }
  } catch (error) {
    console.error('获取收入信息失败:', error)
    ElMessage.error('获取收入信息失败，请稍后重试')
  } finally {
    incomeLoading.value = false
  }
}

// 编辑个人资料
const handleEditProfile = () => {
  profileForm.avatar = userInfo.value.avatar
  profileForm.name = userInfo.value.name
  profileForm.phone = '138****8888' // 这里应该从用户信息中获取
  dialogVisible.value = true
}

// 保存个人资料
const handleSaveProfile = async () => {
  try {
    await updateProfile(profileForm)
    userInfo.value.name = profileForm.name
    userInfo.value.avatar = profileForm.avatar
    ElMessage.success('保存成功')
    dialogVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  }
}

// 头像上传成功
const handleAvatarSuccess = (res: any) => {
  profileForm.avatar = res.url
}

// 健康证上传成功
const handleCertSuccess = () => {
  ElMessage.success('健康证上传成功')
  userInfo.value.healthCert = true
}

// 切换自动领取
const handleAutoWithdrawChange = async (value: boolean) => {
  try {
    await setAutoWithdraw(value)
    ElMessage.success(value ? '已开启自动领取' : '已关闭自动领取')
  } catch (error) {
    console.error('设置失败:', error)
    ElMessage.error('设置失败，请稍后重试')
    // 恢复开关状态
    autoWithdraw.value = !value
  }
}

// 领取收入
const handleWithdraw = async () => {
  try {
    await withdrawIncome()
    ElMessage.success(`已领取${income.value.pending}元`)
    income.value.pending = 0
  } catch (error) {
    console.error('领取失败:', error)
    ElMessage.error('领取失败，请稍后重试')
  }
}

// 查看收入明细
const viewIncomeDetails = () => {
  router.push('/profile/income-details')
}

// 点击快捷入口
const handleEntryClick = (path: string) => {
  router.push(path)
}

// 页面加载时获取数据
onMounted(() => {
  fetchUserProfile()
  fetchIncomeInfo()
})
</script>

<style lang="scss" scoped>
.profile-page {
  .profile-card {
    margin-bottom: 20px;
    
    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .profile-info {
        display: flex;
        align-items: center;
        
        .info-content {
          margin-left: 16px;
          
          h2 {
            margin: 0 0 8px;
          }
          
          .user-id {
            margin: 0 0 8px;
            color: #666;
          }
          
          .user-tags {
            .el-tag {
              margin-right: 8px;
            }
          }
        }
      }
    }
    
    .profile-stats {
      display: flex;
      justify-content: space-around;
      text-align: center;
      
      .stat-item {
        padding: 0 16px;
        
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #409eff;
          margin-bottom: 8px;
        }
        
        .stat-label {
          color: #666;
        }
      }
    }
  }
  
  .income-card {
    margin-bottom: 20px;
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h3 {
        margin: 0;
      }
    }
    
    .income-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .income-overview {
        .income-item {
          margin-bottom: 12px;
          
          .label {
            color: #666;
            margin-right: 16px;
          }
          
          .value {
            font-weight: bold;
            font-size: 18px;
            
            &.highlight {
              color: #f56c6c;
            }
          }
        }
      }
      
      .income-actions {
        display: flex;
        gap: 12px;
      }
    }
  }
  
  .quick-entries {
    .entry-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      cursor: pointer;
      
      .el-icon {
        font-size: 24px;
        margin-bottom: 8px;
      }
    }
    
    .mt-20 {
      margin-top: 20px;
    }
  }
  
  .avatar-uploader {
    display: flex;
    justify-content: center;
    
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
    
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
    }
  }
}
</style> 