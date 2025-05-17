import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/Register/index.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard/index.vue'),
        meta: { title: '工作台', requiresAuth: true }
      },
      {
        path: 'jobs',
        name: 'Jobs',
        component: () => import('@/pages/Jobs/index.vue'),
        meta: { title: '岗位列表', requiresAuth: true }
      },
      {
        path: 'schedule',
        name: 'Schedule',
        component: () => import('@/pages/Schedule/index.vue'),
        meta: { title: '日程管理', requiresAuth: true }
      },
      {
        path: 'community',
        name: 'Community',
        component: () => import('@/pages/Community/index.vue'),
        meta: { title: '灵工圈', requiresAuth: true }
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/pages/Message/index.vue'),
        meta: { title: '消息中心', requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/Profile/index.vue'),
        meta: { title: '个人中心', requiresAuth: true }
      },
      {
        path: '/profile/resume',
        name: 'Resume',
        component: () => import('@/pages/Profile/Resume.vue'),
        meta: {
          title: '简历编辑',
          requiresAuth: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router 