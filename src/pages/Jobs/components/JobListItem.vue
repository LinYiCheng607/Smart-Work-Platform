<template>
  <div class="job-list-item">
    <div class="job-main">
      <div class="job-info">
        <div class="title-row">
          <h3 class="job-title">{{ job.title }}</h3>
          <div class="job-type" :class="job.type">
            {{ getJobTypeText }}
          </div>
        </div>
        <div class="company-row">
          <span class="company-name">{{ job.company }}</span>
          <span class="divider">·</span>
          <span class="location">
            <el-icon><Location /></el-icon>
            {{ job.location }}
          </span>
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
      
      <div class="job-meta">
        <div class="salary">
          <span class="amount">{{ formatSalary }}</span>
          <span class="unit">{{ job.salary.unit }}</span>
        </div>
        <div class="date">发布于 {{ formatRelativeTime(job.createdAt) }}</div>
      </div>
    </div>
    
    <div class="job-detail">
      <div class="requirements">
        <h4>岗位要求：</h4>
        <ul>
          <li v-for="req in job.requirements" :key="req">{{ req }}</li>
        </ul>
      </div>
      
      <div class="benefits">
        <h4>工作福利：</h4>
        <ul>
          <li v-for="benefit in job.benefits" :key="benefit">{{ benefit }}</li>
        </ul>
      </div>
      
      <div class="actions">
        <div class="status">
          <el-icon><User /></el-icon>
          <span>已申请 {{ job.appliedCount }}/{{ job.headcount }}</span>
        </div>
        <el-button type="primary" @click="$emit('apply', job.id)">
          立即报名
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Location, User } from '@element-plus/icons-vue'
import type { Job } from '@/types/job'
import { formatRelativeTime } from '@/utils/date'

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

const getJobTypeText = computed(() => {
  switch (props.job.type) {
    case 'urgent':
      return '急聘'
    case 'featured':
      return '精选'
    default:
      return '标准'
  }
})
</script>

<style lang="scss" scoped>
.job-list-item {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  transition: box-shadow 0.3s;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .job-main {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    
    .job-info {
      flex: 1;
      margin-right: 40px;
      
      .title-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        
        .job-title {
          margin: 0;
          font-size: 18px;
          font-weight: 500;
          color: #333;
        }
        
        .job-type {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          
          &.urgent {
            color: #f5222d;
            background: #fff1f0;
          }
          
          &.featured {
            color: #faad14;
            background: #fffbe6;
          }
          
          &.standard {
            color: #52c41a;
            background: #f6ffed;
          }
        }
      }
      
      .company-row {
        color: #666;
        margin-bottom: 12px;
        
        .divider {
          margin: 0 8px;
        }
        
        .location {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
      }
      
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
    
    .job-meta {
      text-align: right;
      
      .salary {
        margin-bottom: 8px;
        
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
      
      .date {
        color: #999;
        font-size: 14px;
      }
    }
  }
  
  .job-detail {
    border-top: 1px solid #f0f0f0;
    padding-top: 16px;
    
    h4 {
      margin: 0 0 8px;
      font-size: 14px;
      color: #333;
    }
    
    ul {
      margin: 0 0 16px;
      padding-left: 20px;
      color: #666;
      
      li {
        margin-bottom: 4px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    
    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .status {
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
}
</style> 