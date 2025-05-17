import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUnreadCount, getNotifications, markAsRead } from '@/api/notification'
import type { Notification } from '@/types/notification'

export const useNotificationStore = defineStore('notification', () => {
  const unreadCount = ref(0)
  const notifications = ref<Notification[]>([])

  const fetchUnreadCount = async () => {
    const { data } = await getUnreadCount()
    unreadCount.value = data.count
  }

  const fetchNotifications = async () => {
    const { data } = await getNotifications()
    notifications.value = data.list
  }

  const markNotificationAsRead = async (id: string) => {
    await markAsRead(id)
    await fetchUnreadCount()
    notifications.value = notifications.value.map(item => 
      item.id === id ? { ...item, isRead: true } : item
    )
  }

  return {
    unreadCount,
    notifications,
    fetchUnreadCount,
    fetchNotifications,
    markNotificationAsRead
  }
}) 