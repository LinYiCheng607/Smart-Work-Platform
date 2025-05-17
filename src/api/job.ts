import request from '@/utils/request'
import type { Job, JobList, JobQuery } from '@/types/job'

export function getJobs(params: JobQuery) {
  return request.get<JobList>('/jobs', { params })
}

export function getJobDetail(id: string) {
  return request.get<Job>(`/jobs/${id}`)
}

export function applyJob(id: string) {
  return request.post(`/jobs/${id}/apply`)
}

export function getFeaturedJobs() {
  return request.get<Job[]>('/jobs/featured')
}

export function getRecommendedJobs() {
  return request.get<Job[]>('/jobs/recommended')
} 