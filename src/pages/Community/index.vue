<template>
  <div class="community-page">
    <!-- 顶部分类标签导航 -->
    <el-tabs v-model="activeTab" class="category-tabs">
      <el-tab-pane label="推荐" name="recommended">
        <post-list :posts="currentPosts">
          <template #default="{ post }">
            <div class="post-item">
              <div class="post-header">
                <el-avatar :src="post.avatar" :size="40" />
                <div class="post-info">
                  <div class="post-author">{{ post.author }}</div>
                  <div class="post-meta">
                    <span>{{ post.time }}</span>
                    <el-tag size="small" type="warning" v-if="post.type === '兼职日记'">
                      {{ post.type }}
                    </el-tag>
                    <el-tag size="small" type="success" v-else>
                      {{ post.type }}
                    </el-tag>
                  </div>
                </div>
                <el-dropdown v-if="post.author === currentUser" trigger="click">
                  <el-button link>
                    <el-icon><More /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="editPost(post)">编辑</el-dropdown-item>
                      <el-dropdown-item @click="deletePost(post)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="post-content">
                <h3 v-if="post.title" class="post-title">{{ post.title }}</h3>
                <div class="post-text">{{ post.content }}</div>
                <div class="post-images" v-if="post.images && post.images.length">
                  <el-image
                    v-for="(img, index) in post.images"
                    :key="index"
                    :src="img"
                    :preview-src-list="post.images"
                    fit="cover"
                  />
                </div>
                <div class="post-tags" v-if="post.tags && post.tags.length">
                  <el-tag
                    v-for="tag in post.tags"
                    :key="tag"
                    size="small"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              <div class="post-footer">
                <div class="action-item" @click="likePost(post)">
                  <el-icon :class="{ active: post.isLiked }"><Star /></el-icon>
                  <span>{{ post.likes }}</span>
                </div>
                <div class="action-item" @click="showComments(post)">
                  <el-icon><ChatRound /></el-icon>
                  <span>{{ post.comments.length }}</span>
                </div>
                <div class="action-item" @click="handleShare(post)">
                  <el-icon><Share /></el-icon>
                  <span>分享</span>
                </div>
              </div>
              
              <!-- 评论区 -->
              <div class="comments-section" v-if="post.showComments">
                <div class="comment-input">
                  <el-input
                    v-model="commentText"
                    placeholder="写下你的评论..."
                    :rows="2"
                    type="textarea"
                  >
                    <template #append>
                      <el-button type="primary" @click="submitComment(post)">发表评论</el-button>
                    </template>
                  </el-input>
                </div>
                <div class="comment-list">
                  <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                    <el-avatar :src="comment.avatar" :size="32" />
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.author }}</span>
                        <span class="comment-time">{{ comment.time }}</span>
                      </div>
                      <div class="comment-text">{{ comment.content }}</div>
                      <div class="comment-actions">
                        <el-button link @click="handleReply(comment)">回复</el-button>
                        <el-button 
                          link
                          v-if="comment.author === currentUser" 
                          @click="handleDeleteComment(comment, post)"
                        >
                          删除
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </post-list>
      </el-tab-pane>
      <el-tab-pane label="兼职日记" name="diaries">
        <post-list :posts="currentPosts">
          <template #default="{ post }">
            <div class="post-item">
              <div class="post-header">
                <el-avatar :src="post.avatar" :size="40" />
                <div class="post-info">
                  <div class="post-author">{{ post.author }}</div>
                  <div class="post-meta">
                    <span>{{ post.time }}</span>
                    <el-tag size="small" type="warning" v-if="post.type === '兼职日记'">
                      {{ post.type }}
                    </el-tag>
                    <el-tag size="small" type="success" v-else>
                      {{ post.type }}
                    </el-tag>
                  </div>
                </div>
                <el-dropdown v-if="post.author === currentUser" trigger="click">
                  <el-button link>
                    <el-icon><More /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="editPost(post)">编辑</el-dropdown-item>
                      <el-dropdown-item @click="deletePost(post)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="post-content">
                <h3 v-if="post.title" class="post-title">{{ post.title }}</h3>
                <div class="post-text">{{ post.content }}</div>
                <div class="post-images" v-if="post.images && post.images.length">
                  <el-image
                    v-for="(img, index) in post.images"
                    :key="index"
                    :src="img"
                    :preview-src-list="post.images"
                    fit="cover"
                  />
                </div>
                <div class="post-tags" v-if="post.tags && post.tags.length">
                  <el-tag
                    v-for="tag in post.tags"
                    :key="tag"
                    size="small"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              <div class="post-footer">
                <div class="action-item" @click="likePost(post)">
                  <el-icon :class="{ active: post.isLiked }"><Star /></el-icon>
                  <span>{{ post.likes }}</span>
                </div>
                <div class="action-item" @click="showComments(post)">
                  <el-icon><ChatRound /></el-icon>
                  <span>{{ post.comments.length }}</span>
                </div>
                <div class="action-item" @click="handleShare(post)">
                  <el-icon><Share /></el-icon>
                  <span>分享</span>
                </div>
              </div>
              
              <!-- 评论区 -->
              <div class="comments-section" v-if="post.showComments">
                <div class="comment-input">
                  <el-input
                    v-model="commentText"
                    placeholder="写下你的评论..."
                    :rows="2"
                    type="textarea"
                  >
                    <template #append>
                      <el-button type="primary" @click="submitComment(post)">发表评论</el-button>
                    </template>
                  </el-input>
                </div>
                <div class="comment-list">
                  <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                    <el-avatar :src="comment.avatar" :size="32" />
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.author }}</span>
                        <span class="comment-time">{{ comment.time }}</span>
                      </div>
                      <div class="comment-text">{{ comment.content }}</div>
                      <div class="comment-actions">
                        <el-button link @click="handleReply(comment)">回复</el-button>
                        <el-button 
                          link
                          v-if="comment.author === currentUser" 
                          @click="handleDeleteComment(comment, post)"
                        >
                          删除
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </post-list>
      </el-tab-pane>
      <el-tab-pane label="企业招聘" name="jobs">
        <company-list :companies="companies">
          <template #default="{ company }">
            <el-card class="company-card">
              <div class="company-header">
                <el-avatar :src="company.logo" :size="60" />
                <div class="company-info">
                  <h3>{{ company.name }}</h3>
                  <p>{{ company.description }}</p>
                  <div class="company-tags">
                    <el-tag size="small" type="info">{{ company.industry }}</el-tag>
                    <el-tag size="small" type="success" v-if="company.isVerified">企业认证</el-tag>
                  </div>
                </div>
                <el-button 
                  type="primary" 
                  :icon="company.isFollowed ? 'Check' : 'Plus'"
                  @click="toggleFollow(company)"
                >
                  {{ company.isFollowed ? '已关注' : '关注' }}
                </el-button>
              </div>
              <div class="job-list">
                <div v-for="job in company.jobs" :key="job.id" class="job-item">
                  <div class="job-info">
                    <h4>{{ job.title }}</h4>
                    <div class="job-meta">
                      <span class="salary">{{ job.salary }}元/天</span>
                      <span class="location">{{ job.location }}</span>
                    </div>
                  </div>
                  <el-button type="primary" size="small" @click="viewJobDetail(job)">查看详情</el-button>
                </div>
              </div>
            </el-card>
          </template>
        </company-list>
      </el-tab-pane>
      <el-tab-pane label="经验分享" name="experience">
        <post-list :posts="currentPosts">
          <template #default="{ post }">
            <div class="post-item">
              <div class="post-header">
                <el-avatar :src="post.avatar" :size="40" />
                <div class="post-info">
                  <div class="post-author">{{ post.author }}</div>
                  <div class="post-meta">
                    <span>{{ post.time }}</span>
                    <el-tag size="small" type="warning" v-if="post.type === '兼职日记'">
                      {{ post.type }}
                    </el-tag>
                    <el-tag size="small" type="success" v-else>
                      {{ post.type }}
                    </el-tag>
                  </div>
                </div>
                <el-dropdown v-if="post.author === currentUser" trigger="click">
                  <el-button link>
                    <el-icon><More /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="editPost(post)">编辑</el-dropdown-item>
                      <el-dropdown-item @click="deletePost(post)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="post-content">
                <h3 v-if="post.title" class="post-title">{{ post.title }}</h3>
                <div class="post-text">{{ post.content }}</div>
                <div class="post-images" v-if="post.images && post.images.length">
                  <el-image
                    v-for="(img, index) in post.images"
                    :key="index"
                    :src="img"
                    :preview-src-list="post.images"
                    fit="cover"
                  />
                </div>
                <div class="post-tags" v-if="post.tags && post.tags.length">
                  <el-tag
                    v-for="tag in post.tags"
                    :key="tag"
                    size="small"
                    effect="plain"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              <div class="post-footer">
                <div class="action-item" @click="likePost(post)">
                  <el-icon :class="{ active: post.isLiked }"><Star /></el-icon>
                  <span>{{ post.likes }}</span>
                </div>
                <div class="action-item" @click="showComments(post)">
                  <el-icon><ChatRound /></el-icon>
                  <span>{{ post.comments.length }}</span>
                </div>
                <div class="action-item" @click="handleShare(post)">
                  <el-icon><Share /></el-icon>
                  <span>分享</span>
                </div>
              </div>
              
              <!-- 评论区 -->
              <div class="comments-section" v-if="post.showComments">
                <div class="comment-input">
                  <el-input
                    v-model="commentText"
                    placeholder="写下你的评论..."
                    :rows="2"
                    type="textarea"
                  >
                    <template #append>
                      <el-button type="primary" @click="submitComment(post)">发表评论</el-button>
                    </template>
                  </el-input>
                </div>
                <div class="comment-list">
                  <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                    <el-avatar :src="comment.avatar" :size="32" />
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.author }}</span>
                        <span class="comment-time">{{ comment.time }}</span>
                      </div>
                      <div class="comment-text">{{ comment.content }}</div>
                      <div class="comment-actions">
                        <el-button link @click="handleReply(comment)">回复</el-button>
                        <el-button 
                          link
                          v-if="comment.author === currentUser" 
                          @click="handleDeleteComment(comment, post)"
                        >
                          删除
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </post-list>
      </el-tab-pane>
      <el-tab-pane label="活动" name="activities">
        <activity-list :activities="activities">
          <template #default="{ activity }">
            <el-card class="activity-card">
              <div class="activity-content">
                <el-image :src="activity.image" class="activity-image" />
                <div class="activity-info">
                  <h3>{{ activity.title }}</h3>
                  <p>{{ activity.description }}</p>
                  <div class="activity-meta">
                    <el-tag 
                      size="small" 
                      :type="activity.status === '进行中' ? 'success' : activity.status === '即将开始' ? 'warning' : 'info'"
                    >
                      {{ activity.status }}
                    </el-tag>
                    <span class="time">{{ activity.time }}</span>
                    <span class="participants">{{ activity.participants }}人参与</span>
                  </div>
                </div>
              </div>
              <div class="activity-footer">
                <el-button type="primary" @click="joinActivity(activity)">立即参与</el-button>
                <el-button type="text" @click="shareActivity(activity)">分享活动</el-button>
              </div>
            </el-card>
          </template>
        </activity-list>
      </el-tab-pane>
    </el-tabs>

    <!-- 发布按钮 -->
    <el-button
      class="publish-btn"
      type="primary"
      circle
      @click="showPublishDialog"
    >
      <el-icon><Plus /></el-icon>
    </el-button>

    <!-- 发布对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑内容' : '发布动态'"
      width="600px"
    >
      <el-form :model="postForm" :rules="postRules" ref="postFormRef">
        <el-form-item prop="category">
          <el-select v-model="postForm.category" placeholder="选择分类">
            <el-option label="兼职日记" value="diary" />
            <el-option label="经验分享" value="experience" />
          </el-select>
        </el-form-item>
        <el-form-item prop="title" v-if="postForm.category === 'experience'">
          <el-input v-model="postForm.title" placeholder="标题（经验分享必填）" />
        </el-form-item>
        <el-form-item prop="content">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="4"
            placeholder="分享你的兼职经历..."
          />
        </el-form-item>
        <el-form-item>
          <el-upload
            action="/api/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :headers="uploadHeaders"
            multiple
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                支持 jpg/png 格式图片，单个文件不超过 2MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="postForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="添加标签"
          >
            <el-option
              v-for="tag in commonTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePublish">
            {{ isEditing ? '保存' : '发布' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog v-model="previewVisible">
      <img w-full :src="previewImage" alt="Preview" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Star, ChatRound, Share, More, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, UploadProps } from 'element-plus'
import type { Post, Company, Activity, PostForm, Comment, UploadFile, Job, PostCreateData } from '@/types/community'
import { postApi, companyApi, activityApi } from '@/api/community'
import PostList from '@/components/PostList.vue'
import CompanyList from '@/components/CompanyList.vue'
import ActivityList from '@/components/ActivityList.vue'

// 当前用户
const currentUser = ref('张三')

// 标签页状态
const activeTab = ref('recommended')
const dialogVisible = ref(false)
const isEditing = ref(false)
const previewVisible = ref(false)
const previewImage = ref('')
const commentText = ref('')

// 表单相关
const postFormRef = ref<FormInstance>()
const postForm = ref<PostForm>({
  category: '',
  title: '',
  content: '',
  images: [],
  tags: []
})

const postRules = {
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

// 常用标签
const commonTags = [
  '兼职经验',
  '求职技巧',
  '薪资待遇',
  '工作环境',
  '面试技巧',
  '职场交流'
]

// 模拟数据
const recommendedPosts = ref<Post[]>([
  {
    id: 1,
    author: '张三',
    avatar: '/avatars/user1.jpg',
    type: '兼职日记',
    time: '10分钟前',
    content: '今天在便利店兼职，遇到很多有趣的顾客，收获满满！',
    images: ['/images/post1.jpg'],
    likes: 45,
    isLiked: false,
    comments: [
      {
        id: 1,
        author: '李四',
        avatar: '/avatars/user2.jpg',
        content: '分享得很详细，感谢！',
        time: '5分钟前'
      }
    ],
    showComments: false,
    tags: ['便利店', '兼职经验']
  }
])

const companies = ref<Company[]>([
  {
    id: 1,
    name: '星巴克咖啡',
    logo: '/logos/starbucks.png',
    description: '全球知名连锁咖啡品牌',
    industry: '餐饮服务',
    isVerified: true,
    isFollowed: false,
    jobs: [
      {
        id: 1,
        title: '咖啡师助理',
        salary: '200-300',
        location: '市中心店'
      },
      {
        id: 2,
        title: '收银员',
        salary: '180-220',
        location: '万达广场店'
      }
    ]
  }
])

const activities = ref<Activity[]>([
  {
    id: 1,
    title: '寒假兼职专场招聘会',
    description: '为在校学生提供优质寒假兼职机会，现场面试，即时录用',
    image: '/images/activity1.jpg',
    status: '进行中',
    time: '2024-01-20 14:00',
    participants: 128
  }
])

// 计算当前要显示的帖子列表
const currentPosts = computed<Post[]>(() => {
  switch (activeTab.value) {
    case 'recommended':
      return recommendedPosts.value
    case 'diaries':
      return recommendedPosts.value.filter(post => post.type === '兼职日记')
    case 'experience':
      return recommendedPosts.value.filter(post => post.type === '经验分享')
    default:
      return []
  }
})

// 上传相关
const uploadHeaders = {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

// 方法
const showPublishDialog = () => {
  isEditing.value = false
  postForm.value = {
    category: '',
    title: '',
    content: '',
    images: [],
    tags: []
  }
  dialogVisible.value = true
}

const handlePublish = async () => {
  if (!postFormRef.value) return
  
  try {
    await postFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        const type = postForm.value.category === 'diary' ? '兼职日记' : '经验分享'
        const baseData: PostCreateData = {
          type,
          title: postForm.value.title || '',
          content: postForm.value.content,
          images: postForm.value.images,
          tags: postForm.value.tags,
          author: currentUser.value,
          avatar: '/avatars/default.jpg',
          time: '刚刚',
          likes: 0,
          isLiked: false,
          comments: []
        }

        if (isEditing.value && editingPostId.value) {
          // 更新帖子
          const updatedPost = await postApi.updatePost(editingPostId.value, baseData)
          const index = recommendedPosts.value.findIndex(p => p.id === editingPostId.value)
          if (index > -1) {
            recommendedPosts.value[index] = { ...recommendedPosts.value[index], ...updatedPost }
          }
          ElMessage.success('更新成功')
        } else {
          // 创建新帖子
          const newPost = await postApi.createPost(baseData)
          recommendedPosts.value.unshift(newPost)
          ElMessage.success('发布成功')
        }
        
        dialogVisible.value = false
        resetForm()
      }
    })
  } catch (error) {
    console.error('发布出现问题，请稍后重试:', error)
    ElMessage({
      type: 'info',
      message: '网络繁忙，请稍后重试'
    })
  }
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  if (uploadFile.url) {
    previewImage.value = uploadFile.url
    previewVisible.value = true
  }
}

const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
  if (uploadFile.url) {
    const index = postForm.value.images.indexOf(uploadFile.url)
    if (index > -1) {
      postForm.value.images.splice(index, 1)
    }
  }
}

const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  postForm.value.images.push(response.url)
}

const likePost = (post: Post) => {
  post.isLiked = !post.isLiked
  post.likes += post.isLiked ? 1 : -1
}

const showComments = (post: Post) => {
  post.showComments = !post.showComments
}

const submitComment = (post: Post) => {
  if (!commentText.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  const newComment: Comment = {
    id: Date.now(),
    author: currentUser.value,
    avatar: '/avatars/default.jpg',
    content: commentText.value,
    time: '刚刚'
  }

  post.comments.unshift(newComment)
  commentText.value = ''
  ElMessage.success('评论成功')
}

const editPost = (post: Post) => {
  isEditing.value = true
  editingPostId.value = post.id
  postForm.value = {
    category: post.type === '兼职日记' ? 'diary' : 'experience',
    title: post.title || '',
    content: post.content,
    images: [...post.images],
    tags: [...post.tags]
  }
  dialogVisible.value = true
}

const deletePost = async (post: Post) => {
  try {
    await ElMessageBox.confirm('确定要删除这条动态吗？', '提示', {
      type: 'warning'
    })
    await postApi.deletePost(post.id)
    const index = recommendedPosts.value.findIndex(p => p.id === post.id)
    if (index > -1) {
      recommendedPosts.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const toggleFollow = (company: Company) => {
  company.isFollowed = !company.isFollowed
  ElMessage.success(company.isFollowed ? '关注成功' : '已取消关注')
}

const viewJobDetail = (job: Job) => {
  // 跳转到岗位详情页
  console.log('查看岗位详情:', job)
}

const joinActivity = (activity: Activity) => {
  ElMessage.success('报名成功')
  activity.participants++
}

const shareActivity = (activity: Activity) => {
  // 实现分享功能
  ElMessage.success('分享链接已复制')
}

const handleShare = (post: Post) => {
  // 实现分享功能
  ElMessage.success('分享链接已复制')
}

const handleReply = (comment: Comment) => {
  commentText.value = `@${comment.author} `
}

const handleDeleteComment = async (comment: Comment, post: Post) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
      type: 'warning'
    })
    const index = post.comments.findIndex(c => c.id === comment.id)
    if (index > -1) {
      post.comments.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}

// 编辑帖子
const editingPostId = ref<number | null>(null)

// 重置表单
const resetForm = () => {
  postForm.value = {
    category: '',
    title: '',
    content: '',
    images: [],
    tags: []
  }
  editingPostId.value = null
}

// 组件挂载时加载数据
onMounted(() => {
  loadPosts()
})

// 加载帖子数据
const loadPosts = async () => {
  try {
    const posts = await postApi.getPosts()
    recommendedPosts.value = posts
  } catch (error) {
    ElMessage.error('获取帖子失败')
  }
}
</script>

<style scoped>
.community-page {
  padding: 20px;
  position: relative;
}

.category-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.publish-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 100;
}

.post-item {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.post-info {
  flex: 1;
  margin-left: 12px;
}

.post-author {
  font-weight: bold;
  margin-bottom: 4px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #909399;
  font-size: 12px;
}

.post-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 500;
}

.post-content {
  margin-bottom: 15px;
}

.post-text {
  line-height: 1.6;
  margin-bottom: 12px;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.post-images .el-image {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  border-radius: 4px;
  overflow: hidden;
}

.post-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.post-footer {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #606266;
  cursor: pointer;
}

.action-item:hover {
  color: #409EFF;
}

.action-item .active {
  color: #e6a23c;
}

.comments-section {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.comment-input {
  margin-bottom: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  margin-bottom: 4px;
}

.comment-author {
  font-weight: 500;
  margin-right: 8px;
}

.comment-time {
  color: #909399;
  font-size: 12px;
}

.comment-text {
  line-height: 1.5;
  margin-bottom: 4px;
}

.comment-actions {
  display: flex;
  gap: 12px;
}

.company-card {
  margin-bottom: 20px;
}

.company-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.company-info {
  flex: 1;
  margin: 0 20px;
}

.company-info h3 {
  margin: 0 0 8px 0;
}

.company-info p {
  color: #606266;
  margin: 0 0 12px 0;
}

.company-tags {
  display: flex;
  gap: 8px;
}

.job-list {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.job-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.job-item:last-child {
  border-bottom: none;
}

.job-info h4 {
  margin: 0 0 8px 0;
}

.job-meta {
  color: #606266;
  font-size: 14px;
}

.job-meta .salary {
  color: #f56c6c;
  margin-right: 15px;
}

.activity-card {
  margin-bottom: 20px;
}

.activity-content {
  display: flex;
  gap: 20px;
}

.activity-image {
  width: 200px;
  height: 120px;
  border-radius: 4px;
  object-fit: cover;
}

.activity-info {
  flex: 1;
}

.activity-info h3 {
  margin: 0 0 12px 0;
}

.activity-info p {
  color: #606266;
  margin: 0 0 12px 0;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #909399;
  font-size: 14px;
}

.activity-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}
</style> 