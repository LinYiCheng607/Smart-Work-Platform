import request from '@/utils/request'
import type { NotificationCount, NotificationList } from '@/types/notification'

export function getUnreadCount() {
  return request.get<NotificationCount>('/notifications/unread-count')
}

export function getNotifications(params?: { page?: number; pageSize?: number }) {
  return request.get<NotificationList>('/notifications', { params })
}

export function markAsRead(id: string) {
  return request.put(`/notifications/${id}/read`)
} 