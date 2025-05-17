<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月收入</span>
              <el-tag size="small" type="success">月</el-tag>
            </div>
          </template>
          <div class="card-value">
            ¥ {{ monthlyIncome.toLocaleString() }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>工作时长</span>
              <el-tag size="small" type="primary">月</el-tag>
            </div>
          </template>
          <div class="card-value">
            {{ workHours }} 小时
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>完成工单</span>
              <el-tag size="small" type="warning">月</el-tag>
            </div>
          </template>
          <div class="card-value">
            {{ completedJobs }} 个
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>好评率</span>
              <el-tag size="small" type="info">月</el-tag>
            </div>
          </template>
          <div class="card-value">
            {{ (rating * 100).toFixed(1) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷功能 -->
    <el-row :gutter="20" class="quick-actions">
      <el-col :span="6">
        <el-card shadow="hover" @click="$router.push('/jobs')">
          <div class="action-card">
            <el-icon :size="32" color="#1890ff"><Search /></el-icon>
            <h3>找工作</h3>
            <p>浏览最新岗位</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" @click="$router.push('/schedule')">
          <div class="action-card">
            <el-icon :size="32" color="#52c41a"><Calendar /></el-icon>
            <h3>我的日程</h3>
            <p>管理工作安排</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" @click="$router.push('/profile')">
          <div class="action-card">
            <el-icon :size="32" color="#722ed1"><Document /></el-icon>
            <h3>我的简历</h3>
            <p>更新个人信息</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="action-card">
            <el-icon :size="32" color="#eb2f96"><Service /></el-icon>
            <h3>客服中心</h3>
            <p>联系我们</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近工作 -->
    <div class="recent-jobs">
      <div class="section-header">
        <h2>最近工作</h2>
        <el-button type="primary" text @click="$router.push('/jobs')">
          查看更多
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <el-table :data="recentJobs" style="width: 100%">
        <el-table-column prop="jobTitle" label="岗位" />
        <el-table-column prop="company" label="公司" />
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="salary" label="薪资" width="120">
          <template #default="{ row }">
            ¥ {{ row.salary.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Search,
  Calendar,
  Document,
  Service,
  ArrowRight
} from '@element-plus/icons-vue'

// 模拟数据
const monthlyIncome = ref(8500)
const workHours = ref(120)
const completedJobs = ref(15)
const rating = ref(0.985)

const recentJobs = ref([
  {
    jobTitle: '仓库理货员',
    company: '京东物流',
    date: '2023-12-15',
    salary: 350,
    status: 'completed'
  },
  {
    jobTitle: '快递分拣员',
    company: '顺丰速运',
    date: '2023-12-14',
    salary: 280,
    status: 'completed'
  },
  {
    jobTitle: '商场导购',
    company: '优衣库',
    date: '2023-12-13',
    salary: 400,
    status: 'processing'
  },
  {
    jobTitle: '餐厅服务员',
    company: '海底捞',
    date: '2023-12-12',
    salary: 320,
    status: 'cancelled'
  }
])

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    completed: 'success',
    processing: 'primary',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    processing: '进行中',
    cancelled: '已取消'
  }
  return map[status] || '未知'
}
</script>

<style lang="scss" scoped>
.dashboard {
  .statistics {
    margin-bottom: 24px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-value {
      font-size: 24px;
      font-weight: 600;
    }
  }

  .quick-actions {
    margin-bottom: 24px;

    .action-card {
      text-align: center;
      padding: 20px 0;
      cursor: pointer;

      h3 {
        margin: 16px 0 8px;
        font-size: 16px;
      }

      p {
        margin: 0;
        color: #666;
      }
    }
  }

  .recent-jobs {
    background: #fff;
    padding: 24px;
    border-radius: 4px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h2 {
        margin: 0;
        font-size: 18px;
      }
    }
  }
}
</style> 