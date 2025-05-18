import request from '@/utils/request'

// 工作台统计数据接口
export interface DashboardStats {
  monthlyIncome: number
  workHours: number
  completedJobs: number
  rating: number
}

// 最近工作接口
export interface RecentJob {
  id: number
  jobTitle: string
  company: string
  date: string
  salary: number
  status: 'completed' | 'processing' | 'cancelled'
}

// 获取工作台统计数据
export function getDashboardStats() {
  return request.get<DashboardStats>('/dashboard/stats')
}

// 获取最近工作列表
export function getRecentJobs() {
  return request.get<RecentJob[]>('/dashboard/recent-jobs')
} 