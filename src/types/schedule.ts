export type ScheduleType = 'work' | 'leave' | 'overtime'

export interface Schedule {
  id: string
  jobId: string
  jobTitle: string
  company: string
  type: ScheduleType
  startTime: string
  endTime: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  salary: number
  location: string
  remark?: string
}

export interface ScheduleQuery {
  startDate: string
  endDate: string
  type?: ScheduleType
}

export interface LeaveApplication {
  type: 'personal' | 'sick' | 'annual' | 'other'
  startTime: string
  endTime: string
  reason: string
  attachments?: string[]
}

export interface ScheduleStatistics {
  totalWorkHours: number
  totalWorkDays: number
  totalSalary: number
  leaveCount: number
  overtimeCount: number
} 