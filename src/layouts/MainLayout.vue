<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <div class="logo">
        <img src="/logo.svg" alt="logo" />
        <span>灵工平台</span>
      </div>
      <el-menu
        :default-active="route.path"
        router
        class="menu"
      >
        <el-menu-item index="/">
          <el-icon><Monitor /></el-icon>
          <span>工作台</span>
        </el-menu-item>
        <el-menu-item index="/jobs">
          <el-icon><Briefcase /></el-icon>
          <span>岗位列表</span>
        </el-menu-item>
        <el-menu-item index="/schedule">
          <el-icon><Calendar /></el-icon>
          <span>日程管理</span>
        </el-menu-item>
        <el-menu-item index="/community">
          <el-icon><ChatDotRound /></el-icon>
          <span>灵工圈</span>
        </el-menu-item>
        <el-menu-item index="/message">
          <el-icon><Bell /></el-icon>
          <span>消息中心</span>
          <el-badge :value="unreadCount" :max="99" class="badge" v-if="unreadCount" />
        </el-menu-item>
        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header height="60px" class="header">
        <div class="left">
          <el-breadcrumb>
            <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" :src="userStore.avatar || 'https://placeholder.com/32'" />
              <span>{{ displayName }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/profile')">
                  个人设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Monitor,
  Briefcase,
  Calendar,
  ChatDotRound,
  Bell,
  User
} from '@element-plus/icons-vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { getUserInfo } from '@/api/auth'

const route = useRoute()
const router = useRouter()
const unreadCount = ref(0)
const userStore = useUserStore()

// 计算显示名称，优先使用store中的用户信息，其次使用localStorage中的用户名
const displayName = computed(() => {
  if (userStore.userInfo?.name) {
    return userStore.userInfo.name
  }
  
  const storedName = localStorage.getItem('user_name')
  if (storedName) {
    return storedName
  }
  
  return '未登录'
})

// 获取未读消息数
const fetchUnreadCount = async () => {
  try {
    const response = await axios.get('/api/messages/unread/count')
    unreadCount.value = response.data.count
  } catch (error) {
    console.error('获取未读消息数失败:', error)
    unreadCount.value = 0
  }
}

// 初始化用户信息
const initUserInfo = () => {
  const token = localStorage.getItem('access_token')
  const userName = localStorage.getItem('user_name')
  const username = localStorage.getItem('username')
  
  if (token && userName && !userStore.userInfo) {
    // 如果有token和用户名但没有用户信息，则创建基本用户信息
    userStore.setUserInfo({
      id: 0,
      username: username || userName,
      name: userName,
      phone: '',
      avatar: null,
      role: 0,
      id_card: '',
      skill_tags: ''
    })
  }
}

onMounted(() => {
  fetchUnreadCount()
  initUserInfo()
})

const handleLogout = () => {
  // 清除用户信息和token
  userStore.clearUserInfo()
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_name')
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  
  .aside {
    background: #001529;
    color: #fff;
    
    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      
      img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      
      span {
        font-size: 18px;
        font-weight: 600;
      }
    }
    
    .menu {
      border-right: none;
      background: transparent;

      :deep(.el-menu-item) {
        color: rgba(255, 255, 255, 0.95);
        height: 50px;
        line-height: 50px;

        &.is-active {
          background-color: #1890ff !important;
          color: #fff;
          font-weight: 500;
        }
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.15) !important;
          color: #fff;
        }

        .el-icon {
          color: inherit;
          font-size: 18px;
          margin-right: 10px;
        }

        span {
          font-size: 14px;
          letter-spacing: 0.5px;
        }
      }
    }
  }
  
  .header {
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      span {
        margin-left: 8px;
      }
    }
  }
  
  .main {
    background: #f0f2f5;
    padding: 24px;
  }
}

.badge {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
</style> 