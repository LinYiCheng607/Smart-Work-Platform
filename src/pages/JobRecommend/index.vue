<template>
  <div class="job-recommend-page">
    <!-- 顶部搜索区域 -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="搜索职位名称、公司名称"
        class="search-input"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <div class="filter-tags">
        <el-tag
          v-for="tag in selectedTags"
          :key="tag"
          closable
          @close="removeTag(tag)"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <el-card>
        <div class="filter-group">
          <div class="filter-label">工作类型：</div>
          <div class="filter-options">
            <el-checkbox-group v-model="filters.jobTypes">
              <el-checkbox label="全职">全职</el-checkbox>
              <el-checkbox label="兼职">兼职</el-checkbox>
              <el-checkbox label="实习">实习</el-checkbox>
              <el-checkbox label="临时工">临时工</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        
        <div class="filter-group">
          <div class="filter-label">工作时间：</div>
          <div class="filter-options">
            <el-radio-group v-model="filters.workTime">
              <el-radio label="不限">不限</el-radio>
              <el-radio label="日结">日结</el-radio>
              <el-radio label="周结">周结</el-radio>
              <el-radio label="月结">月结</el-radio>
            </el-radio-group>
          </div>
        </div>

        <div class="filter-group">
          <div class="filter-label">薪资范围：</div>
          <div class="filter-options">
            <el-select v-model="filters.salary" placeholder="请选择">
              <el-option label="不限" value="" />
              <el-option label="100以下/天" value="0-100" />
              <el-option label="100-200/天" value="100-200" />
              <el-option label="200-300/天" value="200-300" />
              <el-option label="300以上/天" value="300+" />
            </el-select>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 岗位列表 -->
    <div class="job-list">
      <el-card v-for="job in filteredJobs" :key="job.id" class="job-card">
        <div class="job-header">
          <div class="job-title-section">
            <h3 class="job-title">{{ job.title }}</h3>
            <div class="job-tags">
              <el-tag size="small" type="success" v-if="job.isFlash">闪电结</el-tag>
              <el-tag size="small" type="warning" v-if="job.isHot">热门</el-tag>
              <el-tag size="small" type="info" v-if="job.isNew">新发布</el-tag>
            </div>
          </div>
          <div class="job-salary">{{ job.salary }}元/天</div>
        </div>

        <div class="job-info">
          <div class="info-item">
            <el-icon><Location /></el-icon>
            <span>{{ job.location }}</span>
            <el-tooltip v-if="job.traffic" content="交通指引" placement="top">
              <el-button link type="primary">查看路线</el-button>
            </el-tooltip>
          </div>
          <div class="info-item">
            <el-icon><Calendar /></el-icon>
            <span>{{ job.workTime }}</span>
          </div>
          <div class="info-item">
            <el-icon><Timer /></el-icon>
            <span>{{ job.duration }}</span>
          </div>
        </div>

        <div class="company-info">
          <el-avatar :size="40" :src="job.companyLogo" />
          <div class="company-detail">
            <div class="company-name">{{ job.companyName }}</div>
            <div class="company-type">{{ job.companyType }}</div>
          </div>
        </div>

        <div class="job-footer">
          <div class="reward-info" v-if="job.reward">
            <el-icon><GoldMedal /></el-icon>
            <span>奖励{{ job.reward }}元</span>
          </div>
          <el-button type="primary" @click="applyJob(job)">立即申请</el-button>
        </div>
      </el-card>
    </div>

    <!-- 加载更多 -->
    <div class="load-more" v-if="hasMore">
      <el-button :loading="loading" @click="loadMore">加载更多</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Search,
  Location,
  Calendar,
  Timer,
  GoldMedal
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索和筛选状态
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const filters = ref({
  jobTypes: [],
  workTime: '不限',
  salary: ''
})

// 模拟岗位数据
const jobs = ref([
  {
    id: 1,
    title: '星巴克咖啡师',
    salary: '200-300',
    location: '市中心店',
    traffic: '地铁2号线市民中心站步行5分钟',
    workTime: '周一至周五 9:00-18:00',
    duration: '长期',
    companyName: '星巴克咖啡',
    companyType: '连锁餐饮',
    companyLogo: '/company-logos/starbucks.png',
    isFlash: true,
    isHot: true,
    isNew: false,
    reward: 100
  },
  {
    id: 2,
    title: '商场导购员',
    salary: '150-200',
    location: '万达广场',
    traffic: '公交15路直达',
    workTime: '排班制',
    duration: '短期',
    companyName: 'ZARA',
    companyType: '品牌服饰',
    companyLogo: '/company-logos/zara.png',
    isFlash: false,
    isHot: false,
    isNew: true,
    reward: 50
  }
])

// 分页和加载状态
const loading = ref(false)
const hasMore = ref(true)

// 过滤后的岗位列表
const filteredJobs = computed(() => {
  return jobs.value.filter(job => {
    // 关键词搜索
    if (searchQuery.value && !job.title.includes(searchQuery.value) && 
        !job.companyName.includes(searchQuery.value)) {
      return false
    }
    
    // 标签筛选
    if (selectedTags.value.length > 0) {
      const jobTags = [
        job.isFlash ? '闪电结' : '',
        job.isHot ? '热门' : '',
        job.isNew ? '新发布' : ''
      ].filter(Boolean)
      
      if (!selectedTags.value.some(tag => jobTags.includes(tag))) {
        return false
      }
    }
    
    return true
  })
})

// 方法
const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

const loadMore = async () => {
  loading.value = true
  try {
    // 模拟加载更多数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    // TODO: 加载更多岗位数据
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

const applyJob = (job: any) => {
  ElMessage.success(`已申请${job.title}岗位`)
}
</script>

<style scoped>
.job-recommend-page {
  padding: 20px;
}

.search-section {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 500px;
}

.filter-tags {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  width: 100px;
  color: #606266;
}

.filter-options {
  flex: 1;
}

.job-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.job-card {
  cursor: pointer;
  transition: all 0.3s;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.job-title-section {
  flex: 1;
  margin-right: 15px;
}

.job-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 500;
}

.job-tags {
  display: flex;
  gap: 8px;
}

.job-salary {
  color: #f56c6c;
  font-size: 18px;
  font-weight: 500;
}

.job-info {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #606266;
}

.info-item:last-child {
  margin-bottom: 0;
}

.company-info {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}

.company-detail {
  margin-left: 12px;
}

.company-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.company-type {
  font-size: 12px;
  color: #909399;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.reward-info {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #e6a23c;
}

.load-more {
  text-align: center;
  margin-top: 30px;
}
</style> 