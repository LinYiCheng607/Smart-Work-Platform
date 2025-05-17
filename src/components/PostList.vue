<template>
  <div class="post-list">
    <div v-for="post in posts" :key="post.id" class="post-item">
      <slot :post="post">
        <!-- 默认内容将由父组件提供 -->
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/types/community'

defineProps<{
  posts: Post[]
}>()
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style> 