<template>
  <div class="company-list">
    <div v-for="company in companies" :key="company.id" class="company-item">
      <slot :company="company">
        <!-- 默认内容将由父组件提供 -->
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Company } from '@/types/community'

defineProps<{
  companies: Company[]
}>()
</script>

<style scoped>
.company-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style> 