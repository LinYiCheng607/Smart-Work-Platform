<template>
  <el-container class="layout-container">
    <el-header height="60px">
      <div class="header-content">
        <div class="logo">灵工平台</div>
        <el-menu
          mode="horizontal"
          :router="true"
          :default-active="route.path"
        >
          <el-menu-item index="/">岗位推荐</el-menu-item>
          <el-menu-item index="/schedule">日程管理</el-menu-item>
          <el-menu-item index="/community">灵工圈</el-menu-item>
          <el-menu-item index="/notifications">
            消息中心
            <el-badge :value="unreadCount" :max="99" class="notice-badge" v-if="unreadCount > 0" />
          </el-menu-item>
        </el-menu>
        <div class="user-info">
          <el-dropdown>
            <span class="user-dropdown">
              {{ userStore.nickname }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    
    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { useNotificationStore } from '@/store/notification'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const unreadCount = ref(0)

onMounted(async () => {
  await notificationStore.fetchUnreadCount()
  unreadCount.value = notificationStore.unreadCount
})

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.layout-container {
  min-height: 100vh;
  
  .el-header {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
    position: relative;
    z-index: 100;
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      align-items: center;
      
      .logo {
        font-size: 20px;
        font-weight: bold;
        margin-right: 40px;
      }
      
      .el-menu {
        flex: 1;
        border: none;
      }
      
      .user-info {
        margin-left: 20px;
        
        .user-dropdown {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }
  
  .el-main {
    background: #f5f7fa;
    padding: 20px;
    
    :deep(.fade-enter-active),
    :deep(.fade-leave-active) {
      transition: opacity 0.3s ease;
    }

    :deep(.fade-enter-from),
    :deep(.fade-leave-to) {
      opacity: 0;
    }
  }
}

.notice-badge {
  margin-top: -8px;
}
</style> 