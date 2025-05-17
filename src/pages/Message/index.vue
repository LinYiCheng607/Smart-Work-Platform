<template>
  <div class="message-page">
    <el-tabs v-model="activeTab" class="message-tabs">
      <el-tab-pane 
        v-for="group in messageGroups" 
        :key="group.type" 
        :label="group.label + (group.unreadCount ? ` (${group.unreadCount})` : '')"
        :name="group.type"
      >
        <div class="message-header">
          <div class="message-actions">
            <el-button type="primary" @click="handleMarkAllRead">全部标记为已读</el-button>
            <el-button @click="handleDeleteAll">清空消息</el-button>
          </div>
        </div>
        
        <div class="message-list">
          <template v-if="group.messages.length">
            <div 
              v-for="message in group.messages" 
              :key="message.id" 
              class="message-item"
              :class="{ unread: !message.isRead }"
            >
              <div class="message-content" @click="handleMessageClick(message)">
                <template v-if="message.sender">
                  <el-avatar :src="message.sender.avatar" :size="40" />
                  <div class="message-info">
                    <div class="message-title">
                      <span class="sender-name">{{ message.sender.name }}</span>
                      {{ message.title }}
                    </div>
                    <div class="message-detail">{{ message.content }}</div>
                    <div class="message-time">{{ message.time }}</div>
                  </div>
                </template>
                <template v-else>
                  <div class="message-info">
                    <div class="message-title">{{ message.title }}</div>
                    <div class="message-detail">{{ message.content }}</div>
                    <div class="message-time">{{ message.time }}</div>
                  </div>
                </template>
              </div>
              <div class="message-actions">
                <el-button 
                  type="text" 
                  size="small"
                  @click="handleDelete(message)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </template>
          <el-empty v-else description="暂无消息" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { MessageType, Message, MessageGroup } from '@/types/message'
import { messageApi } from '@/api/message'

const activeTab = ref<MessageType>('system')

const messageGroups = ref<MessageGroup[]>([
  { type: 'system', label: '系统通知', unreadCount: 0, messages: [] },
  { type: 'comment', label: '评论', unreadCount: 0, messages: [] },
  { type: 'like', label: '点赞', unreadCount: 0, messages: [] },
  { type: 'follow', label: '关注', unreadCount: 0, messages: [] },
  { type: 'activity', label: '活动', unreadCount: 0, messages: [] }
])

// 加载消息数据
const loadMessages = async () => {
  try {
    // 获取消息概要
    const summary = await messageApi.getMessageSummary()
    
    // 更新未读数
    messageGroups.value.forEach(group => {
      group.unreadCount = summary.groups[group.type].unreadCount
    })
    
    // 获取当前标签页的消息列表
    const messages = await messageApi.getMessages(activeTab.value)
    const currentGroup = messageGroups.value.find(g => g.type === activeTab.value)
    if (currentGroup) {
      currentGroup.messages = messages
    }
  } catch (error) {
    ElMessage.error('获取消息失败')
  }
}

// 标记所有消息为已读
const handleMarkAllRead = async () => {
  try {
    await messageApi.markAllAsRead(activeTab.value)
    const currentGroup = messageGroups.value.find(g => g.type === activeTab.value)
    if (currentGroup) {
      currentGroup.messages.forEach(msg => msg.isRead = true)
      currentGroup.unreadCount = 0
    }
    ElMessage.success('已全部标记为已读')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 删除所有消息
const handleDeleteAll = async () => {
  try {
    await ElMessageBox.confirm('确定要清空所有消息吗？', '提示', {
      type: 'warning'
    })
    await messageApi.deleteAllMessages(activeTab.value)
    const currentGroup = messageGroups.value.find(g => g.type === activeTab.value)
    if (currentGroup) {
      currentGroup.messages = []
      currentGroup.unreadCount = 0
    }
    ElMessage.success('已清空消息')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

// 删除单条消息
const handleDelete = async (message: Message) => {
  try {
    await messageApi.deleteMessage(message.id)
    const currentGroup = messageGroups.value.find(g => g.type === activeTab.value)
    if (currentGroup) {
      const index = currentGroup.messages.findIndex(m => m.id === message.id)
      if (index > -1) {
        currentGroup.messages.splice(index, 1)
        if (!message.isRead) {
          currentGroup.unreadCount--
        }
      }
    }
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 处理消息点击
const handleMessageClick = async (message: Message) => {
  if (!message.isRead) {
    try {
      await messageApi.markAsRead([message.id])
      message.isRead = true
      const currentGroup = messageGroups.value.find(g => g.type === activeTab.value)
      if (currentGroup) {
        currentGroup.unreadCount--
      }
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }
  
  // 根据消息类型和关联数据处理跳转
  if (message.relatedData) {
    // 这里添加跳转逻辑
    console.log('跳转到:', message.relatedData)
  }
}

// 监听标签页切换
const handleTabChange = async () => {
  await loadMessages()
}

// 组件挂载时加载数据
onMounted(() => {
  loadMessages()
})

// 监听标签页变化
watch(activeTab, handleTabChange)
</script>

<style scoped>
.message-page {
  padding: 20px;
}

.message-tabs {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.message-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.message-actions {
  display: flex;
  gap: 12px;
}

.message-list {
  min-height: 200px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
}

.message-item:hover {
  background-color: #f5f7fa;
}

.message-item.unread {
  background-color: #f0f9ff;
}

.message-content {
  flex: 1;
  display: flex;
  gap: 12px;
  cursor: pointer;
}

.message-info {
  flex: 1;
}

.message-title {
  font-size: 14px;
  margin-bottom: 8px;
}

.sender-name {
  font-weight: bold;
  margin-right: 8px;
}

.message-detail {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.message-time {
  color: #909399;
  font-size: 12px;
}
</style> 