<template>
  <div class="profile-page">
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
    <el-card class="income-card">
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
import { ref } from 'vue'
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

const router = useRouter()

// 用户信息
const userInfo = ref({
  id: '10086',
  name: '张三',
  avatar: '/avatars/default.png',
  verified: true,
  healthCert: true,
  totalHours: 128,
  completedJobs: 23,
  skillCerts: 3,
  rating: 4.8
})

// 收入信息
const income = ref({
  total: 3280,
  pending: 580
})

// 自动领取开关
const autoWithdraw = ref(false)

// 快捷入口配置
const jobEntries = [
  { title: '我的简历', icon: 'Document', path: '/profile/resume' },
  { title: '求职意向', icon: 'User', path: '/profile/intention' },
  { title: '我的关注', icon: 'Star', path: '/profile/favorites' },
  { title: '报名记录', icon: 'Document', path: '/profile/applications' },
  { title: '我的评价', icon: 'ChatRound', path: '/profile/reviews' }
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
const profileForm = ref({
  avatar: userInfo.value.avatar,
  name: userInfo.value.name,
  phone: '138****8888'
})

// 方法
const handleEditProfile = () => {
  dialogVisible.value = true
}

const handleSaveProfile = () => {
  userInfo.value.name = profileForm.value.name
  userInfo.value.avatar = profileForm.value.avatar
  ElMessage.success('保存成功')
  dialogVisible.value = false
}

const handleAvatarSuccess = (res: any) => {
  profileForm.value.avatar = res.url
}

const handleCertSuccess = () => {
  ElMessage.success('健康证上传成功')
  userInfo.value.healthCert = true
}

const handleAutoWithdrawChange = (value: boolean) => {
  ElMessage.success(value ? '已开启自动领取' : '已关闭自动领取')
}

const handleWithdraw = () => {
  ElMessage.success(`已领取${income.value.pending}元`)
  income.value.pending = 0
}

const viewIncomeDetails = () => {
  router.push('/profile/income-details')
}

const handleEntryClick = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.profile-page {
  padding: 20px;
}

.profile-card {
  margin-bottom: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-content h2 {
  margin: 0 0 5px 0;
}

.user-id {
  margin: 0 0 10px 0;
  color: #909399;
}

.user-tags {
  display: flex;
  gap: 10px;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
  margin-top: 20px;
}

.stat-item {
  padding: 0 20px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  margin-top: 5px;
  color: #909399;
}

.income-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.income-content {
  padding: 20px 0;
}

.income-overview {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.income-item {
  text-align: center;
}

.income-item .label {
  display: block;
  color: #909399;
  margin-bottom: 5px;
}

.income-item .value {
  font-size: 24px;
  font-weight: bold;
}

.income-item .value.highlight {
  color: #f56c6c;
}

.income-actions {
  text-align: center;
}

.quick-entries {
  margin-top: 20px;
}

.entry-card {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.entry-card:hover {
  transform: translateY(-5px);
}

.entry-card .el-icon {
  font-size: 24px;
  color: #409EFF;
  margin-bottom: 10px;
}

.mt-20 {
  margin-top: 20px;
}

.avatar-uploader {
  text-align: center;
}

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
</style> 