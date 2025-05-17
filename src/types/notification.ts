export interface Notification {
  id: string
  title: string
  content: string
  type: 'system' | 'message' | 'community'
  isRead: boolean
  createdAt: string
}

export interface NotificationCount {
  count: number
}

export interface NotificationList {
  list: Notification[]
  total: number
} 