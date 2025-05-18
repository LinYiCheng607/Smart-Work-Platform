import request from '@/utils/request'

// 岗位列表查询参数接口
export interface JobQueryParams {
  keyword?: string
  jobCategory?: string
  location?: string
  type?: string
  salary?: string
  page?: number
  pageSize?: number
}

// 岗位接口
export interface Job {
  id: number
  title: string
  company: string
  logo: string
  salary: string
  location: string
  tags: string[]
  description: string
  isUrgent: boolean
  distance: string
  workTimeBonus: string
  isFlashPay: boolean
  isFavorite?: boolean
}

// 获取岗位列表
export function getJobList(params: JobQueryParams) {
  return request.get('/jobs', { params })
}

// 获取岗位详情
export function getJobDetail(id: number) {
  return request.get(`/jobs/${id}`)
}

// 收藏岗位
export function favoriteJob(id: number) {
  return request.post(`/jobs/${id}/favorite`)
}

// 取消收藏岗位
export function unfavoriteJob(id: number) {
  return request.delete(`/jobs/${id}/favorite`)
}

// 申请岗位
export function applyJob(id: number, data: any) {
  return request.post(`/jobs/${id}/apply`, data)
} 