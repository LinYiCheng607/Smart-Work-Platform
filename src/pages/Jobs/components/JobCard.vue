<template>
  <el-card class="job-card" :body-style="{ padding: '0px' }">
    <div class="job-header">
      <img :src="getJobTypeBanner" class="type-banner" />
      <div class="job-info">
        <h3 class="job-title">{{ job.title }}</h3>
        <p class="company">{{ job.company }}</p>
      </div>
    </div>
    
    <div class="job-content">
      <div class="salary">
        <span class="amount">{{ formatSalary }}</span>
        <span class="unit">{{ job.salary.unit }}</span>
      </div>
      
      <div class="details">
        <div class="detail-item">
          <el-icon><Location /></el-icon>
          <span>{{ job.location }}</span>
        </div>
        <div class="detail-item">
          <el-icon><Calendar /></el-icon>
          <span>{{ formatDate(job.startDate) }} 开始</span>
        </div>
      </div>
      
      <div class="tags">
        <el-tag
          v-for="tag in job.tags"
          :key="tag"
          size="small"
          class="tag-item"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>
    
    <div class="job-footer">
      <div class="headcount">
        <el-icon><User /></el-icon>
        <span>招聘 {{ job.headcount }} 人</span>
      </div>
      <el-button type="primary" @click="$emit('apply', job.id)">
        立即报名
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Location, Calendar, User } from '@element-plus/icons-vue'
import type { Job } from '@/types/job'
import { formatDate } from '@/utils/date'

const props = defineProps<{
  job: Job
}>()

defineEmits<{
  (e: 'apply', id: string): void
}>()

const formatSalary = computed(() => {
  const { min, max } = props.job.salary
  if (min === max) {
    return min.toLocaleString()
  }
  return `${min.toLocaleString()}-${max.toLocaleString()}`
})

const getJobTypeBanner = computed(() => {
  switch (props.job.type) {
    case 'urgent':
      return '/images/urgent-banner.png'
    case 'featured':
      return '/images/featured-banner.png'
    default:
      return '/images/standard-banner.png'
  }
})
</script>

<style lang="scss" scoped>
.job-card {
  height: 100%;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-4px);
  }
  
  .job-header {
    position: relative;
    height: 120px;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    
    .type-banner {
      position: absolute;
      top: 0;
      right: 0;
      width: 80px;
    }
    
    .job-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
      color: #fff;
      
      .job-title {
        margin: 0 0 4px;
        font-size: 18px;
        font-weight: 500;
      }
      
      .company {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }
    }
  }
  
  .job-content {
    padding: 16px;
    
    .salary {
      margin-bottom: 12px;
      
      .amount {
        font-size: 20px;
        font-weight: 600;
        color: #f5222d;
      }
      
      .unit {
        margin-left: 4px;
        font-size: 14px;
        color: #666;
      }
    }
    
    .details {
      margin-bottom: 12px;
      
      .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: #666;
        
        .el-icon {
          font-size: 16px;
        }
      }
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tag-item {
        border-radius: 4px;
      }
    }
  }
  
  .job-footer {
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .headcount {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      
      .el-icon {
        font-size: 16px;
      }
    }
  }
}
</style> 