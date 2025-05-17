export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: {
    min: number
    max: number
    unit: '元/天' | '元/月'
  }
  type: 'standard' | 'urgent' | 'featured'
  tags: string[]
  requirements: string[]
  description: string
  benefits: string[]
  createdAt: string
  startDate: string
  endDate: string
  headcount: number
  appliedCount: number
}

export interface JobQuery {
  keyword?: string
  type?: Job['type']
  location?: string
  salaryMin?: number
  salaryMax?: number
  page?: number
  pageSize?: number
}

export interface JobList {
  list: Job[]
  total: number
  page: number
  pageSize: number
} 