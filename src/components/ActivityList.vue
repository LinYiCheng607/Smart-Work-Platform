<template>
  <div class="activity-list">
    <div v-for="activity in activities" :key="activity.id" class="activity-item">
      <slot :activity="activity">
        <!-- 默认内容将由父组件提供 -->
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@/types/community'

defineProps<{
  activities: Activity[]
}>()
</script>

<style scoped>
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style> 