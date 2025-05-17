export type MessageType = 'system' | 'comment' | 'like' | 'follow' | 'activity'

export interface Message {
  id: number
  type: MessageType
  title: string
  content: string
  time: string
  isRead: boolean
  sender?: {
    id: number
    name: string
    avatar: string
  }
  relatedData?: {
    type: 'post' | 'comment' | 'company' | 'activity'
    id: number
  }
}

export interface MessageGroup {
  type: MessageType
  label: string
  unreadCount: number
  messages: Message[]
}

export interface MessageSummary {
  totalUnread: number
  groups: {
    [key in MessageType]: {
      label: string
      unreadCount: number
    }
  }
} 