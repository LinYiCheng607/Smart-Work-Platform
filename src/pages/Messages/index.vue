<template>
  <div class="messages-page">
    <!-- 消息分类标签 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="会话通知" name="chat">
        <div v-if="chatMessages.length" class="message-list">
          <el-card v-for="message in chatMessages" :key="message.id" class="message-card">
            <div class="message-header">
              <div class="sender-info">
                <el-avatar :src="message.sender.avatar" />
                <div class="sender-details">
                  <h4>{{ message.sender.name }}</h4>
                  <span class="message-time">{{ message.time }}</span>
                </div>
              </div>
              <el-tag :type="getMessageType(message.type)">{{ message.type }}</el-tag>
            </div>
            <div class="message-content">
              <p>{{ message.content }}</p>
              <div v-if="message.action" class="message-actions">
                <el-button 
                  v-if="message.action === 'confirm'" 
                  type="primary" 
                  size="small"
                  @click="handleConfirm(message)"
                >
                  确认
                </el-button>
                <el-button 
                  v-if="message.action === 'view'" 
                  type="primary" 
                  text
                  @click="handleView(message)"
                >
                  查看详情
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
        <el-empty v-else description="暂无会话通知">
          <el-button type="primary" @click="handleEnableNotification">去开启通知</el-button>
        </el-empty>
      </el-tab-pane>

      <el-tab-pane label="社区互动" name="community">
        <div v-if="communityMessages.length" class="message-list">
          <el-card v-for="message in communityMessages" :key="message.id" class="message-card">
            <div class="message-header">
              <div class="sender-info">
                <el-avatar :src="message.sender.avatar" />
                <div class="sender-details">
                  <h4>{{ message.sender.name }}</h4>
                  <span class="message-time">{{ message.time }}</span>
                </div>
              </div>
              <el-tag :type="getInteractionType(message.type)">{{ message.type }}</el-tag>
            </div>
            <div class="message-content">
              <p>{{ message.content }}</p>
              <div v-if="message.relatedPost" class="related-post">
                <div class="post-preview">
                  <el-icon><Document /></el-icon>
                  <span>{{ message.relatedPost }}</span>
                </div>
                <el-button type="primary" text @click="viewPost(message)">
                  查看原文
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
        <el-empty v-else description="暂无社区互动">
          <el-button type="primary" @click="goToCommunity">去社区看看</el-button>
        </el-empty>
      </el-tab-pane>
    </el-tabs>

    <!-- 通知设置抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="通知设置"
      direction="rtl"
      size="300px"
    >
      <div class="notification-settings">
        <h3>接收通知类型</h3>
        <el-divider />
        <el-checkbox-group v-model="notificationSettings">
          <div v-for="setting in availableSettings" :key="setting.value" class="setting-item">
            <el-checkbox :label="setting.value">{{ setting.label }}</el-checkbox>
            <p class="setting-description">{{ setting.description }}</p>
          </div>
        </el-checkbox-group>
        <div class="drawer-footer">
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeTab = ref('chat')

// 会话通知
interface ChatMessage {
  id: number
  sender: {
    name: string
    avatar: string
  }
  type: string
  content: string
  time: string
  action?: 'confirm' | 'view'
}

const chatMessages = ref<ChatMessage[]>([
  {
    id: 1,
    sender: {
      name: 'MANNER 咖啡',
      avatar: '/company-logos/manner.png'
    },
    type: '排班确认',
    content: '您的1月20日咖啡师排班申请已通过，请及时确认。',
    time: '10分钟前',
    action: 'confirm'
  },
  {
    id: 2,
    sender: {
      name: '系统通知',
      avatar: '/system/notification.png'
    },
    type: '工资发放',
    content: '您的1月份工资已发放，请注意查收。',
    time: '1小时前',
    action: 'view'
  }
])

// 社区互动
interface CommunityMessage {
  id: number
  sender: {
    name: string
    avatar: string
  }
  type: string
  content: string
  time: string
  relatedPost?: string
}

const communityMessages = ref<CommunityMessage[]>([
  {
    id: 1,
    sender: {
      name: '打工达人',
      avatar: '/avatars/user1.png'
    },
    type: '评论',
    content: '回复了你的兼职经验分享',
    time: '30分钟前',
    relatedPost: '我在MANNER咖啡的兼职体验'
  },
  {
    id: 2,
    sender: {
      name: '职场小白',
      avatar: '/avatars/user2.png'
    },
    type: '点赞',
    content: '赞了你的求职技巧分享',
    time: '2小时前',
    relatedPost: '如何提高兼职面试成功率'
  }
])

// 通知设置
const drawerVisible = ref(false)
const notificationSettings = ref(['schedule', 'salary', 'comment', 'like'])
const availableSettings = [
  {
    label: '排班通知',
    value: 'schedule',
    description: '接收排班申请、确认等通知'
  },
  {
    label: '工资通知',
    value: 'salary',
    description: '接收工资发放、结算等通知'
  },
  {
    label: '评论通知',
    value: 'comment',
    description: '接收他人对你的评论通知'
  },
  {
    label: '点赞通知',
    value: 'like',
    description: '接收他人对你的点赞通知'
  }
]

// 方法
const handleTabClick = (tab: any) => {
  console.log('切换到标签：', tab.props.label)
}

const getMessageType = (type: string) => {
  const map: Record<string, string> = {
    '排班确认': 'warning',
    '工资发放': 'success',
    '系统通知': 'info'
  }
  return map[type] || 'info'
}

const getInteractionType = (type: string) => {
  const map: Record<string, string> = {
    '评论': 'primary',
    '点赞': 'success',
    '分享': 'warning'
  }
  return map[type] || 'info'
}

const handleConfirm = (message: ChatMessage) => {
  ElMessage.success('已确认排班')
  // 从列表中移除该消息
  const index = chatMessages.value.findIndex(m => m.id === message.id)
  if (index > -1) {
    chatMessages.value.splice(index, 1)
  }
}

const handleView = (message: ChatMessage) => {
  if (message.type === '工资发放') {
    router.push('/profile/earnings')
  }
}

const viewPost = (message: CommunityMessage) => {
  router.push('/community')
}

const handleEnableNotification = () => {
  drawerVisible.value = true
}

const goToCommunity = () => {
  router.push('/community')
}

const saveSettings = () => {
  ElMessage.success('设置已保存')
  drawerVisible.value = false
}
</script>

<style scoped>
.messages-page {
  padding: 20px;
}

.message-list {
  margin-top: 20px;
}

.message-card {
  margin-bottom: 20px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.sender-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sender-details h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.message-time {
  color: #909399;
  font-size: 14px;
}

.message-content {
  color: #606266;
}

.message-content p {
  margin: 0 0 10px 0;
}

.message-actions {
  margin-top: 10px;
}

.related-post {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-preview {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
}

.notification-settings {
  padding: 20px;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-description {
  margin: 5px 0 0 24px;
  font-size: 14px;
  color: #909399;
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #dcdfe6;
  text-align: right;
}
</style> 