<template>
  <div class="avatar-upload">
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :headers="headers"
    >
      <img 
        v-if="currentAvatar" 
        :src="currentAvatar + '?t=' + timestamp" 
        class="avatar" 
        @error="handleImageError"
      />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  initialAvatar?: string // 初始头像URL
}>()

const emit = defineEmits<{
  (e: 'update:avatar', url: string): void
}>()

const userStore = useUserStore()
const uploadUrl = '/api/upload/avatar'
const currentAvatar = ref(props.initialAvatar || userStore.avatar || '')
const timestamp = ref(Date.now())

// 监听store中头像的变化
watch(() => userStore.avatar, (newAvatar) => {
  if (newAvatar && newAvatar !== currentAvatar.value) {
    currentAvatar.value = newAvatar
    timestamp.value = Date.now()
  }
})

// 初始化时设置头像
onMounted(() => {
  if (props.initialAvatar) {
    currentAvatar.value = props.initialAvatar
  }
})

const headers = {
  Authorization: `Bearer ${userStore.token}`
}

const handleAvatarSuccess = (response: any) => {
  if (response.code === 200) {
    const newAvatarUrl = response.data.url
    currentAvatar.value = newAvatarUrl
    timestamp.value = Date.now()
    userStore.updateAvatar(newAvatarUrl)
    emit('update:avatar', newAvatarUrl)
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error('头像上传失败')
  }
}

const handleImageError = () => {
  currentAvatar.value = '' // 如果图片加载失败，显示上传图标
}

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}
</script>

<style scoped>
.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border-radius: 50%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 