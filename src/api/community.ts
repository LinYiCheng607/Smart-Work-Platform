import axios from 'axios'
import type { Post, Comment, Company, Activity } from '@/types/community'

const BASE_URL = '/api'

// 帖子相关接口
export const postApi = {
  // 获取帖子列表
  getPosts: async (type?: string) => {
    const response = await axios.get(`${BASE_URL}/posts`, { params: { type } })
    return response.data
  },

  // 创建帖子
  createPost: async (post: Omit<Post, 'id' | 'comments' | 'showComments'>) => {
    const response = await axios.post(`${BASE_URL}/posts`, post)
    return response.data
  },

  // 更新帖子
  updatePost: async (id: number, post: Partial<Post>) => {
    const response = await axios.put(`${BASE_URL}/posts/${id}`, post)
    return response.data
  },

  // 删除帖子
  deletePost: async (id: number) => {
    await axios.delete(`${BASE_URL}/posts/${id}`)
  },

  // 点赞/取消点赞
  toggleLike: async (id: number) => {
    const response = await axios.post(`${BASE_URL}/posts/${id}/like`)
    return response.data
  },

  // 获取评论列表
  getComments: async (postId: number) => {
    const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`)
    return response.data
  },

  // 添加评论
  addComment: async (postId: number, comment: Omit<Comment, 'id' | 'time'>) => {
    const response = await axios.post(`${BASE_URL}/posts/${postId}/comments`, comment)
    return response.data
  },

  // 删除评论
  deleteComment: async (postId: number, commentId: number) => {
    await axios.delete(`${BASE_URL}/posts/${postId}/comments/${commentId}`)
  }
}

// 企业相关接口
export const companyApi = {
  // 获取企业列表
  getCompanies: async () => {
    const response = await axios.get(`${BASE_URL}/companies`)
    return response.data
  },

  // 关注/取消关注企业
  toggleFollow: async (id: number) => {
    const response = await axios.post(`${BASE_URL}/companies/${id}/follow`)
    return response.data
  },

  // 获取企业详情
  getCompanyDetail: async (id: number) => {
    const response = await axios.get(`${BASE_URL}/companies/${id}`)
    return response.data
  }
}

// 活动相关接口
export const activityApi = {
  // 获取活动列表
  getActivities: async () => {
    const response = await axios.get(`${BASE_URL}/activities`)
    return response.data
  },

  // 参与活动
  joinActivity: async (id: number) => {
    const response = await axios.post(`${BASE_URL}/activities/${id}/join`)
    return response.data
  },

  // 获取活动详情
  getActivityDetail: async (id: number) => {
    const response = await axios.get(`${BASE_URL}/activities/${id}`)
    return response.data
  }
} 