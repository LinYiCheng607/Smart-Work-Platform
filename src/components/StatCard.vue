<template>
  <el-card class="stat-card" :body-style="{ padding: '20px' }">
    <div class="card-content">
      <div class="info">
        <div class="title">{{ title }}</div>
        <div class="value">{{ value }}</div>
      </div>
      <div class="icon">
        <el-icon :size="40" :color="iconColor">
          <component :is="icon" />
        </el-icon>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon: string
  iconColor?: string
}>()
</script>

<style lang="scss" scoped>
.stat-card {
  .card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .info {
      .title {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
      }
      
      .value {
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }
    }
    
    .icon {
      opacity: 0.8;
    }
  }
}
</style>