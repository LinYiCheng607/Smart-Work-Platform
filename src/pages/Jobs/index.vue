<template>
  <div class="jobs-page">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <!-- 关键词搜索 -->
      <div class="keyword-search">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索公司名称、岗位名称"
          prefix-icon="Search"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <!-- 分类筛选标签 -->
      <div class="filter-tags">
        <el-radio-group v-model="searchForm.jobCategory" @change="handleSearch">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="standard">标准岗位</el-radio-button>
          <el-radio-button label="urgent">抢班岗位</el-radio-button>
          <el-radio-button label="favorite">我的关注</el-radio-button>
        </el-radio-group>
      </div>

      <el-form :inline="true" :model="searchForm">
        <el-form-item label="工作地点">
          <el-select v-model="searchForm.location" placeholder="选择地点" clearable @change="handleSearch">
            <el-option label="厦门市思明区" value="siming" />
            <el-option label="厦门市湖里区" value="huli" />
            <el-option label="厦门市集美区" value="jimei" />
            <el-option label="厦门市海沧区" value="haicang" />
          </el-select>
        </el-form-item>
        <el-form-item label="工作类型">
          <el-select v-model="searchForm.type" placeholder="选择类型" clearable @change="handleSearch">
            <el-option label="全职" value="fulltime" />
            <el-option label="兼职" value="parttime" />
            <el-option label="临时工" value="temporary" />
          </el-select>
        </el-form-item>
        <el-form-item label="薪资范围">
          <el-select v-model="searchForm.salary" placeholder="选择薪资" clearable @change="handleSearch">
            <el-option label="200以下/天" value="<200" />
            <el-option label="200-300/天" value="200-300" />
            <el-option label="300-400/天" value="300-400" />
            <el-option label="400以上/天" value=">400" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 岗位列表 -->
    <div v-loading="loading" class="job-list">
      <div class="filter-result" v-if="!loading">
        <span class="result-count">共找到 <strong>{{ total }}</strong> 个岗位</span>
        <div class="active-filters" v-if="hasActiveFilters">
          <span>筛选条件:</span>
          <el-tag 
            v-if="searchForm.jobCategory !== 'all'" 
            size="small" 
            closable 
            @close="clearFilter('jobCategory')"
          >
            {{ getJobCategoryText(searchForm.jobCategory || 'all') }}
          </el-tag>
          <el-tag 
            v-if="searchForm.location" 
            size="small" 
            closable 
            @close="clearFilter('location')"
          >
            {{ getLocationText(searchForm.location) }}
          </el-tag>
          <el-tag 
            v-if="searchForm.type" 
            size="small" 
            closable 
            @close="clearFilter('type')"
          >
            {{ getJobTypeText(searchForm.type) }}
          </el-tag>
          <el-tag 
            v-if="searchForm.salary" 
            size="small" 
            closable 
            @close="clearFilter('salary')"
          >
            {{ getSalaryText(searchForm.salary) }}
          </el-tag>
          <el-button size="small" type="primary" text @click="resetSearch">清除全部</el-button>
        </div>
      </div>
      <el-empty v-if="!loading && jobList.length === 0" description="暂无岗位数据" />
      <el-row v-else :gutter="20">
        <el-col :span="8" v-for="job in jobList" :key="job.id">
          <el-card class="job-card" shadow="hover">
            <div class="job-header">
              <div class="company-info">
                <img :src="job.logo" :alt="job.company" class="company-logo">
                <span class="company-name">{{ job.company }}</span>
              </div>
              <div class="salary">¥{{ job.salary }}元/天</div>
            </div>
            <h3 class="job-title">
              {{ job.title }}
              <el-tag v-if="job.isFlashPay" type="danger" effect="dark" size="small" class="flash-pay-tag">
                闪电结
              </el-tag>
              <el-tag v-if="job.isUrgent" type="warning" effect="dark" size="small" class="urgent-tag">
                急聘
              </el-tag>
            </h3>
            <div class="job-info">
              <div class="location-info">
                <el-icon><Location /></el-icon>
                <span>{{ job.location }}</span>
                <span class="distance" v-if="job.distance">({{ job.distance }})</span>
              </div>
              <div class="bonus-info" v-if="job.workTimeBonus">
                <el-icon><Money /></el-icon>
                <span>{{ job.workTimeBonus }}</span>
              </div>
            </div>
            <div class="job-type">
              <el-tag 
                size="small" 
                :type="getJobTypeTag(job.type)"
                effect="plain"
              >
                {{ getJobTypeText(job.type) }}
              </el-tag>
            </div>
            <div class="job-tags">
              <el-tag 
                v-for="tag in job.tags" 
                :key="tag" 
                size="small" 
                :type="getTagType(tag)"
                class="tag-item"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="job-footer">
              <div class="job-actions">
                <el-button type="primary" size="small" @click="handleApply(job)">立即申请</el-button>
                <el-button 
                  :type="job.isFavorite ? 'success' : 'default'" 
                  size="small" 
                  @click="toggleFavorite(job)"
                >
                  <el-icon>
                    <component :is="job.isFavorite ? 'StarFilled' : 'Star'" />
                  </el-icon>
                  {{ job.isFavorite ? '已关注' : '关注' }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 分页 -->
      <div class="pagination" v-if="total > 0">
        <el-pagination
          v-model:current-page="searchForm.page"
          :page-size="searchForm.pageSize"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Location, Search, Star, StarFilled, Money } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import { getJobList, favoriteJob, unfavoriteJob, applyJob } from '@/api/jobs'
import type { Job, JobQueryParams } from '@/api/jobs'

// 搜索表单
const searchForm = reactive<JobQueryParams>({
  keyword: '',
  jobCategory: 'all',
  location: '',
  type: '',
  salary: '',
  page: 1,
  pageSize: 9
})

// 岗位列表数据
const jobList = ref<Job[]>([])
const loading = ref(false)
const total = ref(0)

// 获取岗位列表
const fetchJobs = async () => {
  loading.value = true
  try {
    // 如果后端API尚未实现，使用模拟数据
    if (import.meta.env.DEV) {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 应用筛选条件
      let filteredJobs = [...mockJobList]
      
      // 关键词搜索
      if (searchForm.keyword) {
        const keyword = searchForm.keyword.toLowerCase()
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(keyword) || 
          job.company.toLowerCase().includes(keyword) ||
          job.description.toLowerCase().includes(keyword)
        )
      }
      
      // 岗位类别筛选
      if (searchForm.jobCategory && searchForm.jobCategory !== 'all') {
        if (searchForm.jobCategory === 'standard') {
          filteredJobs = filteredJobs.filter(job => !job.isUrgent)
        } else if (searchForm.jobCategory === 'urgent') {
          filteredJobs = filteredJobs.filter(job => job.isUrgent)
        } else if (searchForm.jobCategory === 'favorite') {
          filteredJobs = filteredJobs.filter(job => job.isFavorite)
        }
      }
      
      // 地点筛选
      if (searchForm.location) {
        filteredJobs = filteredJobs.filter(job => job.workLocation === searchForm.location)
      }
      
      // 工作类型筛选
      if (searchForm.type) {
        filteredJobs = filteredJobs.filter(job => job.type === searchForm.type)
      }
      
      // 薪资范围筛选
      if (searchForm.salary) {
        const processSalary = (salaryRange: string) => {
          const [min, max] = salaryRange.split('-').map(Number)
          return { min, max }
        }
        
        filteredJobs = filteredJobs.filter(job => {
          const jobSalary = processSalary(job.salary)
          
          if (searchForm.salary === '<200') {
            return jobSalary.max < 200
          } else if (searchForm.salary === '200-300') {
            return jobSalary.min >= 200 && jobSalary.max <= 300
          } else if (searchForm.salary === '300-400') {
            return jobSalary.min >= 300 && jobSalary.max <= 400
          } else if (searchForm.salary === '>400') {
            return jobSalary.min > 400
          }
          return true
        })
      }
      
      // 分页处理
      const start = (searchForm.page - 1) * searchForm.pageSize
      const end = start + searchForm.pageSize
      
      jobList.value = filteredJobs.slice(start, end)
      total.value = filteredJobs.length
    } else {
      const res = await getJobList(searchForm)
      jobList.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取岗位列表失败:', error)
    ElMessage.error('获取岗位列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 搜索岗位
const handleSearch = () => {
  searchForm.page = 1
  fetchJobs()
}

// 页码变化
const handlePageChange = (page: number) => {
  searchForm.page = page
  fetchJobs()
}

// 重置搜索条件
const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.jobCategory = 'all'
  searchForm.location = ''
  searchForm.type = ''
  searchForm.salary = ''
  searchForm.page = 1
  fetchJobs()
}

// 收藏/取消收藏岗位
const toggleFavorite = async (job: Job) => {
  try {
    if (job.isFavorite) {
      await unfavoriteJob(job.id)
      ElMessage.success('已取消收藏')
    } else {
      await favoriteJob(job.id)
      ElMessage.success('已收藏')
    }
    job.isFavorite = !job.isFavorite
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

// 申请岗位
const handleApply = async (job: Job) => {
  try {
    await applyJob(job.id, {})
    ElMessage.success('申请成功')
  } catch (error) {
    console.error('申请失败:', error)
    ElMessage.error('申请失败，请稍后重试')
  }
}

// 获取标签类型
const getTagType = (tag: string) => {
  const tagMap: Record<string, string> = {
    '全职': 'success',
    '兼职': 'primary',
    '临时工': 'warning',
    '轻松不累': 'info',
    '学历不限': '',
    '1年以下': '',
    '1-3年': '',
    '高中': '',
    '大专': '',
    '经验不限': '',
    '高中以上': '',
    '2-3年': '',
    '3-5年': 'danger',
    '本科': 'success',
    '体力好': 'warning'
  }
  return tagMap[tag] || ''
}

// 获取岗位类型标签
const getJobTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    'fulltime': 'success',
    'parttime': 'primary',
    'temporary': 'warning'
  }
  return typeMap[type] || ''
}

// 获取岗位类型文本
const getJobTypeText = (type: string | undefined): string => {
  if (!type) return ''
  
  const typeMap: Record<string, string> = {
    'fulltime': '全职',
    'parttime': '兼职',
    'temporary': '临时工'
  }
  return typeMap[type] || ''
}

// 获取岗位类别文本
const getJobCategoryText = (category: string) => {
  const categoryMap: Record<string, string> = {
    'all': '全部',
    'standard': '标准岗位',
    'urgent': '抢班岗位',
    'favorite': '我的关注'
  }
  return categoryMap[category] || ''
}

// 获取地点文本
const getLocationText = (location: string | undefined): string => {
  if (!location) return ''
  
  const locationMap: Record<string, string> = {
    'siming': '厦门市思明区',
    'huli': '厦门市湖里区',
    'jimei': '厦门市集美区',
    'haicang': '厦门市海沧区'
  }
  return locationMap[location] || ''
}

// 获取薪资文本
const getSalaryText = (salary: string | undefined): string => {
  if (!salary) return ''
  
  const salaryMap: Record<string, string> = {
    '<200': '200以下/天',
    '200-300': '200-300/天',
    '300-400': '300-400/天',
    '>400': '400以上/天'
  }
  return salaryMap[salary] || ''
}

// 模拟数据
const mockJobList = [
  {
    id: 1,
    title: '仓库理货员',
    company: '京东物流',
    logo: '/company-logos/jd.svg',
    salary: '180-220',
    location: '厦门市海沧区',
    tags: ['临时工', '轻松不累', '学历不限'],
    description: '负责仓库商品的分类、整理、上架等工作',
    isUrgent: true,
    distance: '距地铁站300米',
    workTimeBonus: '满60工时奖励60元',
    isFlashPay: true,
    isFavorite: false,
    type: 'temporary',
    workLocation: 'haicang'
  },
  {
    id: 2,
    title: '快递分拣员',
    company: '顺丰速运',
    logo: '/company-logos/sf-express.svg',
    salary: '160-200',
    location: '厦门市集美区',
    tags: ['兼职', '1年以下', '高中'],
    description: '负责快递包裹的分拣、扫描、装车等工作',
    isUrgent: false,
    distance: '距地铁站500米',
    workTimeBonus: '满40工时奖励40元',
    isFlashPay: true,
    isFavorite: false,
    type: 'parttime',
    workLocation: 'jimei'
  },
  {
    id: 3,
    title: '商场导购',
    company: '优衣库',
    logo: '/company-logos/uniqlo.svg',
    salary: '180-220',
    location: '厦门市思明区',
    tags: ['全职', '1-3年', '大专'],
    description: '负责商品销售、客户服务、商品陈列等工作',
    isUrgent: false,
    distance: '距地铁站100米',
    workTimeBonus: '满80工时奖励100元',
    isFlashPay: false,
    isFavorite: false,
    type: 'fulltime',
    workLocation: 'siming'
  },
  {
    id: 4,
    title: '仓库管理员',
    company: '京东物流',
    logo: '/company-logos/jd.svg',
    salary: '200-250',
    location: '厦门市海沧区',
    tags: ['全职', '2-3年', '大专'],
    description: '负责仓库日常运营管理、人员调度等工作',
    isUrgent: true,
    distance: '距地铁站300米',
    workTimeBonus: '满100工时奖励150元',
    isFlashPay: true,
    isFavorite: false,
    type: 'fulltime',
    workLocation: 'haicang'
  },
  {
    id: 5,
    title: '快递员',
    company: '顺丰速运',
    logo: '/company-logos/sf-express.svg',
    salary: '250-300',
    location: '厦门市湖里区',
    tags: ['全职', '1年以下', '学历不限'],
    description: '负责快递最后一公里配送服务',
    isUrgent: true,
    distance: '距地铁站400米',
    workTimeBonus: '满60工时奖励80元',
    isFlashPay: true,
    isFavorite: false,
    type: 'fulltime',
    workLocation: 'huli'
  },
  {
    id: 6,
    title: '门店店员',
    company: '优衣库',
    logo: '/company-logos/uniqlo.svg',
    salary: '160-180',
    location: '厦门市思明区',
    tags: ['兼职', '经验不限', '高中以上'],
    description: '负责商品整理、收银、顾客服务等工作',
    isUrgent: false,
    distance: '距地铁站150米',
    workTimeBonus: '满40工时奖励50元',
    isFlashPay: false,
    isFavorite: false,
    type: 'parttime',
    workLocation: 'siming'
  },
  {
    id: 7,
    title: '物流调度员',
    company: '京东物流',
    logo: '/company-logos/jd.svg',
    salary: '220-280',
    location: '厦门市集美区',
    tags: ['全职', '3-5年', '本科'],
    description: '负责物流路线规划、车辆调度等工作',
    isUrgent: true,
    distance: '距地铁站600米',
    workTimeBonus: '满100工时奖励200元',
    isFlashPay: true,
    isFavorite: false,
    type: 'fulltime',
    workLocation: 'jimei'
  },
  {
    id: 8,
    title: '仓储搬运工',
    company: '顺丰速运',
    logo: '/company-logos/sf-express.svg',
    salary: '180-220',
    location: '厦门市海沧区',
    tags: ['临时工', '体力好', '学历不限'],
    description: '负责仓库货物搬运、装卸等工作',
    isUrgent: true,
    distance: '距地铁站350米',
    workTimeBonus: '满50工时奖励60元',
    isFlashPay: true,
    isFavorite: false,
    type: 'temporary',
    workLocation: 'haicang'
  },
  {
    id: 9,
    title: '收银员',
    company: '优衣库',
    logo: '/company-logos/uniqlo.svg',
    salary: '150-180',
    location: '厦门市湖里区',
    tags: ['兼职', '经验不限', '高中以上'],
    description: '负责门店收银、整理等工作',
    isUrgent: false,
    distance: '距地铁站200米',
    workTimeBonus: '满30工时奖励40元',
    isFlashPay: false,
    isFavorite: false,
    type: 'parttime',
    workLocation: 'huli'
  },
  {
    id: 10,
    title: '电商客服',
    company: '京东物流',
    logo: '/company-logos/jd.svg',
    salary: '160-200',
    location: '厦门市思明区',
    tags: ['全职', '1年以下', '大专'],
    description: '负责线上客户咨询、订单处理等工作',
    isUrgent: false,
    distance: '距地铁站100米',
    workTimeBonus: '满60工时奖励70元',
    isFlashPay: false,
    isFavorite: false,
    type: 'fulltime',
    workLocation: 'siming'
  },
  {
    id: 11,
    title: '送餐员',
    company: '美团',
    logo: '/company-logos/meituan.svg',
    salary: '200-300',
    location: '厦门市湖里区',
    tags: ['全职', '经验不限', '学历不限'],
    description: '负责餐品配送服务',
    isUrgent: true,
    distance: '距地铁站300米',
    workTimeBonus: '满50工时奖励100元',
    isFlashPay: true,
    isFavorite: false,
    type: 'fulltime',
    workLocation: 'huli'
  },
  {
    id: 12,
    title: '保洁员',
    company: '城市管家',
    logo: '/company-logos/cleaner.svg',
    salary: '140-180',
    location: '厦门市集美区',
    tags: ['兼职', '经验不限', '学历不限'],
    description: '负责办公场所或商场的清洁工作',
    isUrgent: false,
    distance: '距地铁站400米',
    workTimeBonus: '满40工时奖励50元',
    isFlashPay: true,
    isFavorite: false,
    type: 'parttime',
    workLocation: 'jimei'
  }
]

// 页面加载时获取岗位列表
onMounted(() => {
  fetchJobs()
})

// 计算是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return searchForm.jobCategory !== 'all' || 
         !!searchForm.location || 
         !!searchForm.type || 
         !!searchForm.salary
})

// 清除单个筛选条件
const clearFilter = (filterName: string) => {
  if (filterName === 'jobCategory') {
    searchForm.jobCategory = 'all'
  } else if (filterName === 'location') {
    searchForm.location = ''
  } else if (filterName === 'type') {
    searchForm.type = ''
  } else if (filterName === 'salary') {
    searchForm.salary = ''
  }
  fetchJobs()
}
</script>

<style lang="scss" scoped>
.jobs-page {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .keyword-search {
      margin-bottom: 15px;
    }

    .filter-tags {
      margin-bottom: 15px;
    }
  }

  .job-list {
    min-height: 400px;
    
    .job-card {
      height: 100%;
      margin-bottom: 20px;
      transition: all 0.3s;
      border-radius: 8px;
      overflow: hidden;
      
      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .company-info {
          display: flex;
          align-items: center;
          
          .company-logo {
            width: 40px;
            height: 40px;
            margin-right: 8px;
            border-radius: 4px;
            object-fit: cover;
          }

          .company-name {
            font-size: 14px;
            color: #666;
          }
        }

        .salary {
          color: #f56c6c;
          font-size: 16px;
          font-weight: 500;
        }
      }

      .job-title {
        margin: 0 0 12px;
        font-size: 16px;
        font-weight: 500;
        display: flex;
        align-items: center;
      }

      .job-info {
        margin: 10px 0;
        font-size: 14px;
        color: #606266;
        display: flex;
        justify-content: space-between;
      }

      .location-info {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 5px;
      }

      .distance {
        color: #909399;
      }

      .bonus-info {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #e6a23c;
      }

      .job-type {
        margin-bottom: 12px;
      }

      .job-tags {
        margin-bottom: 12px;
        min-height: 56px;

        .el-tag {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }

      .job-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .job-actions {
          display: flex;
          gap: 10px;
        }
      }
    }

    .job-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px 0 rgba(0,0,0,0.2);
    }
  }
}

.flash-pay-tag {
  margin-left: 8px;
}

.urgent-tag {
  margin-left: 8px;
}

.tag-item {
  margin-right: 5px;
  margin-bottom: 5px;
}

.pagination {
  margin-top: 30px;
  text-align: center;
}

.filter-result {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .result-count {
    font-size: 14px;
    color: #606266;
  }

  .active-filters {
    display: flex;
    align-items: center;
    gap: 10px;

    .el-tag {
      margin-right: 8px;
    }

    .el-button {
      margin-left: 10px;
    }
  }
}
</style> 