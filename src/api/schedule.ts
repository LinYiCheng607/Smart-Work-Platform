import request from '@/utils/request'
import type { Schedule, ScheduleQuery, LeaveApplication, ScheduleStatistics } from '@/types/schedule'

export function getSchedules(params: ScheduleQuery) {
  return request.get<Schedule[]>('/schedules', { params })
}

export function getScheduleDetail(id: string) {
  return request.get<Schedule>(`/schedules/${id}`)
}

export function applyLeave(data: LeaveApplication) {
  return request.post('/schedules/leave', data)
}

export function cancelSchedule(id: string) {
  return request.post(`/schedules/${id}/cancel`)
}

export function getScheduleStatistics(params: { startDate: string; endDate: string }) {
  return request.get<ScheduleStatistics>('/schedules/statistics', { params })
}

export function createSchedule(data: Omit<Schedule, 'id' | 'status'>) {
  return request.post<Schedule>('/schedules', data)
} 