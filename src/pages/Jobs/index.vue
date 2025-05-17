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
          <el-select v-model="searchForm.location" placeholder="选择地点">
            <el-option label="厦门市思明区" value="siming" />
            <el-option label="厦门市湖里区" value="huli" />
            <el-option label="厦门市集美区" value="jimei" />
            <el-option label="厦门市海沧区" value="haicang" />
          </el-select>
        </el-form-item>
        <el-form-item label="工作类型">
          <el-select v-model="searchForm.type" placeholder="选择类型">
            <el-option label="全职" value="fulltime" />
            <el-option label="兼职" value="parttime" />
            <el-option label="临时工" value="temporary" />
          </el-select>
        </el-form-item>
        <el-form-item label="薪资范围">
          <el-select v-model="searchForm.salary" placeholder="选择薪资">
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
    <div class="job-list">
      <el-row :gutter="20">
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
                  type="default" 
                  size="small" 
                  @click="toggleFavorite(job)"
                  :icon="job.isFavorite ? 'Star' : 'StarFilled'"
                >
                  {{ job.isFavorite ? '已关注' : '关注' }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Location, Search, Star, StarFilled, Money } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Job {
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

// 搜索表单
const searchForm = ref({
  keyword: '',
  jobCategory: 'all',
  location: '',
  type: '',
  salary: ''
})

// 岗位列表数据
const jobList = ref<Job[]>([
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
    isFavorite: false
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
    isFavorite: false
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
    isFavorite: false
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
    isFavorite: false
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
    isFavorite: false
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
    isFavorite: false
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
    isFavorite: false
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
    isFavorite: false
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
    isFavorite: false
  }
])

// 标签样式
const getTagType = (tag: string) => {
  const map: Record<string, string> = {
    '临时工': '',
    '兼职': 'success',
    '全职': 'primary',
    '轻松不累': 'info',
    '学历不限': 'warning',
    '1年以下': 'info',
    '1-3年': 'warning',
    '高中': 'info',
    '大专': 'warning'
  }
  return map[tag] || ''
}

// 搜索方法
const handleSearch = () => {
  console.log('搜索条件：', searchForm.value)
  // TODO: 实现搜索逻辑
}

const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    jobCategory: 'all',
    location: '',
    type: '',
    salary: ''
  }
}

// 切换关注状态
const toggleFavorite = (job: any) => {
  job.isFavorite = !job.isFavorite
  ElMessage({
    message: job.isFavorite ? '已添加到关注' : '已取消关注',
    type: 'success'
  })
}

// 申请岗位
const handleApply = (job: any) => {
  ElMessage({
    message: `已成功申请"${job.title}"岗位`,
    type: 'success'
  })
}
</script>

<style lang="scss" scoped>
.jobs-page {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;
  }

  .keyword-search {
    margin-bottom: 15px;
  }

  .filter-tags {
    margin-bottom: 15px;
  }

  .job-list {
    .job-card {
      margin-bottom: 20px;
      transition: all 0.3s;
      
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
      }

      .job-info {
        margin: 10px 0;
        font-size: 14px;
        color: #606266;
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

      .job-tags {
        margin-bottom: 12px;

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
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    }
  }
}

.flash-pay-tag {
  margin-left: 8px;
}

.tag-item {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style> 