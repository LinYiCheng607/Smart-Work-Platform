<template>
  <div
    class="schedule-item"
    :class="[schedule.type, schedule.status]"
    @click="$emit('click', schedule)"
  >
    <el-tooltip
      :content="tooltipContent"
      placement="top"
      :show-after="200"
    >
      <div class="content">
        <span class="time">{{ formatTime }}</span>
        <span class="title">{{ schedule.jobTitle }}</span>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Schedule } from '@/types/schedule'

const props = defineProps<{
  schedule: Schedule
}>()

defineEmits<{
  (e: 'click', schedule: Schedule): void
}>()

const formatTime = computed(() => {
  const time = new Date(props.schedule.startTime)
  return time.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

const tooltipContent = computed(() => {
  return `${props.schedule.jobTitle}\n${props.schedule.company}\n${formatTime.value} 开始`
})
</script>

<style lang="scss" scoped>
.schedule-item {
  margin: 2px 0;
  padding: 2px 4px;
  border-radius: 2px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    filter: brightness(0.9);
  }
  
  .content {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
    overflow: hidden;
    
    .time {
      flex-shrink: 0;
    }
    
    .title {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  &.work {
    background-color: #e6f7ff;
    color: #1890ff;
    border-left: 2px solid #1890ff;
    
    &.completed {
      background-color: #f6ffed;
      color: #52c41a;
      border-left-color: #52c41a;
    }
  }
  
  &.leave {
    background-color: #fff7e6;
    color: #faad14;
    border-left: 2px solid #faad14;
    
    &.rejected {
      background-color: #fff1f0;
      color: #f5222d;
      border-left-color: #f5222d;
    }
  }
  
  &.overtime {
    background-color: #fff1f0;
    color: #f5222d;
    border-left: 2px solid #f5222d;
  }
  
  &.pending {
    opacity: 0.6;
  }
}
</style> 