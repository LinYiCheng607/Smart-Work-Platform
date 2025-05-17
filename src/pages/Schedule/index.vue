<template>
  <div class="schedule-page">
    <!-- 左侧统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <template #header>
            <div class="card-header">
              <span>本月工作统计</span>
            </div>
          </template>
          <div class="stat-content">
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalHours }}</div>
              <div class="stat-label">总工时</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">¥{{ stats.totalIncome }}</div>
              <div class="stat-label">总收入</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalShifts }}</div>
              <div class="stat-label">总班次</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="18">
        <el-card class="schedule-card">
          <template #header>
            <div class="card-header">
              <div class="date-picker">
                <el-date-picker
                  v-model="currentDate"
                  type="date"
                  placeholder="选择日期"
                  format="YYYY/MM/DD"
                  @change="handleDateChange"
                />
              </div>
              <div class="schedule-actions">
                <el-button type="primary" @click="handleAddSchedule">
                  <el-icon><Plus /></el-icon>添加排班
                </el-button>
              </div>
            </div>
          </template>

          <!-- 日程内容 -->
          <div v-if="schedules.length" class="schedule-list">
            <el-timeline>
              <el-timeline-item
                v-for="schedule in schedules"
                :key="schedule.id"
                :timestamp="schedule.time"
                :type="getScheduleType(schedule.status)"
              >
                <el-card class="schedule-item">
                  <div class="schedule-info">
                    <h4>{{ schedule.jobTitle }} @ {{ schedule.company }}</h4>
                    <p class="location">
                      <el-icon><Location /></el-icon>
                      {{ schedule.location }}
                    </p>
                    <p class="salary">
                      <el-icon><Money /></el-icon>
                      预计收入：¥{{ schedule.salary }}
                    </p>
                  </div>
                  <div class="schedule-actions">
                    <el-tag :type="getStatusType(schedule.status)">
                      {{ schedule.status }}
                    </el-tag>
                    <div class="action-buttons">
                      <el-button 
                        v-if="schedule.status === '待确认'" 
                        type="success" 
                        size="small"
                        @click="handleConfirm(schedule)"
                      >
                        确认
                      </el-button>
                      <el-button 
                        v-if="schedule.status === '已确认'" 
                        type="warning" 
                        size="small"
                        @click="handleLeave(schedule)"
                      >
                        请假
                      </el-button>
                      <el-button 
                        type="danger" 
                        size="small"
                        @click="handleCancel(schedule)"
                      >
                        取消
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div v-else class="empty-schedule">
            <el-empty description="暂无排班">
              <el-button type="primary" @click="goToJobs">去岗位推荐页看看</el-button>
            </el-empty>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-row :gutter="20" class="quick-actions">
      <el-col :span="12">
        <el-card class="action-card" @click="handleInvite">
          <el-icon><User /></el-icon>
          <div class="action-content">
            <h3>邀好友赚钱</h3>
            <p>邀请好友兼职可获得奖励</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="action-card" @click="handleEarnings">
          <el-icon><Wallet /></el-icon>
          <div class="action-content">
            <h3>去赚钱</h3>
            <p>发起请假、补卡申请或查看工时统计</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加排班对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="添加排班"
      width="30%"
    >
      <el-form :model="scheduleForm" label-width="100px">
        <el-form-item label="工作日期">
          <el-date-picker
            v-model="scheduleForm.date"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="工作时间">
          <el-time-picker
            v-model="scheduleForm.time"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="工作岗位">
          <el-select v-model="scheduleForm.jobId" placeholder="选择岗位">
            <el-option
              v-for="job in availableJobs"
              :key="job.id"
              :label="job.title"
              :value="job.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitSchedule">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Location, 
  Money, 
  Plus, 
  User,
  Wallet 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 统计数据
const stats = ref({
  totalHours: 48,
  totalIncome: 1200,
  totalShifts: 6
})

// 当前选择的日期
const currentDate = ref(new Date())

// 排班列表
interface Schedule {
  id: number
  jobTitle: string
  company: string
  location: string
  time: string
  salary: number
  status: '待确认' | '已确认' | '已完成' | '已取消'
}

const schedules = ref<Schedule[]>([
  {
    id: 1,
    jobTitle: '仓库理货员',
    company: '京东物流',
    location: '厦门市海沧区',
    time: '09:00-17:00',
    salary: 180,
    status: '待确认'
  },
  {
    id: 2,
    jobTitle: '快递分拣员',
    company: '顺丰速运',
    location: '厦门市集美区',
    time: '14:00-22:00',
    salary: 200,
    status: '已确认'
  }
])

// 可选岗位列表
const availableJobs = ref([
  { id: 1, title: '仓库理货员' },
  { id: 2, title: '快递分拣员' },
  { id: 3, title: '商场导购' }
])

// 添加排班表单
const dialogVisible = ref(false)
const scheduleForm = ref({
  date: '',
  time: '',
  jobId: ''
})

// 日期变更处理
const handleDateChange = (date: Date) => {
  console.log('选择日期：', date)
  // TODO: 根据日期获取排班数据
}

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    '待确认': 'warning',
    '已确认': 'success',
    '已完成': 'info',
    '已取消': 'danger'
  }
  return map[status] || 'info'
}

// 获取时间线类型
const getScheduleType = (status: string) => {
  const map: Record<string, string> = {
    '待确认': 'warning',
    '已确认': 'success',
    '已完成': 'primary',
    '已取消': 'danger'
  }
  return map[status] || 'info'
}

// 添加排班
const handleAddSchedule = () => {
  dialogVisible.value = true
}

// 提交排班
const submitSchedule = () => {
  console.log('提交排班：', scheduleForm.value)
  ElMessage.success('添加排班成功')
  dialogVisible.value = false
}

// 确认排班
const handleConfirm = (schedule: Schedule) => {
  schedule.status = '已确认'
  ElMessage.success('已确认排班')
}

// 请假
const handleLeave = (schedule: Schedule) => {
  ElMessage.success('请假申请已提交')
}

// 取消排班
const handleCancel = (schedule: Schedule) => {
  schedule.status = '已取消'
  ElMessage.success('已取消排班')
}

// 跳转到岗位页
const goToJobs = () => {
  router.push('/jobs')
}

// 邀请好友
const handleInvite = () => {
  ElMessage.success('邀请链接已复制')
}

// 收入管理
const handleEarnings = () => {
  router.push('/profile/earnings')
}
</script>

<style scoped>
.schedule-page {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat-item {
  padding: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.schedule-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.schedule-list {
  margin-top: 20px;
}

.schedule-item {
  margin-bottom: 10px;
}

.schedule-info {
  margin-bottom: 10px;
}

.schedule-info h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

.location, .salary {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 5px 0;
  color: #606266;
}

.schedule-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.empty-schedule {
  padding: 40px 0;
  text-align: center;
}

.quick-actions {
  margin-top: 20px;
}

.action-card {
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
}

.action-card .el-icon {
  font-size: 24px;
  margin-right: 15px;
  color: #409EFF;
}

.action-content h3 {
  margin: 0;
  font-size: 16px;
}

.action-content p {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #909399;
}
</style> 