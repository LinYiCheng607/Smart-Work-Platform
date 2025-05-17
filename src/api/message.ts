import axios from 'axios'
import type { Message, MessageType, MessageSummary } from '@/types/message'

const BASE_URL = '/api'

export const messageApi = {
  // 获取消息概要（未读数等）
  getMessageSummary: async (): Promise<MessageSummary> => {
    const response = await axios.get(`${BASE_URL}/messages/summary`)
    return response.data
  },

  // 获取指定类型的消息列表
  getMessages: async (type?: MessageType): Promise<Message[]> => {
    const response = await axios.get(`${BASE_URL}/messages`, {
      params: { type }
    })
    return response.data
  },

  // 标记消息为已读
  markAsRead: async (messageIds: number[]) => {
    await axios.post(`${BASE_URL}/messages/read`, { messageIds })
  },

  // 标记所有消息为已读
  markAllAsRead: async (type?: MessageType) => {
    await axios.post(`${BASE_URL}/messages/read-all`, { type })
  },

  // 删除消息
  deleteMessage: async (messageId: number) => {
    await axios.delete(`${BASE_URL}/messages/${messageId}`)
  },

  // 删除所有消息
  deleteAllMessages: async (type?: MessageType) => {
    await axios.delete(`${BASE_URL}/messages`, {
      params: { type }
    })
  }
} 