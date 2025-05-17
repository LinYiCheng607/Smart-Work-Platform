<template>
  <div class="resume-page">
    <el-card class="resume-card">
      <template #header>
        <div class="card-header">
          <h2>我的简历</h2>
          <div class="header-actions">
            <el-button type="primary" @click="handleSave">保存简历</el-button>
            <el-button @click="handlePreview">预览简历</el-button>
          </div>
        </div>
      </template>

      <!-- 基本信息 -->
      <el-form :model="resumeForm" label-width="100px">
        <h3 class="section-title">基本信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input v-model="resumeForm.basicInfo.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄">
              <el-input-number v-model="resumeForm.basicInfo.age" :min="16" :max="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="resumeForm.basicInfo.gender" placeholder="请选择性别">
                <el-option label="男" value="male" />
                <el-option label="女" value="female" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码">
              <el-input v-model="resumeForm.basicInfo.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="居住地址">
          <el-cascader
            v-model="resumeForm.basicInfo.address"
            :options="addressOptions"
            placeholder="请选择居住地址"
          />
        </el-form-item>

        <!-- 求职意向 -->
        <h3 class="section-title">求职意向</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="期望岗位">
              <el-select
                v-model="resumeForm.intention.positions"
                multiple
                placeholder="请选择期望岗位"
              >
                <el-option label="咖啡师" value="barista" />
                <el-option label="服务员" value="waiter" />
                <el-option label="收银员" value="cashier" />
                <el-option label="快递员" value="courier" />
                <el-option label="仓库管理" value="warehouse" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作类型">
              <el-select
                v-model="resumeForm.intention.jobTypes"
                multiple
                placeholder="请选择工作类型"
              >
                <el-option label="全职" value="fulltime" />
                <el-option label="兼职" value="parttime" />
                <el-option label="临时工" value="temporary" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="期望薪资">
          <el-select v-model="resumeForm.intention.salary" placeholder="请选择期望薪资">
            <el-option label="150以下/天" value="<150" />
            <el-option label="150-200/天" value="150-200" />
            <el-option label="200-300/天" value="200-300" />
            <el-option label="300以上/天" value=">300" />
          </el-select>
        </el-form-item>

        <!-- 教育经历 -->
        <h3 class="section-title">教育经历</h3>
        <div v-for="(edu, index) in resumeForm.education" :key="index" class="education-item">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="index === 0 ? '学校名称' : ''">
                <el-input v-model="edu.school" placeholder="请输入学校名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="index === 0 ? '专业' : ''">
                <el-input v-model="edu.major" placeholder="请输入专业" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="index === 0 ? '学历' : ''">
                <el-select v-model="edu.degree" placeholder="请选择学历">
                  <el-option label="高中" value="highschool" />
                  <el-option label="大专" value="college" />
                  <el-option label="本科" value="bachelor" />
                  <el-option label="硕士" value="master" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="index === 0 ? '在读时间' : ''">
                <el-date-picker
                  v-model="edu.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="item-actions" v-if="index !== 0">
            <el-button type="danger" link @click="removeEducation(index)">删除</el-button>
          </div>
        </div>
        <div class="add-button">
          <el-button type="primary" link @click="addEducation">
            <el-icon><Plus /></el-icon>添加教育经历
          </el-button>
        </div>

        <!-- 工作经验 -->
        <h3 class="section-title">工作经验</h3>
        <div v-for="(exp, index) in resumeForm.experience" :key="index" class="experience-item">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="index === 0 ? '公司名称' : ''">
                <el-input v-model="exp.company" placeholder="请输入公司名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="index === 0 ? '职位名称' : ''">
                <el-input v-model="exp.position" placeholder="请输入职位名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="index === 0 ? '工作时间' : ''">
                <el-date-picker
                  v-model="exp.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="index === 0 ? '工作类型' : ''">
                <el-select v-model="exp.type" placeholder="请选择工作类型">
                  <el-option label="全职" value="fulltime" />
                  <el-option label="兼职" value="parttime" />
                  <el-option label="实习" value="intern" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item :label="index === 0 ? '工作内容' : ''">
            <el-input
              v-model="exp.description"
              type="textarea"
              rows="3"
              placeholder="请描述您的工作内容和成果"
            />
          </el-form-item>
          <div class="item-actions" v-if="index !== 0">
            <el-button type="danger" link @click="removeExperience(index)">删除</el-button>
          </div>
        </div>
        <div class="add-button">
          <el-button type="primary" link @click="addExperience">
            <el-icon><Plus /></el-icon>添加工作经验
          </el-button>
        </div>

        <!-- 技能特长 -->
        <h3 class="section-title">技能特长</h3>
        <el-form-item label="技能标签">
          <el-select
            v-model="resumeForm.skills"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入技能标签"
          >
            <el-option label="咖啡制作" value="coffee" />
            <el-option label="餐饮服务" value="catering" />
            <el-option label="收银" value="cashier" />
            <el-option label="仓库管理" value="warehouse" />
            <el-option label="物流配送" value="delivery" />
            <el-option label="客户服务" value="customer-service" />
          </el-select>
        </el-form-item>

        <!-- 自我评价 -->
        <h3 class="section-title">自我评价</h3>
        <el-form-item>
          <el-input
            v-model="resumeForm.selfEvaluation"
            type="textarea"
            rows="4"
            placeholder="请简要描述您的个人特点和优势（建议200字以内）"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 简历表单数据
const resumeForm = ref({
  basicInfo: {
    name: '',
    age: 18,
    gender: '',
    phone: '',
    address: []
  },
  intention: {
    positions: [],
    jobTypes: [],
    salary: ''
  },
  education: [{
    school: '',
    major: '',
    degree: '',
    time: []
  }],
  experience: [{
    company: '',
    position: '',
    time: [],
    type: '',
    description: ''
  }],
  skills: [],
  selfEvaluation: ''
})

// 地址选项（示例数据）
const addressOptions = [
  {
    value: 'xiamen',
    label: '厦门市',
    children: [
      {
        value: 'siming',
        label: '思明区',
        children: [
          { value: 'zhonghua', label: '中华街道' },
          { value: 'xiahe', label: '厦禾街道' }
        ]
      },
      {
        value: 'huli',
        label: '湖里区',
        children: [
          { value: 'jinshan', label: '金山街道' },
          { value: 'heshan', label: '禾山街道' }
        ]
      }
    ]
  }
]

// 添加教育经历
const addEducation = () => {
  resumeForm.value.education.push({
    school: '',
    major: '',
    degree: '',
    time: []
  })
}

// 删除教育经历
const removeEducation = (index: number) => {
  resumeForm.value.education.splice(index, 1)
}

// 添加工作经验
const addExperience = () => {
  resumeForm.value.experience.push({
    company: '',
    position: '',
    time: [],
    type: '',
    description: ''
  })
}

// 删除工作经验
const removeExperience = (index: number) => {
  resumeForm.value.experience.splice(index, 1)
}

// 保存简历
const handleSave = () => {
  console.log('保存简历：', resumeForm.value)
  ElMessage.success('简历保存成功')
}

// 预览简历
const handlePreview = () => {
  // TODO: 实现简历预览功能
  ElMessage.info('简历预览功能开发中')
}
</script>

<style scoped>
.resume-page {
  padding: 20px;
}

.resume-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.section-title {
  margin: 20px 0 15px;
  padding-left: 10px;
  border-left: 4px solid #409EFF;
  font-size: 16px;
}

.education-item,
.experience-item {
  position: relative;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}

.item-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}

.add-button {
  margin: 10px 0 20px;
  text-align: center;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-cascader) {
  width: 100%;
}

:deep(.el-date-editor) {
  width: 100%;
}
</style> 